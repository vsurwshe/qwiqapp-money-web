import React, { Component } from "react";
import { Redirect } from 'react-router';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Alert, Button, Card, FormGroup, Col, Row } from "reactstrap";
import BillingAddressApi from '../../services/BillingAddressApi';
import GeneralApi from "../../services/GeneralApi";
import Config from "../../data/Config";

class AddBillingAddress extends Component {
  is_unmount = false
  constructor(props) {
    super(props);
    this.state = {
      billCreated: false,
      alertColor: "",
      content: "",
      cancelCreateBill: false,
      doubleClick: false,
      countries: [],
      updateBill: props.location.state.updateBill
    };
  }

  componentDidMount = () => {
    this.is_unmount = true;
    new GeneralApi().getCountrylist(this.successCall, this.errorCall)
  }

  successCall = countries => {
    this.setState({ countries });
  }
  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    const { updateBill } = this.state
    let newData = "";
    if (errors.length === 0) {
      if (values.country || updateBill.country) {
        if (values.country) {
          newData = { ...values }
        } else {
          values.country = updateBill.country
          newData = { ...values }
        }
        this.handlePostData(event, newData);
      } else {
        this.setState({ alertColor: "danger", content: "Country should not be empty" });
        setTimeout(() => {
          this.setState({ alertColor: "", content: "" });
        }, Config.notificationMillis)
      }
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
    this.callAlertTimer("success", "Saved Billing Address");
    setTimeout(() => this.setState({ cancelCreateBill: true }), Config.notificationMillis)
  }

  //this handle the error response the when api calling
  errorCall = err => {
    this.callAlertTimer("danger", "Unable to Process Request, Please try Again....");
  };

  cancelCreateBill = () => {
    this.setState({ cancelCreateBill: true })
  }

  //this method Notifies the user after every request
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    if(alertColor==="success"){
      setTimeout(() => {
        const { name, alertColor, content, billCreated, doubleClick } = this.state;
        if (alertColor || content || name || billCreated || doubleClick) {
          this.setState({ name: "", content: "", alertColor: "", billCreated: true, doubleClick: false });
        }
      }, Config.notificationMillis);
    }
   
  };

  render() {
    const { alertColor, content, cancelCreateBill, updateBill } = this.state
    if (cancelCreateBill) {
      return <Redirect to={{ pathname: '/billing/address' }} />

    } else {
      return <div>{this.loadCreatingBill(alertColor, content, updateBill)}</div>
    }
  }

  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (alertColor, content, updateBill) => {
    const placeholderStyle = {
      color: '#000000',
      fontSize: '1.0em',
    }
    return (
      <div className="animated fadeIn" >
        <Card>
          <h4 style={{ paddingTop: 20 }}><b><center> BILLING ADDRESS</center></b></h4>
          <Col sm="12" md={{ size: 8, offset: 2 }} style={placeholderStyle}>
            <Alert color={alertColor}>{content}</Alert>
            <AvForm onSubmit={this.handleSubmitValue}>
              <Row>
                <Col><AvField name="firstName" placeholder="First Name" style={placeholderStyle} value={updateBill.firstName} required /></Col>
                <Col><AvField name="lastName" placeholder="Last Name" style={placeholderStyle} value={updateBill.lastName} /></Col>
                <Col><AvField name="company" placeholder="Organization" style={placeholderStyle} value={updateBill.company} validate={{ pattern: { value: '^[a-zA-Z0-9_.-]*' } }} required /></Col>
              </Row>
              <Row>
                <Col><AvField name="addressLine1" placeholder="Address 1" style={placeholderStyle} required value={updateBill.addressLine1} /></Col>
                <Col><AvField name="addressLine2" placeholder="Address 2" style={placeholderStyle} value={updateBill.addressLine2} /></Col>
              </Row>
              <Row>
                <Col><AvField name="postCode" placeholder="Postal Code" style={placeholderStyle} value={updateBill.postCode} errorMessage="Postal Code" validate={{ pattern: { value: '^[0-9]{6}' } }} /></Col>
                <Col><AvField name="city" placeholder="City" style={placeholderStyle} value={updateBill.city} /></Col>
              </Row>
              <Row>
                <Col><AvField name="region" placeholder="State" style={placeholderStyle} value={updateBill.region} /></Col>
                <Col>
                  <AvField style={placeholderStyle} type="select" id="country" name="country" errorMessage="Select Country" >
                    {this.selectOPtionCuntry(updateBill)}
                    {this.state.countries.map((country, key) => { return <option key={key} value={country.code}>{country.name}</option> })}
                  </AvField>
                </Col>
              </Row>
              <center><FormGroup row>
                <Col>
                  <Button color="info" disabled={this.state.doubleClick} > Save </Button> &nbsp; &nbsp;
                  <Button active color="light" type="button" onClick={this.cancelCreateBill}>Cancel</Button>
                </Col>
              </FormGroup></center>
            </AvForm>
          </Col>
        </Card>
      </div>);
  }
  selectOPtionCuntry = (updateBill) => {
    return (<>
      {updateBill.country === "" ? <option value="">Select Country</option>
        : (this.state.countries.map((country, index) => {
          if (country.code === updateBill.country) {
            return <option key={index} value={country.code}> {updateBill.country} </option>
          }
          return 0;
        }))
      }
    </>
    )
  }
}
export default AddBillingAddress;