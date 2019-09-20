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
            currencies: Store.getCurrencies(),
            alertColor: '',
            alertMessage: '',
            paidAmount: props.paidAmount
        };
    }

    componentDidMount = () => {
        if (this.props.bill.amount < 0) {
            let tempAmount = "" + this.props.bill.amount;
            this.setState({ amount: tempAmount.split('-')[1] });
        }
    }

    handleSubmitValue = async (event, errors, values) => {
        const  {profileId, bill} =this.props
        if (errors.length === 0) {
            this.setState({ doubleClick: true });
            let date = values.date.split("-")[0] + values.date.split("-")[1] + values.date.split("-")[2];
            let newData = { ...values, "date": date }
            await new PaymentApi().addBillPayment(this.handleSuccessCall, this.handleErrorCall, profileId, bill.id, newData);
        } else {
            this.setState({ doubleClick: false });
        }
    }

    handleSuccessCall = (response) => {
        let paidAmountResult = this.props.paidAmount === 0 ? this.props.bill.amount : this.props.paidAmount;
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

    handlePaidDate = () => {
        return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
    }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

    render() {
        const { cancelPayment, currencies } = this.state
        const { bill } = this.props
        let selectedCurrency = currencies.filter((currency) => { return currency.code === bill.currency })
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

    loadPaidMessage = () => {
        return <>  <br /> <br />
            <h3> Congratulations! This bill is paid.</h3> <br />
            <Button type="button" onClick={this.cancelPayment}>Cancel</Button>
        </>
    }

    loadBillPaymentForm = (selectedCurrency, bill) => {
        return <AvForm onSubmit={this.handleSubmitValue}>
            <Row>
                <Col xs="12" sm="5">
                    <AvField type="number" name="amount" label={`Payment Amount (${selectedCurrency.symbol})`} placeholder="Amount" value={this.calculateRemAmt(this.props.paidAmount)} errorMessage="Invaild payment amount" required />
                </Col>
                <Col xs="6" sm="4">
                    <AvField type="date" name="date" label="Payment Date" value={this.handlePaidDate()} errorMessage="Select payment date" required />
                </Col>
                <Col xs="6" sm="3" >
                    <AvField type="select" name="type" label="Payment Type" errorMessage="Select type of payment" value={bill.type === 'EXPENSE_PAYABLE' ? "Paid" : "Received"} required>
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
    }

    calculateRemAmt = (paidAmount) => {
        const {bill}=this.props;
        if (paidAmount) {
            return paidAmount < 0 ? -(paidAmount) : paidAmount;
        } else {
            return bill.amount < 0 ? -(bill.amount) : bill.amount;
        }
    }
}

export default BillPayment;