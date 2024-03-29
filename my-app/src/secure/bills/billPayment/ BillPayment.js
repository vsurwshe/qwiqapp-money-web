import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import PaymentApi from '../../../services/PaymentApi';
import Store from '../../../data/Store';
import Config from '../../../data/Config';
import { BillPaymentForm } from './BillPaymentForm'
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
        const { bill } = this.props.data
        if (bill.amount < 0) {
            let tempAmount = "" + bill.amount;
            this.setState({ amount: tempAmount.split('-')[1] });
        }
    }
    handleSubmitValue = async (event, errors, values) => {
        const { profileId, bill, updatePayment } = this.props.data
        const { update } = this.props
        if (errors.length === 0) {
            this.setState({ doubleClick: true });
            let date = values.date.split("-")[0] + values.date.split("-")[1] + values.date.split("-")[2];
            let newData = { ...values, "date": date }
            if (update) {
                await new PaymentApi().updateBillPayment(this.handleSuccessCall, this.handleErrorCall, profileId, bill.id, updatePayment.txId, newData);
            } else {
                await new PaymentApi().addBillPayment(this.handleSuccessCall, this.handleErrorCall, profileId, bill.id, newData);
            }
        } else {
            this.setState({ doubleClick: false });
        }
    }

    handleSuccessCall = (response) => {
        const { bill, paidAmount } = this.props.data;
        const { update } = this.props;
        let paidAmountResult = paidAmount === 0 ? bill.amount : paidAmount;
        let alertMsg = update ? "Bill payment update succesfully !!" : "Bill payment added  succesfully !!"
        // Checking Full payment paid or not.
        if (response.amount - (paidAmountResult) === 0) {
            this.setState({ paid: true });
        } 
        this.setAlertMessage("success", alertMsg);
        
        this.callTimer();
    }

    callTimer =()=>{
        setTimeout(() => {
            this.setState({ cancelPayment: true });
            this.setAlertMessage("", "");
        }, Config.apiTimeoutMillis)
    }
    setAlertMessage=(alertColor, alertMessage)=>{
        this.setState({ alertColor, alertMessage });
    }

    handleErrorCall = (error) => {
        const response = error.response ? error.response : '';
        if (response) {
            this.setAlertMessage("danger", "Unable to process request, please try again.");
        } else {
           this.setAlertMessage("danger", "Please check your internet connection and re-try again."); 
        }
        this.setState({ doubleClick: false });
        this.callTimer();
    }

    handlePaidDate = (date) => {
        return ShowServiceComponent.customDate(date);
    }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

    render() {
        const { cancelPayment, paid } = this.state;
        const { bill, profileId } = this.props.data;
        return cancelPayment ? <ViewPayment bill={bill} profileId={profileId} billPaid={paid} paymentCount={this.props.paymentCount} /> : <div> {this.loadPayment(bill)} </div>
    }

    loadPayment = (bill) => {
        const { currencies, alertColor, alertMessage} = this.state
        let notes = this.setNotes(bill);
        let selectedCurrency = currencies && currencies.filter(currency => currency.code === bill.currency);
        let billDate = (bill.billDate + "").slice(0, 4) + "-" + (bill.billDate + "").slice(4, 6) + "-" + (bill.billDate + "").slice(6, 8);
        return <div>
            {alertMessage && ShowServiceComponent.loadAlert(alertColor, alertMessage)}
            <div className=" container shadow p-3 mb-1 md-white rounded border border-dark">
                <Row>
                    <Col sm={4}>Bill Amount:</Col>
                    <Col sm={7}> {selectedCurrency[0].symbol} &nbsp;{bill.amount > 0 ? bill.amount : -(bill.amount)} </Col>
                </Row> <br />
                <Row>
                    <Col sm={4}>Bill Date:</Col>
                    <Col sm={7}>{billDate}</Col>
                </Row> <br />
                <Row>
                    <Col sm={4}>Bill Notes / Description: </Col>
                    <Col sm={7}>{notes}</Col>
                </Row>
            </div> <br />
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
        const { paidAmount, updatePayment } = this.props.data
        const { update } = this.props
        let formData = {
            bill: bill,
            paidAmount: update ? this.calculateRemAmt(updatePayment.amount) : this.calculateRemAmt(paidAmount),
            updateDate: update && updatePayment.date,
            updateNote: update && updatePayment.notes,
            paymentType: bill.amountType === billType.PAYABLE ? paymentType.PAID : paymentType.RECEIVED,
            doubleClick: this.state.doubleClick,
            amountLable: "Payment amount (" + selectedCurrency.symbol + ")",
            buttonText: update ? 'Edit' : 'Save'
        }
        return <BillPaymentForm data={formData}
            handleSubmitValue={this.handleSubmitValue}
            calculateRemAmt={this.calculateRemAmt}
            handlePaidDate={this.handlePaidDate}
            cancelPayment={this.cancelPayment} />
    }

    calculateRemAmt = (paidAmount) => {
        const { bill } = this.props.data;
        if (paidAmount) {
            return paidAmount < 0 ? -(paidAmount) : paidAmount;
        } else {
            return bill.amount < 0 ? -(bill.amount) : bill.amount;
        }
    }

    setNotes = (bill) => {
        let notes = "";
        if (bill.description) {
            notes = bill.description
        } else if (bill.categoryName) {
            notes = bill.categoryName.name
        } else {
            const categories = Store.getCategories();
            const category = categories && categories.length > 0 && categories.filter(item => item.id === bill.categoryId)
            notes = category && category[0].name
        }
        return notes;
    }
}

export default BillPayment;