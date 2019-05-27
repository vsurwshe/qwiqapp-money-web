import React, { Component } from "react";
import { CardBody, Button, Card, Row, CardHeader, FormGroup, Col, Alert, Input } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Contacts from './Contacts';
import chroma from 'chroma-js';
import Select from "react-select";
import ContactApi from "../../services/ContactApi";
import Config from "../../data/Config";
import GenralApi from "../../services/GenralApi";

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

class CreateContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.profileId,
      labels: props.lables,
      contactCreated: false,
      collapse: false,
      alertColor: '',
      message: '',
      selectedOption: [],
      formTouched: true,
      formInput: '',
      cancelAddContact: false,
      doubleClick: false,
      countries:[],
      selectedCountry: '',
    };
  }
  componentDidMount = () => {
    new GenralApi().getCountrylist(this.successCallCountryList, this.errorCallContry)
  }
  successCallCountryList = arrayResult =>{
    console.log(arrayResult.data.length);
    this.setState({ countries: arrayResult });
  }
  errorCallContry = error =>{console.log(error)}

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (event, errors, values) => {
    event.persist();
    let {selectedCountry, selectedOption, profileId } = this.state;
    if (errors.length === 0) {
      this.setState({ formInput: values })
      if (values.name === "" ) {
        this.callAlertTimer("danger", "Name is required ")
      } else if (selectedCountry === "") {
        this.callAlertTimer("danger", "Country is Required ")
      } else {
        this.setState({ doubleClick: true });
        var newData = { ...values, "country": selectedCountry, "labelIds": selectedOption.map((opt) => { return opt.value }) }
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
    this.setState({ failContactCreate: true, alertColor: "danger" })
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  callAlertTimer = (alertColor, message) => {
    this.setState({ alertColor, message });
    if (message !== "Firstname or Last name is needed ") {
      setTimeout(() => {
        this.setState({ contactCreated: true });
      }, Config.notificationMillis);
    }
  };

  render() {
    const { contactCreated, alertColor, message, cancelAddContact } = this.state;
    if (cancelAddContact) {
      return <Contacts />
    } else {
      return <div>{contactCreated ? <Contacts /> : this.loadAvCreateContact(alertColor, message)}</div>
    }
  }

  loadHeader = () => {
    return <CardHeader><strong>Contacts</strong></CardHeader>
  }
  handleCountrySelect =e=>{
    this.setState({ selectedCountry: e.target.value });
  }

  loadAvCreateContact = (alertColor, message) => {
    console.log(this.state.labels.length);
    return (
      <div>
        <Card>
          <CardBody>
            <Alert color={alertColor}>{message}</Alert>
            <center><h5>Create Contact</h5></center><br />
            <AvForm onSubmit={this.handleSubmit}>
              <Row>
                <Col><AvField name="name" placeholder="Contact Name" validate={{ pattern: { value: '^[A-Za-z_]+$' } }} required /></Col>
                <Col><AvField name="organization" placeholder="Organization" validate={{ pattern: { value: '^[a-zA-Z0-9_.-]*' } }} required /></Col>
              </Row>
              <Row>
                <Col><AvField name="phone" placeholder="Phone Number" required /></Col>
                <Col><AvField name="email" placeholder="Your Email" type="text" validate={{ email: true }} required /></Col></Row>
                <Row>
                  <Col><AvField name="address1" placeholder="Address 1" /></Col>
                  <Col><AvField name="address2" placeholder="Address 2" /></Col>
                </Row>
                <Row>
                  <Col><AvField name="postcode" placeholder="Your Postal Code" errorMessage="Enter Valid Postal Code" validate={{ pattern: { value: '^[0-9]{6}' } }} /></Col>
                  <Col><AvField name="state" placeholder="Your State" /></Col>
                  <Col>
                    <Input type="select" onChange={e=>this.handleCountrySelect(e)} label="Multiple Select" >
                      <option value="">Select Country</option>
                      {this.state.countries.map((country, key) => {
                        return <option key={key} value={country}>{country}</option>;
                      })}
                    </Input>
                  </Col>
                <Col><AvField name="website" placeholder="Website" /></Col>
                </Row>
                <Row><Col>{this.state.labels.length === 0 ? "" : this.loadAvCollapse()}</Col></Row> <br />
                <center><FormGroup row>
                  <Col>
                    <Button color="info" disabled={this.state.doubleClick} > Save </Button> &nbsp; &nbsp;
                  <Button active color="light" type="button" onClick={this.cancelAddContact}>Cancel</Button>
                  </Col>
                </FormGroup></center>
            </AvForm>
          </CardBody>
        </Card>
      </div>)
    }
  
  loadAvCollapse = () => {
    const labelQ = [];
    if (this.state.labels.length === 0) {
          labelQ.push({
            value: null,
            label: "You don't have any lables now.",
          })

      return (<div >
          <Select options={labelQ} placeholder="Select the Label" />
        </div>);
    } else {
          this.state.labels.map((slabel, key) => {
            if (Array.isArray(slabel.subLabels)) {
              this.pushArray(labelQ, slabel);
              slabel.subLabels.map(sul => { return (this.pushArray(labelQ, sul, slabel)) })
            } else {
              this.pushArray(labelQ, slabel);
            }
            return 0;
          });

        return (<div >
          <Select onChange={this.handleSelect} isMulti options={labelQ} placeholder="Select the Label" styles={colourStyles} />
        </div>);
      }
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
        
        export default CreateContact;
