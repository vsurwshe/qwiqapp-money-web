import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from 'reactstrap';
import logo from './images/payment-success.png';
import '../../../css/style.css';

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
                        If any amount is deducted from your bank account but credits were not added to your user account,
                         please get in touch with the below information: <br/>
                        Failed transaction at: <b> { // TODO: display current date time with timezone here
                        }</b><br/>
                        user email: <b> { //TODO: display current user email address here.
                        } </b><br/>
                    </b>
                </center>
            </CardBody> </Card>
        </div> )
    }
}
export default PaymentSuccessMessage;
