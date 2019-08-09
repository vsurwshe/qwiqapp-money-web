import React, { Component } from "react";
import { CardBody, Button, Card, Row, CardHeader, FormGroup, Col, Alert, Input } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Select from "react-select";
import Contacts from './Contacts';
import ContactApi from "../../services/ContactApi";
import Config from "../../data/Config";
import GeneralApi from "../../services/GeneralApi";
import Data from '../../data/SelectData';

const nameAndOrorganization = (value, field) => {
  if (!field.name && !field.organization) {
    return 'You need to provide either name / organization'
  }
  return true
}

class CreateContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.profileId,
      labels: props.lables,
      contactCreated: false,
      collapse: false,
      alertColor: '',
      alertMessage: '',
      selectedOption: [],
      formInput: '',
      cancelAddContact: false,
      disableDoubleClick: false,
      countries: [],
      selectingCountry: '',
    };
  }

  componentDidMount = () => {
    new GeneralApi().getCountrylist(this.successCallCountryList, this.errorCallCountry)
  }

  successCallCountryList = arrayResult => {
    this.setState({ countries: arrayResult });
  }

  errorCallCountry = error => { console.log(error) }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateOrganization = () => {
    this.form.validateInput('organization')
  }

  validateName = () => {
    this.form.validateInput('name')
  }

  handleSubmit = async (event, errors, values) => {
    event.persist();
    let { selectingCountry, selectedOption, profileId } = this.state;
    if (errors.length === 0) {
      this.setState({ formInput: values })
      if (selectingCountry === "") {
        this.callAlertTimer("danger", "Country is Required")
      } else {
        this.setState({ disableDoubleClick: true });
        var newData = { ...values, "country": selectingCountry, "labelIds": selectedOption.map((opt) => { return opt.value }) }
        await new ContactApi().createContact(this.successCall, this.errorCall, profileId, newData);
      }
    }
  }

  cancelAddContact = () => {
    this.setState({ cancelAddContact: true })
  }

  successCall = (response) => {
    this.callAlertTimer("success", "Contact Created Successfully !");
  }

  handleSelect = selectedOption => {
    this.setState({ selectedOption });
  };

  errorCall = (err) => {
    this.callAlertTimer("danger", "Unable to Process the request, Please Try Again");
    this.setState({ failContactCreate: true })
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    if (alertMessage !== "Country is Required") {
      setTimeout(() => {
        this.setState({ contactCreated: true });
      }, Config.notificationMillis);
    }
  };

  render() {
    const { contactCreated, alertColor, alertMessage, cancelAddContact } = this.state;
    if (cancelAddContact) {
      return <Contacts />
    } else {
      return <div>{contactCreated ? <Contacts /> : this.loadAddContact(alertColor, alertMessage)}</div>
    }
  }

  loadHeader = () => {
    return <CardHeader><strong>Contacts</strong></CardHeader>
  }

  handleCountrySelect = e => {
    this.setState({ selectingCountry: e.target.value, alertColor: '', alertMessage: '' });
  }

  loadAddContact = (alertColor, alertMessage) => {
    return <Card>
      <CardBody>
        {alertColor && <Alert color={alertColor}>{alertMessage}</Alert>}
        <center><h5>Create Contact</h5></center><br />
        <AvForm ref={refId => this.form = refId} onSubmit={this.handleSubmit}>
          <Row>
            <Col><AvField name="name" placeholder="Name" validate={{ myValidation: nameAndOrorganization }} onChange={this.validateOrganization} /></Col>
            <Col><AvField name="organization" placeholder="Organization" validate={{ myValidation: nameAndOrorganization }} onChange={this.validateName} /></Col>
          </Row>
          <Row>
            <Col><AvField name="phone" placeholder="Phone Number" validate={{ pattern: { value: '^[0-9*+-]+$' } }} errorMessage="Please enter valid Phone number" required /></Col>
            <Col><AvField name="email" placeholder="Email" type="text" validate={{ email: true }} errorMessage="Please enter valid Email id" required /></Col></Row>
          <Row>
            <Col><AvField name="address1" placeholder="Address 1" /></Col>
            <Col><AvField name="address2" placeholder="Address 2" /></Col>
          </Row>
          <Row>
            <Col><AvField name="postcode" placeholder="Postal Code" errorMessage="Enter Valid Postal Code" validate={{ pattern: { value: '^[0-9]{6}' } }} /></Col>
            <Col><AvField name="state" placeholder="State" /></Col>
            <Col>
              <Input type="select" onChange={e => this.handleCountrySelect(e)} value={this.state.selectingCountry} placeholder="Select country" required>
                <option value="">Select Country</option>
                {this.state.countries.map((country, key) => {
                  return <option key={key} value={country.code}>{country.name + ' (' + country.short + ')'}</option>;
                })}
              </Input>
            </Col>
            <Col><AvField name="website" placeholder="Website" /></Col>
          </Row>
          <Row><Col>{this.state.labels.length === 0 ? <center>You dont have Labels</center> : this.loadAvCollapse()}</Col></Row> <br />
          <center><FormGroup row>
            <Col>
              <Button color="info" disabled={this.state.disableDoubleClick} > Save </Button> &nbsp; &nbsp;
                    <Button active color="light" type="button" onClick={this.cancelAddContact}>Cancel</Button>
            </Col>
          </FormGroup></center>
        </AvForm>
      </CardBody>
    </Card>
  }

  // getting lables and SubLabels in select option
  loadAvCollapse = () => {
    const lablesList = [];
    if (this.state.labels.length === 0) {
      lablesList.push({
        value: null,
        label: "You don't have any lables now.",
      })
      return <Select options={lablesList} placeholder="Select the Label" />
    } else {
      this.state.labels.map((label, key) => {
        if (Array.isArray(label.subLabels)) {
          this.pushArray(lablesList, label);
          label.subLabels.map(subLabel => {
            return this.pushArray(lablesList, subLabel, label)
          })
        } else {
          this.pushArray(lablesList, label);
        }
        return 0;
      });
      return <Select onChange={this.handleSelect} isMulti options={lablesList} placeholder="Select the Label" styles={Data.colourStyles} />
    }
  }

  pushArray = (lablesList, label, slabel) => {
    !slabel ? lablesList.push({
      value: label.id,
      label: label.name,
      color: !label.color ? "#000000" : label.color,
    }) : lablesList.push({
      value: label.id,
      label: slabel.name + "/" + label.name,
      color: !label.color ? "#000000" : label.color,
    })
  }
}

export default CreateContact;
