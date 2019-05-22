import React, { Component } from "react";
import { Button, Col, Row, CardHeader, Card, CardBody, Alert } from "reactstrap";
import Contacts from "./Contacts";
import Select from "react-select";
import chroma from 'chroma-js';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ContactApi from "../../services/ContactApi";
import { ReUseComponents } from "../uitility/ReUseComponents";

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

class UpdateContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: props.contact,
      alertColor: "#000000",
      message: '',
      updateSuccess: false,
      profileId: props.profileId,
      labels: props.lables,
      contactId: props.contactId,
      collapse: false,
      selectedOption: [],
      labelUpdate: '',
      spinner: false,
      cancelUpdateContact:false,
    };
  }

  handleUpdate = (event, errors, values) => {
    
    const { profileId, contactId, selectedOption, labelUpdate } = this.state
    if (errors.length === 0) {
      var new_Values= {...values,  "labelIds":selectedOption===[]?[]:( labelUpdate ? selectedOption.map(opt=>{return opt.value}): selectedOption ),"version": this.state.contact.version}
      if (profileId !== undefined | contactId !== undefined) {
        new ContactApi().updateContact(this.successCall, this.errorCall, new_Values, this.state.profileId, this.state.contactId)
      }
      // "labelIds":labelOption===null?[]:( labelOptionUpdate ? labelOption.map(opt=>{return opt.value}): labelOption ),
    }
  };
  cancelUpdateContact=()=>{
  this.setState({ cancelUpdateContact:true });
  }

  handleSelect = selectedOption => {
    this.setState({ selectedOption, labelUpdate : true });
    };
 
  successCall = json => {
    this.callAlertTimer( "success", "Contact Updated Successfully... ");
  };
 
  errorCall = err => {
    this.callAlertTimer( "danger", "Something went wrong, Please Try Again... ");
  };

  callAlertTimer = (alertColor, message) => {
    this.setState({ alertColor, message});
    setTimeout(() => {this.setState({ name: '', alertColor: '#000000', updateSuccess: true });
    }, 1500);
  };

  handleInput = e => {
    this.setState({ [e.target.name] : e.target.value });
  };
  
  toggle = () => {
    this.setState({ collapse : !this.state.collapse }); 
  }

  render() {
    const { contact, spinner, updateSuccess, alertColor, message,cancelUpdateContact} = this.state;
    if(cancelUpdateContact){
      return <Contacts />
    } else if( !spinner ){
      return <div>{updateSuccess ? <Contacts /> : this.loadUpdateContact(contact,alertColor,message)}</div>
    } else {
      return ReUseComponents.loadLoader("Total Labels: "+this.state.labels.length) //this.loadSpinner()
    }
  }

  loadHeader = () =>  <CardHeader><strong>EDIT CONTACT</strong></CardHeader>

  loadUpdateContact = (contact, alertColor, message) =>{
    return (
      <Card>
        <span style={{paddingTop:30}}>{ReUseComponents.loadHeader("Edit Contact")}</span>
        <CardBody>
          {alertColor !== "#000000" ? <Alert color={alertColor}>{message}</Alert> : ""}
          <AvForm onSubmit={this.handleUpdate}>
            <Row>
              <Col>            
              <AvField name="firstName" placeholder="First name" value={contact.firstName} /></Col>
              <Col><AvField name="lastName" placeholder="Last name" value={contact.lastName} /></Col>
            </Row>
            <Row>
               <Col><AvField name="organization"  placeholder="Organization Name" value={contact.organization} /></Col>
               <Col><AvField name="website" placeholder="Your Website" value={contact.website} /></Col>
            </Row>
            <Row>
              <Col><AvField name="phone" placeholder="Phone Number" value={contact.phone} /></Col>
              <Col><AvField name="email" type="text" placeholder="Your Email" validate={{ email: true }}  value={contact.email} /></Col>
            </Row>
            <Row>
              <Col>
                <AvField type="select" name="country" value={contact.country} helpMessage="Select Country">
                  <option value="">select</option>
                  <option value="India">INDIA</option>
                  <option value="UnitedKingdom">UK</option>
                  <option value="Afghanistan">AFGHANISTAN</option>
                  <option value="Australia">AUSTRALIA</option>
                  <option value="France">FRANCE</option>
                  <option value="Germany">GERMANY</option>
                  <option value="Romania">ROMANIA</option>
                </AvField>
              </Col>
              <Col><AvField name="state" placeholder="Your State" value={contact.state} /></Col>
              <Col><AvField name="postcode" placeholder="Your Postal Code" value={contact.postcode} /></Col>
            </Row>
            <Row>
               <Col><AvField name="address1" placeholder="Address 1" value={contact.address1} /></Col>
               <Col><AvField name="address2" placeholder="Address 2" value={contact.address2} /></Col>
            </Row>
            <Row><Col>{this.loadAvCollapse(contact)}</Col></Row><br/>
            <center>     
              <Button color="info">Update Contact</Button> &nbsp;&nbsp;
              <Button active color="light" type="button" onClick={this.cancelUpdateContact}>Cancel</Button>
            </center>
          </AvForm>
        </CardBody>
      </Card >)
 }

  loadAvCollapse = (contact) => {
    const labelOption = [];
    this.state.labels.map((label, key) => {
      if(Array.isArray(label.subLabels)){
        this.pushArray(labelOption,label);
        label.subLabels.map(sub=>{return(this.pushArray(labelOption,sub,label))})
      } else{
        this.pushArray(labelOption,label);
      }
      return 0;
    })
    const data =  contact.labelIds===null ? '' : contact.labelIds.map(id=>{return labelOption.filter(item =>{return item.value===id})}).flat();
    return <Select isMulti options={labelOption} defaultValue={data} styles={colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.handleSelect}/> ;
  }

  pushArray=(array, label, subLabel)=>{
    subLabel=== undefined ? array.push ({
      value: label.id,
      label: label.name,
      color: label.color === null ? "#000000" : label.color,
     }) : array.push ({
      value: label.id,
      label: subLabel.name+"/" +label.name,
      color: label.color === null ? "#000000" : label.color,
     })
  }
}

export default UpdateContact;
