import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from 'reactstrap';
import logo from './images/payment-success.png';

const PaymentSuccessMessage = (props) => {
    return (
        <div>
            <Card>
                <CardBody>
                    <center>
                        <br /><br />
                        <img src={logo} alt="logo" width="110" height="100" /><br /><br /><br />
                        <h3>Thank You for your Payment !</h3>
                        <span><h4>Your reference number is: <b>{props.paymentReferenceId}</b></h4> <br />
                        </span>
                        <h3><Link to="/billing/paymentHistory" style={{ color: "white" }}><Button color="primary">View Payment History</Button></Link></h3>
                    </center>
                </CardBody>
            </Card>
        </div>
    )
}
export default PaymentSuccessMessage;
