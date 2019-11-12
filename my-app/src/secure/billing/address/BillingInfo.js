import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Button, Alert } from 'reactstrap';
import Loader from 'react-loader-spinner';
import Config from '../../../data/Config';
import BillingAddressApi from '../../../services/BillingAddressApi';
import EditBillingAddress from './EditBillingAddress';
import {  updateStatus, getBillingAddress } from "../../../redux/actions/BillingAddressActions";
import { handleApiResponseMsg, buttonAction, setSpinnerValue } from "../../../redux/actions/UtilityActions";
// import { handleApiResponseMsg, buttonAction, setSpinnerValue, getBillingAddress, updateStatus } from '../../../redux/actions/BillingAddressActions';
import '../../../css/style.css';

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
    // This condtions after update billAddress get billingAddress list.
    if (this.props.updateStatus) {
      this.props.dispatch(updateStatus(false))
      await new BillingAddressApi().getBillings(this.successcall, this.errorcall)
    }
  }

  successcall = async (billing) => {
    if (billing) {
      this.props.dispatch(getBillingAddress(billing))
    } else {
      this.props.dispatch(getBillingAddress(emptyBillingAddress))
    }
    this.props.dispatch(setSpinnerValue(true))
  }

  errorcall = (error) => {
    this.props.dispatch(handleApiResponseMsg('Unable to process, Please try Again....', 'danger', true))
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
    const { billingAddress, addBilling, spinner } = this.props;
    if (addBilling) {
      return <EditBillingAddress handleCancelEditBillingAddress={this.cancelEditBillingAddress} />
    } else if (!billingAddress.country) {
      if (!spinner) {
        return this.loadSpinner();
      } else {
        return this.showingNoBillingMessage()
      }
    } else {
      return this.billingAddress(billingAddress);
    }
  }

  loadSpinner = () =>  <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center className="padding-top">
          <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
        </center>
      </Card>
    </div>

  billingAddress = (billingAddress) => {
    const { showAlert, color, message } = this.props;
    showAlert && setTimeout(() => {
      this.props.dispatch(handleApiResponseMsg('', '', false))
    }, Config.notificationMillis);
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Billing Address</strong>
            <Button color="success" className="float-right" onClick={this.editBillingAddress}> Edit Billing Address</Button>
          </CardHeader>
          <CardBody>
            <Alert isOpen={showAlert} color={color}>{message} </Alert>
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

  loadHeader = () => <CardHeader>
        <strong>Billing Address</strong>
        <Button color="success" className="float-right" onClick={this.editBillingAddress}> + Billing Address</Button>
      </CardHeader>

  showingNoBillingMessage = () => <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center className="padding-top" >
            <CardBody> <b>No Billing Address added, Please Add Now...</b></CardBody>
          </center>
        </Card>
      </div>
}


const mapsStateToProps = (state) => {
  return state;
}

export default connect(mapsStateToProps)(BillingInfo);