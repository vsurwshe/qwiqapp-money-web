import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Button, Alert } from 'reactstrap';
import BillingAddressApi from '../../../services/BillingAddressApi';
import EditBillingAddress from './EditBillingAddress';
import Loader from 'react-loader-spinner';
import '../../../css/style.css';
import { connect } from 'react-redux';
import { handleApiResponseMsg, buttonAction, setSpinnerValue, getBillingAddress, updateStatus } from '../../../redux/actions/billingAddressActions';
import Config from '../../../data/Config';

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

  componentWillReceiveProps=async ()=>{
     // This condtions after update billAddress get billingAddress list.
    if(this.props.updateStatus){
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
    this.props.dispatch(handleApiResponseMsg('Unable to process, Please try Again....','danger',true))
  }

  // handele edit billing address button actions  
  editBillingAddress = () => {
    this.props.dispatch(buttonAction(true,true))
  }
  // method execute cancle actions in edit billing address
  cancelEditBillingAddress = () => {
    this.props.dispatch(buttonAction(false,true))
  }

  render() {
    const { getBillingAddress,addBilling, spinner } = this.props;
    if (addBilling) {
      return <EditBillingAddress handleCancelEditBillingAddress={this.cancelEditBillingAddress} />
    } else if ( !getBillingAddress.country) {
      if(!spinner){
        return this.loadSpinner();
      } else{
        return this.showingNoBillingMessage()
      }
    } else {
      return this.billingAddress(getBillingAddress);
    }
  }

  loadSpinner = () =>{
    return <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center className="padding-top">
            <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
          </center>
        </Card>
      </div>
  }

  billingAddress = (billing) => {
    const {showAlert,color,message}=this.props;
    showAlert && setTimeout(() => {
      this.props.dispatch(handleApiResponseMsg('','',false))
    }, Config.notificationMillis);
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Billing Address</strong>
            <Button color="success" className="float-right" onClick={this.editBillingAddress}> Edit Billing Address</Button>
          </CardHeader>
          <CardBody>
            <Alert isOpen={showAlert} color={color}>{message} </Alert>
            {billing &&
              <CardBody>
                <center className="text-sm-left">
                  <b>{(billing.firstName && billing.lastName) ? billing.firstName + " " + billing.lastName : billing.company}</b><br />
                  <p>
                    {billing.addressLine1 + ', '}
                    {billing.addressLine2 && billing.addressLine2 + ','} <br />
                    {billing.city && <>{billing.city + ', '}<br /></>}
                    {billing.region ? <>{billing.region + ', '}{billing.postCode && " - " + billing.postCode+","}<br /></> : billing.postCode && <>{billing.postCode+","}<br /></>}
                    {billing.country} 
                  </p>
                </center>
              </CardBody>
            }
          </CardBody>
        </Card>
      </div>
    )
  }

  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Billing Address</strong>
        <Button color="success" className="float-right" onClick={this.editBillingAddress}> + Billing Address</Button>
      </CardHeader>);
  }

  showingNoBillingMessage = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center className="padding-top" >
            <CardBody> <b>No Billing Address added, Please Add Now...</b></CardBody>
          </center>
        </Card>
      </div>)
  }
}


const mapsStateToProps=(state)=>{
  return state;
}

export default connect(mapsStateToProps)(BillingInfo);