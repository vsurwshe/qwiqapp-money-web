import React, { Component } from "react";
import { Button, Col, Row, CardHeader, Card, CardBody, Alert } from "reactstrap";
import Contacts from "./Contacts";
import Select from "react-select";
import chroma from 'chroma-js';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ContactApi from "../../services/ContactApi";
import { Loader } from 'react-loader-spinner'

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
      contact: [],
      alertColor: "#000000",
      message: "",
      updateSuccess: false,
      profileId: this.props.profileId,
      collapse: false,
      labels: this.props.lables,
      contactId:  this.props.contactId,
      selectedOption: [],
      labelUpdate: '',
      spinner: false
    };
  }

  componentDidMount =  () => {
    new ContactApi().getContactById(this.successContact,this.errorCall,this.state.profileId,this.state.contactId)
  }

  successContact = async (json) =>{
    console.log("json= ",json)
    await this.setState({contact:json, spinner : !this.state.spinner});  
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

  loadSpinner = () =>{
      return( <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Total Labels: {this.state.labels.length}</strong>
        </CardHeader>
        <center style={{paddingTop:'20px'}}>
          <CardBody>
          <Loader type="Ball-Triangle" color="#2E86C1" height={80} width={80}/>
          </CardBody>
        </center>
      </Card>
    </div>
      )
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
    setTimeout(() => {this.setState({ name: '', alertColor: '', updateSuccess: true });
    }, 2000);
  };

  handleInput = e => {
    this.setState({ [e.target.name] : e.target.value });
  };

  toggle = () => {
    this.setState({ collapse : !this.state.collapse }); 
  }

  render() {
    console.log("Specific Contact = ",this.state.contact)
      if( this.state.spinner ){
      const { contact, updateSuccess,alertColor, message } = this.state;
      return <div>{updateSuccess ? <Contacts /> : this.loadUpdateContact(contact,alertColor,message)}</div>
    } else{
      return this.loadSpinner
    }
    }

  loadHeader = () =>  <CardHeader><strong>EDIT CONTACT</strong></CardHeader>

  loadUpdateContact = (contact,alertColor,message) =>{
    return (
     <Card>
        {this.loadHeader()}
        <CardBody>
          <Alert color={alertColor}>{message}</Alert>
        <AvForm onSubmit={this.handleUpdate}>
          <Row>
            <Col>            
            <AvField name="firstName" placeholder="First name" value={contact.firstName} /></Col>
            <Col><AvField name="lastName" placeholder="Last name" value={contact.lastName} /></Col>
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
                <option value="Russia">RUSSIA</option>
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
          <Row>
            <Col>
               {this.loadAvCollapse(contact)}
           </Col>
           </Row><br/>
          <Row>
             <Col><AvField name="organization"  placeholder="Organization Name" value={contact.organization} /></Col>
             <Col><AvField name="website" placeholder="Your Website" value={contact.website} /></Col>
          </Row>
          <center>     
             <Button color="info" > Update Contact </Button> &nbsp;&nbsp;
             <a href="/contact/viewContacts" style={{textDecoration:'none'}}> <Button active color="light" type="button">Cancel</Button></a>
           </center>
        </AvForm>
      </CardBody>
    </Card >)
 }

  loadAvCollapse = (contact) => {
    console.log("contact = ",contact)
    const labelOption = [];
    this.state.labels.map((label, key)=>{
      if(Array.isArray(label.subLabels))
      { this.pushArray(labelOption,label);
        label.subLabels.map(sul=>{return(this.pushArray(labelOption,sul,label))})
      } else{
        this.pushArray(labelOption,label);
      }
      return 0;
    })
    console.log("show all lables: ", this.state.contact.labelIds);

   const data =  contact.labelIds===null ?'': contact.labelIds.map(id=>{return labelOption.filter(item =>{return item.value===id})}).flat();
    console.log("upidated contact is: ", data);
    return <Select isMulti options={labelOption} defaultValue={data} styles={colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.handleSelect}/> ;
  }
  pushArray=(array,label,slabel)=>{
    slabel=== undefined ? array.push ({
      value: label.id,
      label: label.name,
      color: label.color === null ? "#000000" : label.color,
     }) : array.push ({
      value: label.id,
      label: slabel.name+"/" +label.name,
      color: label.color === null ? "#000000" : label.color,
     })
  }
}

export default UpdateContact;
