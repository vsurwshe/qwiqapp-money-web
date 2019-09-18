import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button, Col, Card, CardBody, CardHeader, Container, Row, Alert } from 'reactstrap';
import Bills from '../../bills/Bills';
import PaymentApi from '../../../services/PaymentApi';
import Store from '../../../data/Store';
import Config from '../../../data/Config';

class BillPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bill: props.bill,
            currencies: Store.getCurrencies(),
            billAmount: props.bill.amount,
            payAmount: props.markPaid ? props.bill.amount : 0,
            payDate: props.markPaid ? this.handlePaidDate() : '',
            alertColor: '',
            alertMessage: '',
            billType: props.bill.amount > 0,
            paidAmount : props.paidAmount,
        };
    }

    componentDidMount = () => {
        if (this.props.bill.amount < 0) {
            let tempAmount = "" + this.props.bill.amount;
            this.setState({ amount: tempAmount.split('-')[1] });
        }
    }

    handleSubmitValue = async (event, errors, values) => {
        let amount;
        if (errors.length === 0) {
            amount = values.amount
            this.setState({ doubleClick: true });
            let date = values.date.split("-")[0] + values.date.split("-")[1] + values.date.split("-")[2];
            let data = { ...values, "date": date, "amount": this.props.bill.amount < 0 ? -values.amount : values.amount }
            await new PaymentApi().addBillPayment((response)=>{this.handleSuccessCall(response, this.state.billAmount, this.state.paidAmount, amount)}, this.handleErrorCall, this.props.profileId, this.props.bill.id, data);
        } else {
            this.setState({ doubleClick: false });
        }
    }

    handleSuccessCall = (response, billAmount, paidAmount, amount) => {
        billAmount = billAmount <0 ? -(billAmount) : billAmount
        if( billAmount === (paidAmount+amount)){
            this.setState({ alertColor: "success", alertMessage: "BillPayment added succesfully !!" , paid: true});
        } else{
            this.setState({ alertColor: "success", alertMessage: "BillPayment added succesfully !!" });
        }
       
        setTimeout(() => {
            this.setState({ cancelPayment: true, alertColor: "", alertMessage: "" });
        }, Config.apiTimeoutMillis)
    }

    handleErrorCall = (error) => {
        console.log(error);
        this.setState({ doubleClick: false });
    }

    handlePaidDate = () => {
        let today = new Date()
        return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(today);
    }

    calculate = () => { this.setState({ calculate: !this.state.calculate }); }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

    handleBillType = () => {
        this.setState({ billType: !this.state.billType });
    }

    render() {
        const { cancelPayment, currencies } = this.state
        const { bill } = this.props
        let selectedCurrency = currencies.filter((currency, index) => { return currency.code === bill.currency })
        return cancelPayment ? <Bills paid={this.state.paid} /> : <div> {this.loadPayment(bill, selectedCurrency[0])} </div>
    }

    loadPayment = (bill, selectedCurrency) => {
        const name = bill.description ? bill.description : bill.categoryName.name
        let billDate = (bill.billDate + "").slice(0, 4) + "-" + (bill.billDate + "").slice(4, 6) + "-" + (bill.billDate + "").slice(6, 8);
        return <Card className="card-accent-primary">
            <CardHeader> Bill Payment</CardHeader>
            <CardBody>
                <Container>
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
                        {bill.paid ? this.loadPaidMessage() : this.loadBillPaymentForm(selectedCurrency, bill)}
                        
                </Container>
            </CardBody>
        </Card>
    }

    loadPaidMessage=()=>{
        return <>
         <br />
         <br />
        <h3> Congratulations! This bill is paid.</h3> <br/>
        <Button type="button" onClick={this.cancelPayment}>Cancel</Button>
        </>
    }

    loadBillPaymentForm =(selectedCurrency,bill)=>{
        return <>
        <AvForm onSubmit={this.handleSubmitValue}>
                        <Row>
                            <Col xs="12" sm="5">
                                <AvField type="number" name="amount" label={`Payment Amount (${selectedCurrency.symbol})`} placeholder="Amount" value={this.calculateRemAmt(bill.amount, this.props.paidAmount)} errorMessage="Enter payment amount" required />
                            </Col>
                            <Col xs="6" sm="4">
                                <AvField type="date" name="date" label="Payment Date" value={this.state.payDate} errorMessage="Select payment date" required />
                            </Col>
                            <Col xs="6" sm="3" >
                                <AvField type="select" name="type" label="Payment Type" errorMessage="Select type of payment" required>
                                    <option value="">Select type of payment</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Received">Received</option>
                                </AvField>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <AvField type="textarea" name="notes" label="Payment Notes / Description" placeholder="Payment description" />
                            </Col>
                        </Row>
                        <FormGroup >
                                <Button color="success" disabled={this.state.doubleClick}> Save  </Button> &nbsp;&nbsp;
                                <Button type="button" onClick={this.cancelPayment}>Cancel</Button>
                        </FormGroup>
                    </AvForm>
        </>
    }

    calculateRemAmt = (billAmount, paidAmount) =>{
       if(billAmount < 0){
           billAmount = -(billAmount)
       }
       return  paidAmount ? billAmount - paidAmount : billAmount
       
    }
}

export default BillPayment;