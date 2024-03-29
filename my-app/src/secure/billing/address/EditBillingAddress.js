import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Card, FormGroup, Col, Row, Label } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Config from "../../../data/Config";
import Store from "../../../data/Store";
import UserApi from '../../../services/UserApi';
import BillingAddressApi from '../../../services/BillingAddressApi';
import BillingInfo from "./BillingInfo";
import {  updateStatusValue } from "../../../redux/actions/BillingAddressAction";
import { handleApiResponseMsg, setCountries, buttonAction } from "../../../redux/actions/UtilityActions";
import { userAction } from "../../../data/GlobalKeys";
import { ShowServiceComponent } from "../../utility/ShowServiceComponent";
import '../../../css/style.css';

const firstNameAndlastNameOrcompany = (value, field) => {
  if (!(field.firstName && field.lastName) && !field.company) {
    return 'You need to provide either FirstName and LastName / Company'
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
  errorCall = error => {
    let response = error && error.response;
    if (response) {
      this.props.dispatch(handleApiResponseMsg('Unable to process, please try again....', 'danger', true))
    } else {
      this.props.dispatch(handleApiResponseMsg('Please check your internet connection and re-try again.', 'danger', true))
    }
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
    const { alertMessage, alertColor, countries  } = this.props.utility;
    const placeholderStyle = { color: '#000000', fontSize: '1.0em', }
    const labelPaddingTop = {marginTop: 5}
    return <div className="animated fadeIn" >
      <Card>
        <h4 className="padding-top"><b><center> BILLING ADDRESS</center></b></h4> <br />
        {alertMessage && ShowServiceComponent.loadAlert(alertColor, alertMessage)}
        {updateBill && <Col >
          <AvForm ref={refId => this.form = refId} onSubmit={this.handleSubmitValue}>
            <Row>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>Firstname</Label></Col>
                  <Col><AvField name="firstName" placeholder="First Name" style={placeholderStyle} value={updateBill.firstName} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>Lastname</Label></Col>
                  <Col><AvField name="lastName" placeholder="Last Name" style={placeholderStyle} value={updateBill.lastName} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>Organization</Label></Col>
                  <Col><AvField name="company" placeholder="Organization" style={placeholderStyle} value={updateBill.company} validate={{ myValidation: firstNameAndlastNameOrcompany }} onChange={(e) => { this.handleInputValidate(e) }} /></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>Address line 1</Label></Col>
                  <Col><AvField name="addressLine1" placeholder="Address 1" style={placeholderStyle} value={updateBill.addressLine1} errorMessage="Address should not be empty" helpMessage="H.No 1-1-1/1, xyz  street" required /></Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>Address line 2</Label></Col>
                  <Col><AvField name="addressLine2" placeholder="Address 2" style={placeholderStyle} value={updateBill.addressLine2} helpMessage="Jntuh area, hyderabad district" /> </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>Postcode/ Zipcode</Label></Col>
                  <Col><AvField name="postCode" placeholder="Postal Code/ Pincode/ Zip code" style={placeholderStyle} value={updateBill.postCode} errorMessage="PostCode/pincode/Zipcode is required" /></Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>City</Label></Col>
                  <Col><AvField name="city" placeholder="City" style={placeholderStyle} value={updateBill.city} /></Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col sm={3}><Label>Region/ State/ Area</Label></Col>
                  <Col><AvField name="region" placeholder="Region/ State/ Area" style={placeholderStyle} value={updateBill.region} /></Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col sm={3}><Label style={labelPaddingTop}>Country</Label></Col>
                  <Col> <AvField style={placeholderStyle} type="select" id="country" name="country" value={updateBill.country} errorMessage="Select Country" onClick={() => this.setState({ alertColor: "", content: "" })} required >
                    {this.selectCountry(updateBill)} 
                    {this.loadCountryOptions(countries)} 
                    </AvField>
                  </Col>
                </Row>
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

  loadCountryOptions = (countries) => {
    return countries.map((country, key) => { return <option key={key} value={country.code}>{country.name}</option> })
  }
}

const mapStateToProps = (state) => {
  return state;
}
export default connect(mapStateToProps)(EditBillingAddress);