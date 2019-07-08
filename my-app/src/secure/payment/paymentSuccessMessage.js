
import React from 'react';
import {Link} from 'react-router-dom';
import {Card,CardBody,Button} from 'reactstrap';
import logo from './asserts/images/payment-success.png';

const  PaymentSuccessMessage = (props) => {
    return (
        <div>
            <Card>
            <CardBody>
            <center>
                <br/><br/>
            <img src={logo} alt="logo" width="110" height="100"/><br/><br/><br/>
            <h2>Payment Thank You</h2>
            <span><h3>Your Reference No.is: ><b>{props.REF_ID}</b></h3>
            </span>
             <h3><Link to="/billing/paymentHistory" style={{color:"white"}}><Button color="primary">View Payment History</Button></Link></h3>
            </center>
          </CardBody>
        </Card>
    </div>
    )
    }
    export default PaymentSuccessMessage;
