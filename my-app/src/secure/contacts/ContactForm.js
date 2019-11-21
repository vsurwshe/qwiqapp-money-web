import React, { Component } from "react";
import { CardBody, Button, Card, CardHeader, FormGroup, Col, Alert } from "reactstrap";
import { AvForm } from 'availity-reactstrap-validation';
import Select from "react-select";
import Contacts from './Contacts';
import ContactApi from "../../services/ContactApi";
import Config from "../../data/Config";
import Data from '../../data/SelectData';
import Store from "../../data/Store";
import { ContactFormUI } from "../utility/FormsModel";

const nameOrOrganization = (value, field) => {
  if (!field.name && !field.organization) {
    return 'You need to provide either Contact Name / Organization'
  }
  return true
}

class ContactForm extends Component {
  _isMount = false;
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.profileId,
      countries: [],
      labels: props.lables,
      contact: props.contact,
      selectedOption: [],
      selectedCountry: props.contact ? props.contact.country : "",
      hideCancel: props.hideButton
    };
  }

  componentDidMount = () => {
    this._isMount = true;
    const countries = Store.getCountries()
    this.setState({ countries })
  }

  componentWillUnmount() {
    this._isMount = false;
  }

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
    let { selectedCountry, selectedOption, profileId, contact, labelUpdate } = this.state;
    if (errors.length === 0) {
      values = {...values, "country": selectedCountry}
      var newData = { ...values, "labelIds": labelUpdate ? selectedOption.map(opt => { return opt.value }): (contact && contact.labelIds ? contact.labelIds : [] ) }
      if (contact) {
        newData = {...newData, "version": contact.version }
        new ContactApi().updateContact(this.successCall, this.errorCall, newData, this.state.profileId, contact.id );
      } else {
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
    this.setState({ selectedOption, labelUpdate: true });
  };

  errorCall = (err) => {
    this.callAlertTimer("danger", "Unable to Process the request, Please Try Again");
    this.setState({ failContactCreate: true })
  };

  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    if (alertMessage !== "Country is Required") {
      setTimeout(() => {
        if(this.state.hideCancel){
          this.setState({ hideCancel: '' })
          this.props.toggleCreateModal('', true)
        } else{
          if (this._isMount) {
            this.setState({ contactCreated: true });
          }
        }
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
    this.setState({ selectedCountry: e.target.value, alertColor: '', alertMessage: '' });
  }

  loadAddContact = (alertColor, alertMessage) => {
    const {countries, labels, selectedCountry, contact, labelUpdate, hideCancel} = this.state;
    let contactData = {
      countries: countries,
      labels: labels,
      selectedCountry: selectedCountry,
      contact: contact,
      labelUpdate: labelUpdate
    }
    return <Card>
      <CardBody>
        {alertColor && <Alert color={alertColor}>{alertMessage}</Alert>}
        <center><h5>Create Contact</h5></center><br />
        <AvForm ref={refId => this.form = refId} onSubmit={this.handleSubmit}>
          <ContactFormUI 
            data = {contactData}
            validateOrganization = {this.validateOrganization}
            validateName = {this.validateName}
            nameOrOrganization = {nameOrOrganization}
            handleCountrySelect = {this.handleCountrySelect}
            loadAvCollapse = {this.loadAvCollapse}
          />
          <center><FormGroup row>
            <Col>
              <Button color="info" disabled={this.state.disableDoubleClick} > Save </Button> &nbsp; &nbsp;
              {!hideCancel && <Button active color="light" type="button" onClick={this.cancelAddContact}>Cancel</Button>}
            </Col>
          </FormGroup></center>
        </AvForm>
      </CardBody>
    </Card>
  }

  // getting lables and SubLabels in select option
  loadAvCollapse = (contact) => {
    const labelOption = [];
    this.state.labels.map((label, key) => {
      if (Array.isArray(label.subLabels)) {
        this.pushArray(labelOption, label);
        label.subLabels.map(sul => {
          return this.pushArray(labelOption, sul, label)
        })
      } else {
        this.pushArray(labelOption, label);
      }
      return 0;
    })
    const data = contact && contact.labelIds && contact.labelIds.map(id => {
      return labelOption.filter(item => {
        return item.value === id
      })
    }).flat();
    return <Select isMulti options={labelOption} defaultValue={data} styles={Data.colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.handleSelect} />;

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

export default ContactForm;
