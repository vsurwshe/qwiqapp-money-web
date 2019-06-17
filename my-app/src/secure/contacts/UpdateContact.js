import React, { Component } from "react";
import { Button, Col, Row, CardHeader, Card, CardBody, Alert, Input } from "reactstrap";
 import Select from "react-select";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Loader from 'react-loader-spinner';
import Contacts from "./Contacts";
import ContactApi from "../../services/ContactApi";
import GeneralApi from "../../services/GeneralApi";
import Data from '../../data/SelectData';
import Config from "../../data/Config";

class UpdateContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: this.props.contact,
      country: [],
      alertColor: "#000000",
      message: "",
      updateSuccess: false,
      profileId: this.props.profileId,
      collapse: false,
      labels: this.props.lables,
      contactId: this.props.contact.id,
      selectedOption: [],
      labelUpdate: '',
      spinner: false,
      doubleClick: false,
      selectedCountry: this.props.contact.country,
      cancelUpdateContact: false,
    };
  }

  componentDidMount = () => {
    this.getCountryList();
  }

  getCountryList = () => {
    new GeneralApi().getCountrylist(this.setCountryList, this.errorCall);
  }

  setCountryList = arrayOfJson => {
    this.setState({ countries: arrayOfJson, spinner: !this.state.spinner });
  }

  handleUpdate = (event, errors, values) => {
    const { profileId, contactId, selectedOption, labelUpdate, selectedCountry } = this.state
    if (errors.length === 0) {
      if (profileId !== undefined | contactId !== undefined || selectedCountry !== "") {
        this.setState({ doubleClick: true });
        var new_Values = { ...values, "country": selectedCountry, "labelIds": selectedOption === [] ? [] : (labelUpdate ? selectedOption.map(opt => { return opt.value }) : selectedOption), "version": this.state.contact.version }
        new ContactApi().updateContact(this.successCall, this.errorCall, new_Values, this.state.profileId, this.state.contactId)
      }
    }
  };

  handleSelect = selectedOption => {
    this.setState({ selectedOption, labelUpdate: true });
  };

  successCall = json => {
    this.callAlertTimer("success", "Contact Updated Successfully... ");
  };

  errorCall = err => {
    this.callAlertTimer("danger", "Something went wrong, Please Try Again... ");
  };

  callAlertTimer = (alertColor, message) => {
    this.setState({ alertColor, message });
    setTimeout(() => {
      this.setState({ name: '', alertColor: '', updateSuccess: true });
    }, Config.notificationMillis);
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }
  cancelUpdateContact = () => {
    this.setState({ cancelUpdateContact: true })
  }
  handleCountrySelect = e => {
    this.setState({ selectedCountry: e.target.value });
  }

  render() {
    const { contact, updateSuccess, alertColor, message, cancelUpdateContact,spinner } = this.state;
    if (cancelUpdateContact) {
      return <Contacts />
    } else if (spinner) {
      return <div>{updateSuccess ? <Contacts /> : this.loadUpdateContact(contact, alertColor, message)} </div>
    } else {
      return this.loadSpinner()
    }
  }

  loadSpinner = () => {
    return (<div className="animated fadeIn">
      <Card>
        <CardHeader><strong>Total Labels: {this.state.labels.length}</strong></CardHeader>
        <center style={{ paddingTop: '20px' }}>
          <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60} /></CardBody>
        </center>
      </Card>
    </div>)
  }

  loadHeader = () => <CardHeader><strong>EDIT CONTACT</strong></CardHeader>

  loadUpdateContact = (contact, alertColor, message) => {
    return (
      <Card>
        {this.loadHeader()}
        <CardBody>
          {alertColor === "#000000" ? "" : <Alert color={alertColor}>{message}</Alert>}
          <AvForm onSubmit={this.handleUpdate}>
            <Row>
              <Col> <AvField name="name" placeholder="Contact name" value={contact.name} validate={{ pattern: { value: '^[A-Za-z_.-0-9]' } }} /> </Col>
              <Col><AvField name="organization" placeholder="Organization Name" value={contact.organization} validate={{ pattern: { value: '^[a-zA-Z0-9_.-]*' } }} /></Col>
            </Row>
            <Row>
              <Col><AvField name="phone" placeholder="Phone Number" value={contact.phone} validate={{ pattern: { value: '^[0-9*+-]+$' } }} /></Col>
              <Col><AvField name="email" type="text" placeholder="Your Email" validate={{ email: true }} value={contact.email} /></Col>
            </Row>
            <Row>
              <Col><AvField name="address1" placeholder="Address 1" value={contact.address1} /></Col>
              <Col><AvField name="address2" placeholder="Address 2" value={contact.address2} /></Col>
            </Row>
            <Row>
              <Col><AvField name="postcode" placeholder="Your Postal Code" value={contact.postcode} validate={{ pattern: { value: '^[0-9]{6}' } }} /></Col>
              <Col><AvField name="state" placeholder="Your State" value={contact.state} /></Col>
              <Col>
                <Input type="select" onChange={e => this.handleCountrySelect(e)} value={this.state.selectedCountry}  >
                  <option value="">Select Country</option>
                  {this.state.countries.map((country, key) => {
                    return <option key={key} value={country.code}>{country.name + ' (' + country.short + ')'}</option>;
                  })}
                </Input>
              </Col>
              <Col><AvField name="website" placeholder="Your Website" value={contact.website} /></Col>
            </Row>
            <Row>
              <Col>
                {this.state.labels.length === 0 ? <center>You dont have Label</center> : this.loadAvCollapse(contact)}
              </Col>
            </Row><br />
            <center>
              <Button color="info" disabled={this.state.doubleClick}> Update Contact </Button> &nbsp;&nbsp;
              <Button active color="light" type="button" onClick={this.cancelUpdateContact}>Cancel</Button>
            </center>
          </AvForm>
        </CardBody>
      </Card >)
  }

  loadAvCollapse = (contact) => {
    const labelOption = [];
    this.state.labels.map((label, key) => {
      if (Array.isArray(label.subLabels)) {
        this.pushArray(labelOption, label);
        label.subLabels.map(sul => { return (this.pushArray(labelOption, sul, label)) })
      } else {
        this.pushArray(labelOption, label);
      }
      return 0;
    })
    const data = contact.labelIds === null ? '' : contact.labelIds.map(id => { return labelOption.filter(item => { return item.value === id }) }).flat();
    return <Select isMulti options={labelOption} defaultValue={data} styles={Data.colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.handleSelect} />;
  }

  pushArray = (array, label, slabel) => {
    slabel === undefined ? array.push({
      value: label.id,
      label: label.name,
      color: label.color === null || label.color === "" ? "#000000" : label.color,
    }) : array.push({
      value: label.id,
      label: slabel.name + "/" + label.name,
      color: label.color === null || label.color === "" ? "#000000" : label.color,
    })
  }
}

export default UpdateContact;