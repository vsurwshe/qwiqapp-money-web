import React, { Component } from "react";
import {connect} from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Alert, Button, Card, FormGroup, Col, Row } from "reactstrap";
import Store from "../../../data/Store";
import BillingInfo from "./BillingInfo";
import {billingAddressPost,cancelButton} from '../../../components/redux/actions/billingAddressActions';

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
      //navigateToBilling: false,
      //alertColor: "",
      //content: "",
      doubleClick: false,
      countries: [],
     // updateBill: props.updateBill,
    };
  }

  componentDidMount = () => {
    const countries = Store.getCountries();
    this.setState({ countries });
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
    }
    this.props.dispatch(billingAddressPost(newData));
  }

  handleCancelEditBillingAddress=()=>{
    this.props.dispatch(cancelButton());
  }

  render() {
    const {buttonCalcel,getBillingAddress } = this.props
    if (buttonCalcel) {
      return <BillingInfo />
    } else {
      return <div>{this.loadCreatingBill(getBillingAddress)}</div>
    }
  }

  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (getBillingAddress) => {
    const {message,color}=this.props;
    const{firstName,lastName,company,addressLine1,addressLine2,postCode,city,region,country}=this.props.getBillingAddress;
    const placeholderStyle = { color: '#000000', fontSize: '1.0em', }
    return <div className="animated fadeIn" >
      <Card>
        <h4 className="padding-top"><b><center> BILLING ADDRESS</center></b></h4> <br />
       <Col >
          {message && <Alert color={color}>{message}</Alert>}
          <AvForm ref={refId => this.form = refId} onSubmit={this.handleSubmitValue}>
            <Row>
              <Col><AvField name="firstName" label="Firstname" placeholder="First Name" style={placeholderStyle} value={firstName} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
              <Col><AvField name="lastName" label="Lastname" placeholder="Last Name" style={placeholderStyle} value={lastName} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
              <Col><AvField name="company" label="Organization" placeholder="Organization" style={placeholderStyle} value={company} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
            </Row>
            <Row>
              <Col><AvField name="addressLine1" label="Address line 1" placeholder="Address 1" style={placeholderStyle} value={addressLine1} errorMessage="Address should not be empty" helpMessage="H.No 1-1-1/1, xyz  street" required /></Col>
              <Col><AvField name="addressLine2" label="Address line 2" placeholder="Address 2" style={placeholderStyle} value={addressLine2} helpMessage="Jntuh area, hyderabad district" /></Col>
            </Row>
            <Row>
              <Col><AvField name="postCode" label="Postcode/ Pincode/ Zipcode" placeholder="Postal Code/ Pincode/ Zip code" style={placeholderStyle} value={postCode} errorMessage="PostCode/pincode/Zipcode is required" /></Col>
              <Col><AvField name="city" label="City" placeholder="City" style={placeholderStyle} value={city} /></Col>
            </Row>
            <Row>
              <Col><AvField name="region" label="Region/ State/ Area" placeholder="Region/ State/ Area" style={placeholderStyle} value={region} /></Col>
              <Col>
                <AvField style={placeholderStyle} label="Country" type="select" id="country" name="country" value={country} errorMessage="Select Country" onClick={() => this.setState({ color: "", message: "" })} required >
                  {this.selectCountry(country)}
                  {this.state.countries.map((country, key) => { return <option key={key} value={country.code}>{country.name}</option> })}
                </AvField>
              </Col>
            </Row>
            <center><FormGroup row>
              <Col>
                <Button color="info" disabled={this.state.doubleClick} > Save </Button> &nbsp; &nbsp;
                  <Button active color="light" type="button" onClick={() => this.handleCancelEditBillingAddress()}>Cancel</Button>
              </Col>
            </FormGroup>
            </center>
          </AvForm>
        </Col>
      </Card>
    </div>
  }

  selectCountry = (country) => {
    return <>
      {country === "" ? <option value="">Select Country</option>
        : (this.state.countries.map((country, index) => {
          if (country.code === country) {
            return <option key={index} value={country}> {country.name} </option>
          }
          return 0;
        }))
      }
    </>
  }
}

const mapStateToProps=(state)=>{
  console.log(state)
 // return state;
  return{
    "getBillingAddress": state.getBillingAddress,
    "buttonCalcel":state.buttonCalcel
  }
}
export default connect(mapStateToProps)(EditBillingAddress);