import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import Script from 'react-load-script';
import Config from '../../data/Config';
import Store from "../../data/Store";
import BillingAddressApi from '../../services/BillingAddressApi';
import PaymentSuccessMessage from './PaymentSuccessMessage';


let paymentReferenceId = '';
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
      getBillingItems: [],
      selectedOption: 10,
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

  successCall = (getBillingItems) => {
    this.setState({ getBillingItems })
  };

  errorCall = (error) => {
    this.callAlertTimer("danger", "Unable to Process, Please try again...");
  }

  callAlertTimer = () => {
    
    setTimeout(() => {
      this.setState({paymentSuccess: true, doubleClick: false });
    }, 1500)
  };

  render() {
    const { paymentSuccess } = this.state
   if (paymentSuccess) {
      return <PaymentSuccessMessage paymentReferenceId={paymentReferenceId} />
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
      paymentReferenceId = data.orderID;
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
      }).catch(error=>{
        return error.message;
      });
    });
    // TODO: Put Loader after Success pay 
    setTimeout(() => {
      return this.paymentSuccessMessage()
    }, 2000)
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
    let userData = Store.getUser().action; //VERIFY_EMAIL
    // TODO: remove 'clientIdFromSettings' dynamically retrive this value from <cloudBaseURL>/settings API
    let params = ''; //THIS VALUE COMES FROM /settings API CALL    
     params = Store.getSetting('SETTINGS').paypalParams;
    let url = 'https://www.paypal.com/sdk/js?' + params;
    return (
        <div className="animated fadeIn">
          {userData === "ADD_CREDITS" || userData === "ADD_CREDITS_LOW" || userData === null ? this.loadPayPalButton(url) : this.loadVerifyMessage()}
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

  loadPayPalButton = (url) => {
    return (<Card>
      <CardHeader> <legend><b>BUY CREDITS</b></legend></CardHeader>
      <Script
        url={url}
        onCreate={this.handleScriptCreate.bind(this)}
        onError={this.handleScriptError.bind(this)}
        onLoad={this.handleScriptLoad.bind(this)} />
      <h4 style={{ paddingTop: 20 }}><center>Select any Payment Option</center></h4><br /><br />
      <div className="form-group">
        <FormGroup check>
          {this.state.getBillingItems === undefined ? " " : this.state.getBillingItems.map((item, index) => {
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
            £{item.amount} {item.label} {item.summary}<br />
          </Label><br />
        </Col>
      </React.Fragment>)
  }
}
export default MakePayment;
