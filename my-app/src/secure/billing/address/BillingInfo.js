import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Button, Alert } from 'reactstrap';
import EditBillingAddress from './EditBillingAddress';
import Loader from 'react-loader-spinner';
import '../../../css/style.css';
import { loadBillingAddress, clickBillingAddressButton, shopNotification } from '../../../components/redux/actions/billingAddressActions';
import { changeUserAction } from '../../../components/redux/actions/userAction';
import Store from '../../../data/Store';
import Config from '../../../data/Config';

class BillingInfo extends Component {

  componentDidMount() {
    if(this.props.getBillingAddress){
    this.props.dispatch(loadBillingAddress());
    }
  }
  changeUserAction = () => {
    let user = Store.getUser();
    if (user.action === "ADD_BILLING") {
      this.props.dispatch(changeUserAction());
    }
  }

  editBillingAddress = () => {
    console.log("Click props ",this.props)
    this.props.dispatch(clickBillingAddressButton());
  }

  render() {
    const { getBillingAddress, spinner, addBilling, showAlert, message } = this.props;
    if (addBilling) {
      return <EditBillingAddress />
    } else if (!getBillingAddress) {
      if (!spinner) {
        return this.showingNoBillingMessage();
      } else {
        return this.showingNoBillingMessage()
      }
    } else if (getBillingAddress === [] || getBillingAddress === '') {
      return this.showingNoBillingMessage()
    } else {
      return this.billingAddress(getBillingAddress, showAlert, message);
    }
  }

  loadSpinner = () => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center className="padding-top">
          <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
        </center>
      </Card>
    </div>
  }
  response = () => {
    setTimeout(() => {
      this.props.dispatch(shopNotification());
    }, Config.notificationMillis);
  }
  billingAddress = (getBillingAddress, showAlert, message) => {
    console.log("&&&&&&&&&&&&&&", getBillingAddress)
    const { firstName, lastName, company, addressLine1, addressLine2, region, postCode, country, city } = getBillingAddress ? getBillingAddress : '';
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Billing Address</strong>
            <Button color="success" className="float-right" onClick={this.editBillingAddress}> Edit Billing Address</Button>
          </CardHeader>
          <CardBody>
            <Alert isOpen={showAlert} color={this.props.color}>{message}</Alert>
              <CardBody>
                <center className="text-sm-left">
                  <b>{(firstName && lastName) ? firstName + " " + lastName : company}</b><br />
                  <p>
                    {addressLine1 + ', '}
                    {addressLine2 && addressLine2 + ','} <br />
                    {city && <>{city + ', '}<br /></>}
                    {region ? <>{region + ', '}{postCode && " - " + postCode + ","}<br /></> : postCode && <>{postCode + ","}<br /></>}
                    {country}
                  </p>
                </center>
              </CardBody>
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
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center className="padding-top" >
          <CardBody> <b>No Billing Address added, Please Add Now...</b></CardBody>
        </center>
      </Card>
    </div>
  }
}

const mapStateToProps = (state) => {
  return state;
}
export default connect(mapStateToProps)(BillingInfo);