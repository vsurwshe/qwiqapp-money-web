import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import Script from 'react-load-script';
import Config from '../../../data/Config';
import Store from "../../../data/Store";
import BillingAddressApi from '../../../services/BillingAddressApi';
import PaymentSuccessMessage from './PaymentSuccessMessage';

const PAYPAL_URL = 'https://www.paypal.com/sdk/js?'

let paymentOrderID = '';

class MakePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doubleClick: false,
      cancelPayment: false,
      paymentSuccess: false,
      scriptLoaded: false,
      scriptError: false,
      inputValue: 10,
      billingItems: [],
      selectedOption: 10
    };

    this.createPaypalOrder = this.createPaypalOrder.bind(this)
    this.paypalOnApprove = this.paypalOnApprove.bind(this)
  }

  componentDidMount = async () => {
    await new BillingAddressApi().getBillingItems(this.successCall, this.failureCall);
  }

  onSiteChanged = (e) => {
    this.setState({ selectedOption: e.currentTarget.value });
  }

  cancelPayment = () => {
    this.setState({ cancelPayment: true })
  }

  successCall = (billingItems) => {
    this.setState({ billingItems })
  };

  errorCall = (error) => {
    this.callAlertTimer("danger", "Unable to Process, Please try again...");
  }

  callAlertTimer = () => {

    setTimeout(() => {
      this.setState({ paymentSuccess: true, doubleClick: false });
    }, Config.apiTimeoutMillis)
  };

  render() {
    const { paymentSuccess } = this.state
    if (paymentSuccess) {
      return <PaymentSuccessMessage paymentReferenceId={paymentOrderID} />
    } else {
      return <div>{this.loadMakePayment()}</div>
    }
  }

  updateInputValue(evt) {
    this.setState({ inputValue: evt.target.value });
  }

  handleScriptCreate() {
    this.setState({ scriptLoaded: false })
  }

  handleScriptError() {
    this.setState({ scriptError: true })
  }

  createPaypalOrder(data, actions) {
    // Set up the transaction
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: this.state.inputValue
        }
      }]
    });
  }

  itemId = (amount) => {
    this.setState({ selectedOption: amount, inputValue: amount })
  }

  paymentSuccessMessage = () => {
    this.setState({ paymentSuccess: true });
  }

  paypalOnApprove(data, actions) {
    let paymentURL = Config.cloudBaseURL + "/billing/paypal-completed"
    let value = this.state.inputValue;
    // Capture the funds from the transaction
    actions.order.capture().then(function (details) {
      paymentOrderID = data.orderID;
      // Call your server to save the transaction
      fetch(paymentURL, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + Store.getAppUserAccessToken()
        },
        body: JSON.stringify({
          orderId: data.orderID,
          amount: value
        })
      }).catch(error => {
        return error.message;
      });
    });
    // TODO: Put Loader after Success pay 
    setTimeout(() => {
      return this.paymentSuccessMessage()
    }, Config.apiTimeoutMillis)
  }

  handleScriptLoad(obj) {
    window.paypal.Buttons({
      createOrder: this.createPaypalOrder,
      onApprove: this.paypalOnApprove,
    }).render('#paypal-button-container');
    this.setState({ scriptLoaded: true })
  }

  onChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }
  loadMakePayment = (data) => {
    let action = Store.getUser().action; 
    let url =  PAYPAL_URL + Store.getSetting('SETTINGS').paypalParams;
    return (
      <div className="animated fadeIn">
        {/* { action === "ADD_CREDITS" || action === "ADD_CREDITS_LOW" || action === null ? this.loadPayPalButton(url) : this.loadVerifyMessage() } */}
        {/* { action !== "ADD_BILLING" ? this.loadPayPalButton(url) : this.loadVerifyMessage() } */}
       { action !== "VERIFY_EMAIL"
               ? (action !== "ADD_BILLING" ? this.loadPayPalButton(url) : this.loadAddBillingAddress(action))
               : this.loadVerifyMessage() }
      </div>
    )
  }

  loadVerifyMessage = () => {
    return (
      <Card>
        <CardBody>
          <center><b>You are not verified yet. Please, Verify Your Email</b></center>
        </CardBody>
      </Card>)
  }

  loadAddBillingAddress = (action) => {
    let emptyBillingAddress = {
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
    return (
      <Card>
        <CardBody>
          <center><b>You have not added your Billing Address yet. Please, Add Billing Address.</b><br /><br />
              <Button color="info">
                <Link to={{pathname: "/billing/address/add", state: {updateBill: emptyBillingAddress }}} style={{color:"black"}} > {action} </Link>
              </Button>
          </center>
        </CardBody>
      </Card>)
  }

  loadPayPalButton = (paypalURL) => {
    return (<Card>
      <CardHeader> <legend><b>BUY CREDITS</b></legend></CardHeader>
      <Script
        url={paypalURL}
        onCreate={this.handleScriptCreate.bind(this)}
        onError={this.handleScriptError.bind(this)}
        onLoad={this.handleScriptLoad.bind(this)} />
      <h4 style={{ paddingTop: 20 }}><center>Select any Payment Option</center></h4><br /><br />
      <div className="form-group">
        <FormGroup check>
          {this.state.billingItems === undefined ? " " : this.state.billingItems.map((item, index) => {
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
    </Card>)
  }

  loadRadioButtons = (item, index) => {
    return (
      <React.Fragment key={index}>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Label check>
            <Input type="radio" name="radio1" value={item.amount} checked={this.state.selectedOption === item.amount}
              onChange={() => this.itemId(item.amount)} />{' '}
             <b>{item.label}</b> - {item.summary}<br />
          </Label><br />
        </Col>
      </React.Fragment>)
  }
}
export default MakePayment;
