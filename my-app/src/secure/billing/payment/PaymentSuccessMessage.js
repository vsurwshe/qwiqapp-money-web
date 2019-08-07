import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from 'reactstrap';
import logo from './images/payment-success.png';
import '../../../css/CssStyles.css';

const PaymentSuccessMessage = (props) => {
    if (props.paymentReferenceId && (props.response === 202 ||  props.response === 200) ) {
        return (<div>
            <Card> <CardBody>
                <center><br /><br />
                    <img src={logo} alt="logo" width="110" height="100" /><br /><br /><br />
                    <h3>Thank You for your Payment !</h3>
                    <span><h4>Your reference number is: <b>{props.paymentReferenceId}</b></h4> <br />
                    </span>
                    <h3 ><Link className="routerLink" to="/billing/paymentHistory"><Button color="primary">View Payment History</Button></Link></h3>
                </center>
            </CardBody> </Card>
        </div>)
    } else {
        return (<div>
            <Card> <CardBody>
                <center><br />
                    <b className="message"> Oops ..! Something went wrong, Your payment is failed. <br/> 
                        Any money deducted from your account, will be refunded within 3-5 working days.
                    </b>
                </center>
            </CardBody> </Card>
        </div> )
    }
}
export default PaymentSuccessMessage;
