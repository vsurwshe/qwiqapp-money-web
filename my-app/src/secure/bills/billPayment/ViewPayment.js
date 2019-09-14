import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom'
import PaymentApi from '../../../services/PaymentApi';

class ViewPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments : []
    };
  }

  componentDidMount=()=>{
   this.getPayments();
  }

  getPayments=()=>{
    new PaymentApi().getBillPayment(this.paymentSuccessCall,this.errorCall,this.props.profileId,this.props.bill.id)
  }

  paymentSuccessCall=(payments)=>{
    this.setState({ payments });
  }
  errorCall=(error)=>{
    console.error("Error : ",error);
  }

  render() {
    if(this.state.payments.length === 0){
      return this.noPaymentsAdded()
    } else{
      return <div>View Payment</div>
    }
  }

  noPaymentsAdded = () =>{
    return <div>
          <Card>
            {this.loadHeader()}
            <CardBody>
              <center>
                <h5>No payments added yet..!</h5>
              </center>
            </CardBody>
          </Card>
        </div>
  }

  loadHeader = () =>{
    return <>
        <CardHeader>
            <strong>View Payments</strong>
            <Link to={{ pathname : "/billing/addPayment", state : { bill : this.state.bill} }}>
              <Button color="success" className="float-right"> + Add a Payment </Button>
            </Link>
        </CardHeader>
    </>
  }
}

export default ViewPayment;