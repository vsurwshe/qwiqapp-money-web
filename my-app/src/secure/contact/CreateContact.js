import React, { Component } from "react";
import { CardBody, Button, Card, Row, CardHeader, FormGroup, Col, Alert} from "reactstrap";
import { AvForm, AvField} from 'availity-reactstrap-validation';
import Contacts from './Contacts';
import chroma from 'chroma-js';
import Select from "react-select";
import ContactApi from "../../services/ContactApi";
import Config from "../../data/Config";

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
  constructor(props){
    super(props);
    this.state = {
      profileId: props.profileId,
      labels: props.lables,
      contactCreated: false,
      collapse: false,
      alertColor:'',
      message:'',
      selectedOption: [],
      formTouched: true,
          formInput:'',
          cancelAddContact:false,
    };
  }
  handleInput = e => {
    this.setState({ [e.target.name] : e.target.value });
  };
  
  handleSubmit = async (event, errors, values) => {
    event.persist();
  
    if (errors.length===0) {
      this.setState({formInput:values})
      if (values.firstName !== "" || values.lastName !== "" ) {
        var newData={...values,"labelIds":this.state.selectedOption.map((opt)=>{return opt.value})}
        await new ContactApi().createContact(this.successCall, this.errorCall, this.state.profileId, newData);  
      } else{
        this.callAlertTimer("danger", "Firstname or Last name is needed ")
      }
    } 
  }
  cancelAddContact=()=>{
    this.setState({cancelAddContact:true})
  }
  successCall = (response) =>{
    this.callAlertTimer("success","Contact Created Successfully !" );
  }
  handleSelect = selectedOption => {
    this.setState({ selectedOption });
  };

  errorCall = (err) => { 
    this.callAlertTimer("danger","Unable to Process the request, Please Try Again" );
    this.setState({ failContactCreate : true, alertColor:"danger" })};
  
  toggle = () => {
    this.setState({ collapse : !this.state.collapse });
  }
 
  callAlertTimer = (alertColor, message) => {
    this.setState({ alertColor, message });
    if(message !== "Firstname or Last name is needed "){
      setTimeout(() => {
        this.setState({ contactCreated: true});
      }, Config.notificationMillis);
    } 
  };

  render() {
    const { contactCreated, alertColor, message,cancelAddContact } = this.state;
    if(cancelAddContact){
      return <Contacts />
    }else{
       return <div>{contactCreated?<Contacts />:this.loadAvCreateContact(alertColor,message)}</div>
    }
  }
  
  loadHeader = () =>{
    return <CardHeader><strong>Contacts</strong></CardHeader>
  }

  loadAvCreateContact = (alertColor,message) =>{
    return (
      <div>
        <Card>
          <CardBody>
           <Alert color={alertColor}>{message}</Alert>
          <center><h5>Create Contact</h5></center><br/>
            <AvForm onSubmit = { this.handleSubmit}>
              <Row>
                <Col><AvField name="firstName" placeholder="First Name" validate={{pattern: {value: '^[A-Za-z_]+$'}}} /></Col>
                <Col><AvField name="lastName" placeholder="Last Name" /></Col>
                </Row>
                <Row>
                <Col><AvField name="organization" placeholder="Organization" validate={{pattern: {value: '^[a-zA-Z0-9_.-]*'}}} required /></Col>
                <Col><AvField name="website" placeholder="Website"  /></Col>
              </Row>
              <Row>
                <Col><AvField name="phone" placeholder="Phone Number" required /></Col>
                <Col><AvField name="email" placeholder="Your Email" type="text" validate={{email: true}} required /></Col></Row>
              <Row>
              <Col>
                <AvField type="select" name="country" placeholder="Country" required >
                  <option value="">Select Country</option>
                  <option value="India">INDIA</option>
                  <option value="UnitedKingdom">UK</option>
                  <option value="Afghanistan">AFGHANISTAN</option>
                  <option value="Australia">AUSTRALIA</option>
                  <option value="France">FRANCE</option>
                  <option value="Germany">GERMANY</option>
                  <option value="Romania">ROMANIA</option>
                </AvField>
              </Col>
              <Col><AvField name="state" placeholder="Your State" /></Col>
              <Col><AvField name="postcode" placeholder="Your Postal Code" errorMessage="Enter Valid Postal Code" validate={{pattern: {value: '^[0-9]{6}'}}}/></Col></Row>
              <Row>
                <Col><AvField name="address1" placeholder="Address 1" /></Col>
                <Col><AvField name="address2" placeholder="Address 2" /></Col>
              </Row>
              
              <Row><Col>{this.loadAvCollapse()}</Col></Row> <br />
              <center><FormGroup row>
                <Col>
                  <Button color="info" > Save </Button> &nbsp; &nbsp;
                  <Button active color="light" type="button" onClick={this.cancelAddContact}>Cancel</Button>
                </Col>
              </FormGroup></center>
            </AvForm>
          </CardBody>
        </Card>
      </div>)
  }
  
  loadAvCollapse = () =>{
    const labelQ = [];
  
    if(this.state.labels.length===0){
      labelQ.push({
        value: null,
        label: "You don't have any lables now.",
      })
   
      return (<div >
        <Select options={labelQ} placeholder="Select the Label" />
     </div>);
    }else{
       this.state.labels.map( (slabel, key)=>{
      if(Array.isArray(slabel.subLabels))
      { this.pushArray(labelQ,slabel);
        slabel.subLabels.map(sul=>{return(this.pushArray(labelQ,sul,slabel))})
      } else{
        this.pushArray(labelQ,slabel);
      }
      return 0;
      
    });
 
    return (<div >
         <Select onChange={this.handleSelect} isMulti options={labelQ} placeholder="Select the Label" styles={colourStyles}/>
      </div>);
    }
  }

  pushArray=(array,label,slabel)=>{
    slabel === undefined ? array.push({
        value: label.id,
        label: label.name,
        color: label.color === null ? "#000000" : label.color,
      }) : array.push({
      value: label.id,
      label: slabel.name+"/" +label.name,
      color: label.color === null ? "#000000" : label.color,
     })
  }
}

export default CreateContact;
