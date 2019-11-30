import React, { Component } from 'react';
import { Button, Col, Card, CardBody, CardHeader, Container, Row, Alert } from 'reactstrap';
import Bills from '../../bills/Bills';
import PaymentApi from '../../../services/PaymentApi';
import Store from '../../../data/Store';
import Config from '../../../data/Config';
import {BillPaymentForm} from './BillPaymentForm'
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import { billType } from '../../../data/GlobalKeys';
import ViewPayment from './ViewPayment';

class BillPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: Store.getCurrencies(),
            paidAmount: props.paidAmount
        };
    }

    componentDidMount = () => {
        const {bill}=this.props.data
        if (bill.amount < 0) {
            let tempAmount = "" + bill.amount;
            this.setState({ amount: tempAmount.split('-')[1] });
        }
    }
    handleSubmitValue = async (event, errors, values) => {
        const  {profileId, bill, updatePayment} =this.props.data
        const {update}=this.props
        if (errors.length === 0) {
            this.setState({ doubleClick: true });
            let date = values.date.split("-")[0] + values.date.split("-")[1] + values.date.split("-")[2];
            let newData = { ...values, "date": date }
            if(update){
                // This blovk Execute the update bill payment
                await new PaymentApi().updateBillPayment(this.handleSuccessCall, this.handleErrorCall, profileId, bill.id, updatePayment.txId, newData);
            }else{
                // This block Execuet the create a bill payment 
                await new PaymentApi().addBillPayment(this.handleSuccessCall, this.handleErrorCall, profileId, bill.id, newData);
            }
        } else {
            this.setState({ doubleClick: false });
        }
    }

    handleSuccessCall = (response) => {
        const {bill, paidAmount} =this.props.data
        let paidAmountResult = paidAmount === 0 ?bill.amount : paidAmount;
        // Checking Full payment paid or not.
        if (response.amount - (paidAmountResult) === 0) {
            this.setState({ alertColor: "success", alertMessage: "BillPayment added succesfully !!", paid: true });
        } else {
            this.setState({ alertColor: "success", alertMessage: "BillPayment added succesfully !!" });
        }
        setTimeout(() => {
            this.setState({ cancelPayment: true, alertColor: "", alertMessage: "" });
        }, Config.apiTimeoutMillis)
    }

    handleErrorCall = (error) => { this.setState({ doubleClick: false }); }

    handlePaidDate = (date) => {
        return ShowServiceComponent.customDate(date);
    }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

     render() {
        const { cancelPayment, currencies } = this.state;
        const { bill, profileId } = this.props.data;
        return cancelPayment ? <ViewPayment bill={bill} profileId={profileId} /> : <div> {this.loadPayment(bill)} </div>
    }

    loadPayment = (bill) => {
        const { currencies } =this.state
        let selectedCurrency = currencies && currencies.filter(currency=> currency.code === bill.currency);
        const name = bill.description ? bill.description : bill.categoryName.name
        let billDate = (bill.billDate + "").slice(0, 4) + "-" + (bill.billDate + "").slice(4, 6) + "-" + (bill.billDate + "").slice(6, 8);
        return <div>
                    {this.state.alertMessage && <Alert color={this.state.alertColor} >{this.state.alertMessage}</Alert>}
                    <Row>
                        <Col sm={3} md={3} xl={3} lg={3}>Bill Amount:</Col>
                        <Col> {selectedCurrency.symbol} &nbsp;{bill.amount > 0 ? bill.amount : -(bill.amount)} </Col>
                    </Row> <br />
                    <Row>
                        <Col sm={3} md={3} xl={3} lg={3}>Bill Date:</Col>
                        <Col>{billDate}</Col>
                    </Row> <br />
                    <Row>
                        <Col sm={3} md={3} xl={3} lg={3}>Bill Notes / Description: </Col>
                        <Col>{name}</Col>
                    </Row> <br />
                    {bill.paid ? this.loadPaidMessage() : this.loadBillPaymentForm(selectedCurrency[0], bill)}
            </div>
    }

    loadPaidMessage = () => {
        return <>  <br /> <br />
            <h3> Congratulations! This bill is paid.</h3> <br />
            <Button type="button" onClick={this.cancelPayment}>Cancel</Button>
        </>
    }

    loadBillPaymentForm = (selectedCurrency, bill) => {
        // bill type is json object globaly decalre
        const { paymentType } = billType;
        const {paidAmount, updatePayment}= this.props.data
        const {update}=this.props
        let formData = {
            bill: bill,
            paidAmount:  update ? this.calculateRemAmt(updatePayment.amount): this.calculateRemAmt(paidAmount) ,
            updateDate:  update && updatePayment.date,
            updateNote:  update && updatePayment.notes,
            paymentType: bill.amountType === billType.PAYABLE ? paymentType.PAID :paymentType.RECEIVED,
            doubleClick: this.state.doubleClick,
            amountLable: "Payment Amount ("+ selectedCurrency.symbol +")",
            buttonText : update ? 'Edit Payment ': 'Save Payment'
        }
        return <BillPaymentForm data = {formData} handleSubmitValue = {this.handleSubmitValue} calculateRemAmt = {this.calculateRemAmt}
            handlePaidDate = {this.handlePaidDate} cancelPayment= {this.cancelPayment} />
    }

    calculateRemAmt = (paidAmount) => {
        const {bill}=this.props.data;
        if (paidAmount) {
            return paidAmount < 0 ? -(paidAmount) : paidAmount;
        } else {
            return bill.amount < 0 ? -(bill.amount) : bill.amount;
        }
    }
}

export default BillPayment;