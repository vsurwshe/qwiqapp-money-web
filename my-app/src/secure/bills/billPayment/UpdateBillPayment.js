import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button, Col, Card, CardBody, CardHeader, Container, Input, Label, Row, Alert } from 'reactstrap';
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
        if (errors.length === 0) {
            this.setState({ doubleClick: true });
            let date = values.date.split("-")[0] + values.date.split("-")[1] + values.date.split("-")[2];
            let amount = this.state.billType ? values.amount : -(values.amount)
            let data = { ...values, "date": date, "amount": amount }
            await new PaymentApi().updateBillPayment(this.handleSuccessCall, this.handleErrorCall, this.props.profileId, this.props.bill.id, this.props.updatePayment.txId, data);
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

    handleErrorCall = (error) => {
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
        const { bill, currency, updatePayment } = this.props
        return this.state.cancelPayment ?
            <ViewPayment bill={bill} profileId={this.props.profileId} />
            // <Bills />
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
                    <div className="control Container">
                        <Row>
                            <Col sm={3}>
                                <Label>Bill Type</Label>
                            </Col>
                            <Col sm={5}><Label className="radio">
                                <p style={{ color: "#cc0000" }}><Input type="radio" checked={!this.state.billType} onChange={this.handleBillType} /> Paid</p>
                            </Label> &nbsp; &nbsp; &nbsp; &nbsp;
                          <Label className="radio">
                                    <p style={{ color: "#006600" }}><Input type="radio" checked={this.state.billType} onChange={this.handleBillType} /> Receivable</p>
                                </Label></Col></Row>
                    </div>
                    <AvForm onSubmit={this.handleSubmitValue}>
                        <Row>
                            <Col sm={3} md={3} xl={3} lg={3}>Bill amount:</Col>
                            <Col> {currency} &nbsp;{bill.amount > 0 ? bill.amount : -(bill.amount)} </Col>
                        </Row> <br />
                        <Row>
                            <Col sm={3} md={3} xl={3} lg={3}>Bill date:</Col>
                            <Col>{billDate}</Col>
                        </Row> <br />
                        <Row>
                            <Col sm={3} md={3} xl={3} lg={3}>note/ description: </Col>
                            <Col>{name}</Col>
                        </Row> <br /><br />
                        <Row>
                            <Col xs="12" sm="5">
                                <Label >Bill Pay Amount</Label> &nbsp;({currency})
                            <AvField type="number" name="amount" placeholder="Amount" value={updatePayment.amount > 0 ? updatePayment.amount : -(updatePayment.amount)} required />
                            </Col>
                            <Col xs="6" sm="4">
                                <Label >Pay Date</Label>
                                <AvField type="date" name="date" value={this.loadDateFormat(updatePayment.date)} required />
                            </Col>
                            <Col xs="6" sm="3">
                                <Label >Bill Notes</Label>
                                <AvField type="text" name="notes" value={updatePayment.notes} placeholder=" Bill payment descriptions" />
                            </Col>
                        </Row>
                        <FormGroup >
                            <center>
                                <Button color="success" disabled={this.state.doubleClick}> Save  </Button> &nbsp;&nbsp;
                            <Button type="button" onClick={this.cancelPayment}>Cancel</Button></center>
                        </FormGroup>
                    </AvForm>
                </Container>
            </CardBody>
        </Card>
    }

    loadDateFormat = (dateParam) => {
        let toStr = "" + dateParam
        let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
        let date = new Date(dateString);
        return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);  //finalDate;
    }
}

export default UpdateBillPayment;