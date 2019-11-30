import React from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button, Col, Row, Label } from 'reactstrap';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';

export const BillPaymentForm = (props) =>{
    const {updateDate, buttonText}= props.data
    let date = updateDate ? props.handlePaidDate(updateDate)  : ShowServiceComponent.loadDateFormat(new Date())

    return <AvForm onSubmit={props.handleSubmitValue}>
        <Row>
            <Col xs="12" sm="5">
                <Row>
                    <Col xl={3}><Label>{props.data.amountLable}</Label></Col>
                    <Col> <AvField type="number" name="amount" placeholder="Amount" value={props.data.paidAmount} errorMessage="Invaild payment amount" required /></Col>
                </Row>
            </Col>
            <Col xs="6" sm="4">
                <Row>
                    <Col xl={3}><Label>Payment Date</Label></Col>
                    <Col> <AvField type="date" name="date" value={date} errorMessage="Select payment date" required /></Col>
                </Row>
            </Col>
            <Col xs="6" sm="3" >
            <Row>
                    <Col xl={3}><Label>Payment Type</Label></Col>
                    <Col>
                        <AvField type="select" name="type" errorMessage="Select type of payment" value={props.data.paymentType} required>
                            <option value="">Select type of payment</option>
                            <option value="Paid">Paid</option>
                            <option value="Received">Received</option>
                        </AvField>
                    </Col>
                </Row>
                
            </Col>
        </Row>
        <Row>
            <Col>
                <Row>
                    <Col xl={1}><Label>Payment Type</Label></Col>
                    <Col><AvField type="textarea" name="notes" value={props.data.updateNote} placeholder="Payment description" /></Col>
                </Row>
            </Col>
        </Row>
        <FormGroup >
            <Button color="success" disabled={props.data.doubleClick}> {buttonText}  </Button> &nbsp;&nbsp;
            <Button type="button" onClick={props.cancelPayment}>Go to Payment History</Button>
        </FormGroup>
    </AvForm>
}