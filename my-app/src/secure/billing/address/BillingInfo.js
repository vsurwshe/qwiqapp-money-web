import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Button, Alert } from 'reactstrap';
import BillingAddressApi from '../../../services/BillingAddressApi';
import EditBillingAddress from './EditBillingAddress';
import Loader from 'react-loader-spinner';
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
  state = {
    billing: [],
    visible: false,
    spinner: false,
    addBilling: false,
    updateBill: false,
  }

  componentDidMount = async () => {
    await new BillingAddressApi().getBillings(this.successcall, this.errorcall)
  }

  successcall = async (billing) => {
    if (!billing) {
      await this.setState({ billing: emptyBillingAddress, spinner: true })
    } else {
      await this.setState({ billing })
    }
  }

  errorcall = () => {
    this.setState({ visible: true });
  }

  editBillingAddress = () => {
    this.setState({ addBilling: true, spinner: true });
  }

  cancelEditBillingAddress = () => {
    this.setState({ addBilling: false })
  }

  render() {
    const { billing, visible, addBilling, spinner } = this.state;
    if (addBilling) {
      return <EditBillingAddress updateBill={billing} handleCancelEditBillingAddress={this.cancelEditBillingAddress} />
    } else if (!billing.country) {
      if(!spinner){
        return this.loadSpinner();
      } else{
        return this.showingNoBillingMessage(billing)
      }
    } else {
      return this.billingAddress(billing, visible);
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

  billingAddress = (billing, visible) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Billing Address</strong>
            <Button color="success" className="float-right" onClick={this.editBillingAddress}> Edit Billing Address</Button>
          </CardHeader>
          <CardBody>
            <Alert isOpen={visible} color="danger">Unable to process, Please try Again.... </Alert>
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

  loadHeader = (billing) => {
    return (
      <CardHeader>
        <strong>Billing Address</strong>
        <Button color="success" className="float-right" onClick={this.editBillingAddress}> + Billing Address</Button>
      </CardHeader>);
  }

  showingNoBillingMessage = (billing) => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader(billing)}
          <center className="padding-top" >
            <CardBody> <b>No Billing Address added, Please Add Now...</b></CardBody>
          </center>
        </Card>
      </div>)
  }
}

export default BillingInfo;