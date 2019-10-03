import React, { Component } from 'react';
import { Col, Card, CardBody, CardHeader, Container, Row, Alert } from 'reactstrap';
import PaymentApi from '../../../services/PaymentApi';
import Config from '../../../data/Config';
import ViewPayment from './ViewPayment';
import { BillPaymentForm } from './FormModel';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';

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

    calculate = () => { this.setState({ calculate: !this.state.calculate }); }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

    handleBillType = () => { this.setState({ billType: !this.state.billType }); }

    render() {
        const { bill, currency, updatePayment } = this.props;
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
        let formData = {
            bill: bill,
            updateDate: updatePayment.date,
            updateNote: updatePayment.notes,
            paidAmount: updatePayment.amount > 0 ? updatePayment.amount : -(updatePayment.amount),
            paymentType: updatePayment.type,
            doubleClick: this.state.doubleClick,
            amountLable: "updating Amount ("+ selectedCurrency.symbol +")"
        }
        return <BillPaymentForm data = {formData}
            handleSubmitValue = {this.handleSubmitValue}
            handlePaidDate = {this.loadDateFormat}
            cancelPayment = {this.cancelPayment}
        />
    }

    loadDateFormat = (dateParam) => {
        return ShowServiceComponent.customDate(dateParam);
    }
}

export default UpdateBillPayment;