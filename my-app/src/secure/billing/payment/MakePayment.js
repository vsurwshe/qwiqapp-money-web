import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Script from 'react-load-script';
import Config from '../../../data/Config';
import Store from "../../../data/Store";
import BillingAddressApi from '../../../services/BillingAddressApi';
import PaymentSuccessMessage from './PaymentSuccessMessage';
import UserApi from '../../../services/UserApi';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import { PAYPAL_SETTINGS } from '../../../data/GlobalKeys';
import '../../../css/style.css';

const PAYPAL_URL = 'https://www.paypal.com/sdk/js?'

let paymentOrderID = '';
let billingAddressFields = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  company: '',
  country: '',
  firstName: '',
  lastName: '',
  postCode: '',
  region: ''
}

class MakePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scriptLoaded: false,
      scriptError: false,
      billingItems: [],
      selectedItem: {},
      loader: true
    };

    this.createPaypalOrder = this.createPaypalOrder.bind(this)
    this.paypalOnApprove = this.paypalOnApprove.bind(this)
  }

  componentDidMount = async () => {
    await new BillingAddressApi().getBillingItems(this.successCall, this.errorCall);
  }

  successCall = (billingItems) => {
    this.setState({ billingItems, loader: false})
  };

  errorCall = (error) => {
    const response = error && error.response ?  error.response : ""
    let errorData = null;
    if (response) {
      if (response.status === 500) { // Handling error call for no billing address 
        errorData = {
          status: response.status,
          message: "You are not added your billing address."
        }
      } else if (response.status === 400) { // Handling error call for email not verified
        errorData = {
          status: response.status,
          message: "You are not verified your email address, please verify it."
        }
      } else { // Handling any other api error calls
        errorData = {
          message: "Unable to process your request, try again later."
        }
      }
    } else {
      errorData = { 
        message: "Please check with your network and re-try again."
      }
    }
    this.setState({ loader: false, error_message: errorData}); 
  }

  handleScriptCreate() {
    this.setState({ scriptLoaded: false })
  }

  handleScriptError() {
    this.setState({ scriptError: true })
  }

  render() {
    const { paymentSuccess, paymentResponse, loader, billingItems } = this.state
    if (billingItems.length === 0) {
      if (loader) {
        return ShowServiceComponent.loadSpinner("MakePayment")
      } else {
        return this.loadBillingItemError();
      }
    } else if (paymentSuccess) {
      return <PaymentSuccessMessage paymentReferenceId={paymentOrderID} response = {paymentResponse}/>
    } else {
      return <div>{this.loadMakePayment()}</div>
    }
  }

  loadBillingItemError = () =>{ // This method loads when user "not verified/not added billing address"
    const {status, message} = this.state.error_message; // status is only for 400/500 errors(Email not verified, not added billing address)
    let link, buttonText;
    if (status) { // According to status, the Button text, link will be set
      if (status === 400) {
          link = "/verify"
          buttonText = "Verify Email"
      } else {
          link = "/billing/address"
          buttonText = "Add Billing Address"
      }
    }
    return(
      <Card>
        <CardHeader><strong>Make Payment</strong></CardHeader>
        <center >
          <CardBody>
            <h4><b className="text-color">{message} <br /><br />
              {status && <Link to={{pathname: link, state: {updateBill: billingAddressFields }}} className="text-link" > <Button color="info"> {buttonText} </Button> </Link>}
            </b></h4>
          </CardBody>
        </center>
      </Card>
    )
  }

  
  createPaypalOrder(data, actions) {
    // Set up the transaction
    if(this.state.selectedItem.amount){
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: this.state.selectedItem.amount
          }
        }]
      });
    } else{
      this.setState({ showAlert:true })
    }
  }

  itemId = (amount, code) => {
    this.setState({ selectedItem: {amount,code}, showAlert: false})
  }

  paymentSuccessMessage = (paymentResponse) => {
    new UserApi().getUser(user=>Store.saveUser(user), error=>console.log(error));
    this.setState({ paymentSuccess: true, paymentResponse });
  }

  savePaymentDetailsToApi = (data, actions, paymentURL, code) =>{
    return actions.order.capture().then(function (details) {
      paymentOrderID = data.orderID;
      return fetch(paymentURL, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + Store.getAppUserAccessToken()
        },
        body: JSON.stringify({
          orderId: data.orderID,
          code: code
        })
      }).then(response => {
        return response.status;
      }).catch(error => {
        return error.status;
      });
    });
  }

  paypalOnApprove = async (data, actions) =>{
    let paymentURL = Config.settings().cloudBaseURL + "/billing/paypal-completed";
    let code = this.state.selectedItem.code;
    let response = await this.savePaymentDetailsToApi(data, actions, paymentURL, code);
    if(response){
      this.paymentSuccessMessage(response)
    }
  }

  handleScriptLoad(obj) {
    window.paypal.Buttons({
      createOrder: this.createPaypalOrder,
      onApprove: this.paypalOnApprove,
    }).render('#paypal-button-container');
    this.setState({ scriptLoaded: true })
  }

  loadMakePayment = (data) => {
    let url =  PAYPAL_URL + Store.getSetting(PAYPAL_SETTINGS).paypalParams;
    return <div className="animated fadeIn"> {this.loadPayPalButton(url)}</div>
  }

  loadPayPalButton = (paypalURL) => {
    return <Card>
      <CardHeader><strong>BUY CREDITS</strong></CardHeader>
      <Script
        url={paypalURL}
        onCreate={this.handleScriptCreate.bind(this)}
        onError={this.handleScriptError.bind(this)}
        onLoad={this.handleScriptLoad.bind(this)} />
      <h4 className= "padding-top" ><center>Select an amount to pay</center></h4><br />
      <div className="form-group"> 
        <center>
          {this.state.showAlert && ShowServiceComponent.loadAlert("warning", "Please select your payment option to continue")}
         </center>
        <FormGroup check>
          {this.state.billingItems && this.state.billingItems.map((item, index) => {
            return this.loadRadioButtons(item, index)
          })}
        </FormGroup><br /><br />
        <small id="amountHelp" className="form-text text-center text-muted">This amount will be deducted from your payment method.</small>
      </div>
      <center>
        <div className="form-group">
          <div id="paypal-button-container"></div>
        </div>
      </center>
    </Card>
  }

  loadRadioButtons = (item, index) => {
    return (
      <React.Fragment key={index}>
        <Col sm="12" md={{ size: 10, offset: 1 }}>
          <Label check>
            <Input type="radio" name="radio1" value={item.amount} checked={this.state.selectedItem.code === item.code}
              onChange={() => this.itemId(item.amount, item.code)} />{' '}
             <b>{item.label}</b> - {item.summary}<br />
          </Label><br />
        </Col>
      </React.Fragment>)
  }
}
export default MakePayment;
