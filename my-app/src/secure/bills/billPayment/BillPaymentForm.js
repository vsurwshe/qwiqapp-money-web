import React from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button, Col, Row } from 'reactstrap';

export const BillPaymentForm = (props) =>{
    let date = props.data.updateDate ? props.data.updateDate : new Date()
    return <AvForm onSubmit={props.handleSubmitValue}>
        <Row>
            <Col xs="12" sm="5">
                <AvField type="number" name="amount" label={props.data.amountLable} placeholder="Amount" value={props.data.paidAmount} errorMessage="Invaild payment amount" required />
            </Col>
            <Col xs="6" sm="4">
                <AvField type="date" name="date" label="Payment Date" value={props.handlePaidDate(date)} errorMessage="Select payment date" required />
            </Col>
            <Col xs="6" sm="3" >
                <AvField type="select" name="type" label="Payment Type" errorMessage="Select type of payment" value={props.data.paymentType} required>
                    <option value="">Select type of payment</option>
                    <option value="Paid">Paid</option>
                    <option value="Received">Received</option>
                </AvField>
            </Col>
        </Row>
        <Row>
            <Col>
                <AvField type="textarea" name="notes" label="Payment Notes/ Description" value={props.data.updateNote} placeholder="Payment description" />
            </Col>
        </Row>
        <FormGroup >
            <Button color="success" disabled={props.data.doubleClick}> Save  </Button> &nbsp;&nbsp;
                <Button type="button" onClick={props.cancelPayment}>Cancel</Button>
        </FormGroup>
    </AvForm>
}