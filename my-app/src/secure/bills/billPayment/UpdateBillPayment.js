import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button, Col, Card, CardBody, CardHeader, Container, Row, Alert } from 'reactstrap';
import PaymentApi from '../../../services/PaymentApi';
import Config from '../../../data/Config';
import ViewPayment from './ViewPayment';

class UpdateBillPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelPayment: false,
        };
    }

    handleSubmitValue = async (event, errors, values) => {
        const { profileId, updatePayment, bill } = this.props
        if (errors.length === 0) {
            this.setState({ doubleClick: true });
            let date = values.date.split("-")[0] + values.date.split("-")[1] + values.date.split("-")[2];
            let newData = { ...values, "date": date }
            await new PaymentApi().updateBillPayment(this.handleSuccessCall, this.handleErrorCall, profileId, bill.id, updatePayment.txId, newData);
        } else {
            this.setState({ doubleClick: false });
        }
    }

    handleSuccessCall = (response) => {
        this.setState({ alertColor: "success", alertMessage: "BillPayment updated succesfully !!" });
        setTimeout(() => {
            this.setState({ cancelPayment: true, alertColor: "", alertMessage: "" });
        }, Config.apiTimeoutMillis)
    }

    handleErrorCall = (error) => { this.setState({ doubleClick: false }); }

    handlePaidDate = () => { return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()); }

    calculate = () => { this.setState({ calculate: !this.state.calculate }); }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

    handleBillType = () => { this.setState({ billType: !this.state.billType }); }

    render() {
        const { bill, currency, updatePayment } = this.props
        return this.state.cancelPayment ?
            <ViewPayment bill={bill} profileId={this.props.profileId} cancel={this.props.cancelViewPay} />
            : <div> {this.loadPayment(bill, currency, updatePayment)} </div>
    }

    loadPayment = (bill, currency, updatePayment) => {
        const name = bill.description ? bill.description : bill.categoryName.name
        let billDate = (bill.billDate + "").slice(0, 4) + "-" + (bill.billDate + "").slice(4, 6) + "-" + (bill.billDate + "").slice(6, 8);
        return <Card className="card-accent-primary">
            <CardHeader> Bill Payment</CardHeader>
            <CardBody>
                <Container>
                    {this.state.alertMessage && <Alert color={this.state.alertColor} >{this.state.alertMessage}</Alert>}
                    <Row>
                        <Col sm={3} md={3} xl={3} lg={3}>Bill Amount:</Col>
                        <Col> {currency.symbol} &nbsp;{bill.amount > 0 ? bill.amount : -(bill.amount)} </Col>
                    </Row> <br />
                    <Row>
                        <Col sm={3} md={3} xl={3} lg={3}>Bill Date:</Col>
                        <Col>{billDate}</Col>
                    </Row> <br />
                    <Row>
                        <Col sm={3} md={3} xl={3} lg={3}>Bill Notes / Description: </Col>
                        <Col>{name}</Col>
                    </Row> <br />
                    {this.loadBillPaymentForm(currency, bill, updatePayment)}
                </Container>
            </CardBody>
        </Card>
    }

    loadBillPaymentForm = (selectedCurrency, bill, updatePayment) => {
        return <AvForm onSubmit={this.handleSubmitValue}>
            <Row>
                <Col xs="12" sm="5">
                    <AvField type="number" name="amount" label={`Payment Amount (${selectedCurrency.symbol})`} placeholder="Amount" value={updatePayment.amount > 0 ? updatePayment.amount : -(updatePayment.amount)} errorMessage="Invaild payment amount" required />
                </Col>
                <Col xs="6" sm="4">
                    <AvField type="date" name="date" label="Payment Date" value={this.loadDateFormat(updatePayment.date)} errorMessage="Select payment date" required />
                </Col>
                <Col xs="6" sm="3" >
                    <AvField type="select" name="type" label="Payment Type" errorMessage="Select type of payment" value={updatePayment.type} required>
                        <option value="">Select type of payment</option>
                        <option value="Paid">Paid</option>
                        <option value="Received">Received</option>
                    </AvField>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AvField type="textarea" name="notes" label="Payment Notes / Description" value={updatePayment.notes} placeholder="Payment description" />
                </Col>
            </Row>
            <FormGroup >
                <Button color="success" disabled={this.state.doubleClick}> Save  </Button> &nbsp;&nbsp;
                    <Button type="button" onClick={this.cancelPayment}>Cancel</Button>
            </FormGroup>
        </AvForm>
    }

    loadDateFormat = (dateParam) => {
        let toStr = "" + dateParam
        let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
        let date = new Date(dateString);
        return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);  //finalDate;
    }
}

export default UpdateBillPayment;