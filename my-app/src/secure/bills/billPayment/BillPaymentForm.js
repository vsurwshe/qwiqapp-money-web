import React from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button, Col, Row, Label } from 'reactstrap';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';

export const BillPaymentForm = (props) =>{
    const {updateDate, buttonText}= props.data
    let date = updateDate ? props.handlePaidDate(updateDate)  : ShowServiceComponent.loadDateFormat(new Date())

    return <AvForm onSubmit={props.handleSubmitValue}>
        <Row>
        <Col xs="3" style={{paddingRight:10, paddingBottom:0, marginRight:15}}> 
                <Row>
                    <Col sm={5}><Label>{props.data.amountLable}</Label></Col>
                    <Col sm={7}> <AvField type="number" name="amount" placeholder="Amount" value={props.data.paidAmount} errorMessage="Invaild payment amount" required /></Col>
                </Row>
                </Col>
        <Col xs="auto"  style={{paddingRight:10}}>
            <Row>
                <Col sm={5}><Label>Payment Date</Label></Col>
                <Col sm={7} > <AvField type="date" name="date" value={date} errorMessage="Select payment date" required /></Col>
            </Row>
        </Col>

        <Col xs="3"  style={{paddingRight:10}}>
            <Row>
                <Col sm={5} ><Label>Payment Type</Label></Col>
                    <Col sm={7}>
                        <AvField type="select" name="type" errorMessage="Select type of payment" value={props.data.paymentType} required>
                            <option value="Paid">Paid</option>
                            <option value="Received">Received</option>
                        </AvField>
                </Col>
           </Row>
                    </Col>
                    <Col xs="3"></Col>
        </Row>
        <Row>
            <Col>
                <Row>
                    <Col xl={1}><Label>Payment Type</Label></Col>
                    <Col><AvField type="textarea" name="notes" value={props.data.updateNote} placeholder="Payment description" /></Col>
                </Row>
            </Col>
        </Row>
        <center>
            <FormGroup >
                <Button color="success" disabled={props.data.doubleClick}> {buttonText}  </Button> &nbsp;&nbsp;
                <Button type="button" onClick={props.cancelPayment}>Go to Payment History</Button>
            </FormGroup>
       </center>
    </AvForm>
}