import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Button, Alert, Row, Col } from 'reactstrap';
import Config from '../../../data/Config';
import BillingAddressApi from '../../../services/BillingAddressApi';
import EditBillingAddress from './EditBillingAddress';
import { getBillingAddress, updateStatusValue } from "../../../redux/actions/BillingAddressAction";
import { handleApiResponseMsg, buttonAction, setSpinnerValue } from "../../../redux/actions/UtilityActions";
import '../../../css/style.css';

// This is Empty Billing Address Set When There is no Billing Address we seting this Set into Billing Address for API (POST/PUT)
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

class BillingInfo extends Component {

  componentDidMount = async () => {
    await new BillingAddressApi().getBillings(this.successcall, this.errorcall)
  }

  componentWillReceiveProps = async () => {
    const { updateStatus } = this.props.biliing
    // This condtions after update billAddress get billingAddress list.
    if (updateStatus) {
      this.props.dispatch(updateStatusValue(false))
      await new BillingAddressApi().getBillings(this.successcall, this.errorcall)
    }
  }

  successcall = async (billing) => {
    const {dispatch} =this.props
    if (billing) {
      dispatch(getBillingAddress(billing))
    } else {
      dispatch(getBillingAddress(emptyBillingAddress))
    }
    dispatch(setSpinnerValue(true))
  }

  errorcall = (error) => {
    let response = error && error.response ? error.response : '';
    if (response) {
      this.props.dispatch(handleApiResponseMsg('Unable to process, please try again....', 'danger', true))
    } else {
      this.props.dispatch(handleApiResponseMsg('Please check with your network', 'danger', true))
    }
  }

  // handele edit billing address button actions  
  editBillingAddress = () => {
    this.props.dispatch(buttonAction(true, true))
  }
  // method execute cancle actions in edit billing address
  cancelEditBillingAddress = () => {
    this.props.dispatch(buttonAction(false, true))
  }

  render() {
    const { addBilling, spinner } = this.props.utility;
    const { billingAddress } = this.props.biliing;
    if (addBilling) {
      return <EditBillingAddress handleCancelEditBillingAddress={this.cancelEditBillingAddress} />
    } else if (!billingAddress.country) {
      if (!spinner) {
        return this.loadSpinner();
      } else {
        return this.showingNoBillingMessage()
      }
    } else {
      return this.billingAddress();
    }
  }

  // While API is giving response, meanwhile this method loads the spinner 
  loadSpinner = () => {
    const { alertMessage, alertColor } = this.props.utility;
    return <div className="animated fadeIn">
    <Card>
      {this.loadHeader("Edit Billing Address")}
      <center className="padding-top">
        <CardBody>
          {!alertColor ? <div className="spinner-border text-info" style={{ height: 60, width: 60 }}></div> : <Alert color={alertColor}>{alertMessage} </Alert> }
        </CardBody>
      </center>
    </Card>
  </div>
  }

  // This method shows Billing Address details
  billingAddress = () => {
    const { showAlert, alertMessage, alertColor } = this.props.utility;
    const { billingAddress } = this.props.biliing;
    showAlert && setTimeout(() => {
      this.props.dispatch(handleApiResponseMsg('', '', false))
    }, Config.notificationMillis);
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader("Edit Billing Address")}
          <CardBody>
            {alertColor && <Alert color={alertColor}>{alertMessage} </Alert>}
            {billingAddress &&
              <CardBody>
                <center className="text-sm-left">
                  <b>{(billingAddress.firstName && billingAddress.lastName) ? billingAddress.firstName + " " + billingAddress.lastName : billingAddress.company}</b><br />
                  <p>
                    {billingAddress.addressLine1 + ', '}
                    {billingAddress.addressLine2 && billingAddress.addressLine2 + ','} <br />
                    {billingAddress.city && <>{billingAddress.city + ', '}<br /></>}
                    {billingAddress.region ? <>{billingAddress.region + ', '}{billingAddress.postCode && " - " + billingAddress.postCode + ","}<br /></> : billingAddress.postCode && <>{billingAddress.postCode + ","}<br /></>}
                    {billingAddress.country}
                  </p>
                </center>
              </CardBody>
            }
          </CardBody>
        </Card>
      </div>
    )
  }

  // This method loads the header
  loadHeader = (buttonMessage) => <CardHeader style={{ height: 60 }}>
    <Row form>
      <Col className="marigin-top"><strong>Billing Address</strong></Col>
      <Col><Button color="success" className="float-right" onClick={this.editBillingAddress}> {buttonMessage}</Button></Col>
    </Row>
  </CardHeader>

  // This method is called when there is no billing address
  showingNoBillingMessage = () => <div className="animated fadeIn">
    <Card>
      {this.loadHeader("+ Billing Address")}
      <center className="padding-top" >
        <CardBody> <b>No Billing Address added, Please Add Now...</b></CardBody>
      </center>
    </Card>
  </div>
}

// This maps Central Redux Store state to the props of this component  
const mapsStateToProps = (state) => { return state; }

// connect used to attach the above props to this component
export default connect(mapsStateToProps)(BillingInfo);