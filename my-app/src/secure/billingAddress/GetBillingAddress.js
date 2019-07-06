import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import BillingAddressApi from '../../services/BillingAddressApi';
import AddBillingAddress from './AddBillingAddress';

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
class GetBillingAddress extends Component {
  state = {
    billings: [],
    visible: false,
    spinner: false,
    addBilling: false,
    updateBill: false,
  }

  componentDidMount = async () => {
    await new BillingAddressApi().getBillings(this.successcall, this.errorcall)
  }

  successcall = async (billings) => {
    if (billings === null || billings === " ") {
      await this.setState({ billings: emptyBillingAddress, spinner: true })
    } else {
      await this.setState({ billings })
    }
  }

  errorcall = () => {
    this.setState({ visible: true })
  }

  addBillingAddress = () => {
    this.setState({ addBilling: true, spinner: true });
  }

  updateBillingAddress = () => {
    this.setState({ updateBill: true })
  }

  render() {
    const { billings, visible, addBilling } = this.state;
    if (addBilling) {
      return <AddBillingAddress updateBill={billings} />
    } else if (!billings.country) {
      return this.showingNoBillingMessage(billings)
    } else {
      return this.billingAddress(billings, visible);
    }
  }

  billingAddress = (billings, visible) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Billing Address</strong>
            <Link to={{ pathname: "/billing/address/add", state: { updateBill: billings } }}><Button color="success" className="float-right" onClick={this.addBillingAddress}> Update </Button></Link>
          </CardHeader>
          <CardBody>
            <Alert isOpen={visible} color="danger">Unable to process, Please try Again.... </Alert>
            {billings !== null ?
              <center className="text-sm-left">
                <b>FirstName: </b>{billings.firstName}<br />
                <b>LastName:</b> {billings.lastName}<br />
                <b>Company: </b>{billings.company}<br />
                <b>Address1:</b> {billings.addressLine1}<br />
                <b>Address2:</b> {billings.addressLine2}<br />
                <b>City:</b> {billings.city}<br />
                <b>Region: </b>{billings.region}<br />
                <b>PostCode:</b> {billings.postCode}<br />
                <b>Country : </b>{billings.country}<br />
              </center>
              : ''}
          </CardBody>
        </Card>
      </div>
    )
  }

  loadHeader = (billings) => {
    return (
      <CardHeader>
        <strong>Billing Address</strong>
        <Link to={{ pathname: "/billing/address/add", state: { updateBill: billings } }}><Button color="success" className="float-right" onClick={this.addBillingAddress}> + Billing Address</Button></Link>
      </CardHeader>);
  }

  showingNoBillingMessage = (billings) => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader(billings)}
          <center style={{ paddingTop: '20px' }}>
            <CardBody> <b>No Billing Address added, Please Add Now...</b></CardBody>
          </center>
        </Card>
      </div>)
  }
}

export default GetBillingAddress;