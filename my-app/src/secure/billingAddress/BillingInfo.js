import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import BillingAddressApi from '../../services/BillingAddressApi';
import EditBillingAddress from './EditBillingAddress';

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
    if (billing === null || billing === " ") {
      await this.setState({ billing: emptyBillingAddress, spinner: true })
    } else {
      await this.setState({ billing })
    }
  }

  errorcall = () => {
    this.setState({ visible: true })
  }

  EditBillingAddress = () => {
    this.setState({ addBilling: true, spinner: true });
  }

  updateBillingAddress = () => {
    this.setState({ updateBill: true })
  }

  render() {
    const { billing, visible, addBilling } = this.state;
    if (addBilling) {
      return <EditBillingAddress updateBill={billing} />
    } else if (!billing.country) {
      return this.showingNoBillingMessage(billing)
    } else {
      return this.billingAddress(billing, visible);
    }
  }

  billingAddress = (billing, visible) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Billing Address</strong>
            <Link to={{ pathname: "/billing/address/add", state: { updateBill: billing } }}><Button color="success" className="float-right" onClick={this.EditBillingAddress}> Update </Button></Link>
          </CardHeader>
          <CardBody>
            <Alert isOpen={visible} color="danger">Unable to process, Please try Again.... </Alert>
            {billing !== null ?
              <center className="text-sm-left">
                {billing.firstName} {billing.lastName}<br></br>
               <span style={{paddingLeft:10}}><b>Address: </b></span><br/>
              <p style={{paddingLeft:99,paddingTop:10}}  >
                <span style={{color:"#50b4eb"}}>
                {billing.addressLine1}</span>,
                {billing.addressLine2 && ' '+billing.addressLine2+','} <br />
                {billing.city && billing.city+', '} 
                {billing.postCode && billing.postCode+','} <br />
                {billing.region && billing.region+ ', '}
                {billing.country}
               </p>
              </center>
              : ''}
          </CardBody>
        </Card>
      </div>
    )
  }
  loadHeader = (billing) => {
    return (
      <CardHeader>
        <strong>Billing Address</strong>
        <Link to={{ pathname: "/billing/address/add", state: { updateBill: billing } }}><Button color="success" className="float-right" onClick={this.EditBillingAddress}> + Billing Address</Button></Link>
      </CardHeader>);
  }

  showingNoBillingMessage = (billing) => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader(billing)}
          <center style={{ paddingTop: '20px' }}>
            <CardBody> <b>No Billing Address added, Please Add Now...</b></CardBody>
          </center>
        </Card>
      </div>)
  }
}

export default BillingInfo;