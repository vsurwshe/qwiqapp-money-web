import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert, Button, Card, FormGroup, Col, Row } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Config from "../../../data/Config";
import Store from "../../../data/Store";
import UserApi from '../../../services/UserApi';
import BillingAddressApi from '../../../services/BillingAddressApi';
import BillingInfo from "./BillingInfo";
import {  updateStatusValue } from "../../../redux/actions/BillingAddressAction";
import { handleApiResponseMsg, setCountries, buttonAction } from "../../../redux/actions/UtilityActions";
import { userAction } from "../../../data/GlobalKeys";
import '../../../css/style.css';

const firstNameAndlastNameOrcompany = (value, field) => {
  if (!(field.firstName && field.lastName) && !field.company) {
    return 'You need to provide either FirstName&LastName / Company'
  }
  return true
}

class EditBillingAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doubleClick: false
    };
  }

  componentDidMount = () => {
    this.props.dispatch(setCountries(Store.getCountries()))
  }

  handleInputValidate = (e) => {
    if (e.target.name === "firstName") {
      this.validateLastName();
      this.validateCompany();
    } else if (e.target.name === "lastName") {
      this.validateFirstName();
      this.validateCompany();
    } else {
      this.validateFirstName();
      this.validateLastName();
    }
  }

  validateFirstName = () => {
    this.form.validateInput('firstName')
  }

  validateLastName = () => {
    this.form.validateInput('lastName')
  }

  validateCompany = () => {
    this.form.validateInput('company')
  }

  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    let newData = "";
    if (errors.length === 0) {
      newData = { ...values }
      this.handlePostData(event, newData);
    }
  }

  //this method handle the Post method from user`
  handlePostData = (e, data) => {
    this.setState({ doubleClick: true })
    setTimeout(() => {
      new BillingAddressApi().createBillingAddress(this.successCreate, this.errorCall, data);
    }, Config.notificationMillis)
  };

  //this method call when lables created successfully
  successCreate = () => {
    let user = Store.getUser();
    this.callAlertTimer("success", "Saved Billing Address");
    if (user.action === userAction.ADD_BILLING) {
      new UserApi().getUser((response) => Store.saveUser(response), this.errorCall);
    }
    // This is Seting update status for calling getbilling address in billinginfo component
    this.props.dispatch(updateStatusValue(true))
  }

  //this handle the error response the when api calling
  errorCall = err => {
    this.props.dispatch(handleApiResponseMsg('Unable to process, Please try Again....', 'danger', true))
  };

  //this method Notifies the user after every request
  callAlertTimer = (alertColor, content) => {
    this.props.dispatch(handleApiResponseMsg(content, alertColor, true))
    if (alertColor === 'success') {
      setTimeout(() => {
        this.props.dispatch(handleApiResponseMsg('', '', false))
        this.props.dispatch(buttonAction(false, true))
      }, Config.notificationMillis);
    }
  };

  render() {
    const { addBilling } = this.props.utility;
    if (!addBilling) {
      return <BillingInfo />
    } else {
      return <div>{this.loadCreatingBill()}</div>
    }
  }

  //this Method Call when Label Creation in porceess.
  loadCreatingBill = () => {
    // This line get billing address from redux store
    const { billingAddress:updateBill } = this.props.biliing;
    const { color, message, countries  } = this.props.utility;
    const placeholderStyle = { color: '#000000', fontSize: '1.0em', }
    return <div className="animated fadeIn" >
      <Card>
        <h4 className="padding-top"><b><center> BILLING ADDRESS</center></b></h4> <br />
        {color && <Alert color={color}>{message}</Alert>}
        {updateBill && <Col >
          <AvForm ref={refId => this.form = refId} onSubmit={this.handleSubmitValue}>
            <Row>
              <Col><AvField name="firstName" label="Firstname" placeholder="First Name" style={placeholderStyle} value={updateBill.firstName} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
              <Col><AvField name="lastName" label="Lastname" placeholder="Last Name" style={placeholderStyle} value={updateBill.lastName} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
              <Col><AvField name="company" label="Organization" placeholder="Organization" style={placeholderStyle} value={updateBill.company} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
            </Row>
            <Row>
              <Col><AvField name="addressLine1" label="Address line 1" placeholder="Address 1" style={placeholderStyle} value={updateBill.addressLine1} errorMessage="Address should not be empty" helpMessage="H.No 1-1-1/1, xyz  street" required /></Col>
              <Col><AvField name="addressLine2" label="Address line 2" placeholder="Address 2" style={placeholderStyle} value={updateBill.addressLine2} helpMessage="Jntuh area, hyderabad district" /></Col>
            </Row>
            <Row>
              <Col><AvField name="postCode" label="Postcode/ Pincode/ Zipcode" placeholder="Postal Code/ Pincode/ Zip code" style={placeholderStyle} value={updateBill.postCode} errorMessage="PostCode/pincode/Zipcode is required" /></Col>
              <Col><AvField name="city" label="City" placeholder="City" style={placeholderStyle} value={updateBill.city} /></Col>
            </Row>
            <Row>
              <Col><AvField name="region" label="Region/ State/ Area" placeholder="Region/ State/ Area" style={placeholderStyle} value={updateBill.region} /></Col>
              <Col>
                <AvField style={placeholderStyle} label="Country" type="select" id="country" name="country" value={updateBill.country} errorMessage="Select Country" onClick={() => this.setState({ alertColor: "", content: "" })} required >
                  {this.selectCountry(updateBill)}
                  {countries.map((country, key) => { return <option key={key} value={country.code}>{country.name}</option> })}
                </AvField>
              </Col>
            </Row>
            <center><FormGroup row>
              <Col>
                <Button color="info" disabled={this.state.doubleClick} > Save </Button> &nbsp; &nbsp;
                  <Button active color="light" type="button" onClick={() => this.props.handleCancelEditBillingAddress()}>Cancel</Button>
              </Col>
            </FormGroup>
            </center>
          </AvForm>
        </Col>}
      </Card>
    </div>
  }

  selectCountry = (updateBill) => {
    const {countries }=this.props.utility
    return <>
      {updateBill.country === "" ? <option value="">Select Country</option>
        : (countries.map((country, index) => {
          if (country.code === updateBill.country) {
            return <option key={index} value={updateBill.country}> {country.name} </option>
          }
          return 0;
        }))
      }
    </>
  }
}

const mapStateToProps = (state) => {
  return state;
}
export default connect(mapStateToProps)(EditBillingAddress);