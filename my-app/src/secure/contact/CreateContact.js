import React, { Component } from "react";
import { CardBody, Button, Input, Card, Row, CardHeader, FormGroup, Col, Collapse, Label} from "reactstrap";
import { Link, NavLink } from 'react-router-dom';
import { AvForm, AvField} from 'availity-reactstrap-validation';
import Contacts from './Contacts';
import "default-passive-events";
import ContactApi from "../../services/ContactApi";

class CreateContact extends Component {
  constructor(props){
    super(props);
    this.state = {
      profileId: props.profileId,
      labels: props.lables,
      contactCreated: false,
      failContactCreate: false,
      collapse: false,
      message:''
    };
  }
 
  handleInput = e => {
    this.setState({ [e.target.name] : e.target.value });
  };
  
  handleSubmit = async (event, errors, values) => {
    event.persist();
    if (errors.length===0) {
      console.log(values);
      await new ContactApi().createContact(this.successCall, this.errorCall, this.state.profileId, values);
    } 
  }
  
  successCall = (response) =>{
    this.setState({ contactCreated : true });
  }
  
  errorCall = (err) => { 
    console.log(err);
    this.setState({ failContactCreate : true, message : err[0] })};
  
  toggle = () => {
    this.setState({ collapse : !this.state.collapse });
  }
  render() {
    return <div>{this.state.contactCreated?<Contacts />:(this.state.failContactCreate ? this.loadFailCreateContact() : this.loadAvCreateLable())}</div>
    }
  
  loadHeader = () =>{
    return <CardHeader><strong>Contacts</strong></CardHeader>
  }

  loadFailCreateContact = () =>{
    return <Card>
      {this.loadHeader()}<br />
      <CardBody>
        <center>
          <p>Error : {this.state.message}</p>
          <a href="/contact/viewContacts"><Button color="info">Goto Contacts</Button></a>
        </center>
      </CardBody>
    </Card>
  }

  loadAvCreateLable = () =>{
    return (
      <div>
        <Card>
          {this.loadHeader()} 
          <CardBody>
            <AvForm onSubmit = { this.handleSubmit}>
              <Row>
                <Col><AvField name="firstName" label="First_Name" validate={{pattern: {value: '^[A-Za-z]+$'}}} required /></Col>
                <Col><AvField name="lastName" label="Last_Name" required /></Col></Row>
              <Row>
                <Col><AvField name="phone" label="Phone_Number" required /></Col>
                <Col><AvField name="email" label="Email (proper email )" type="text" validate={{email: true}} required /></Col></Row>
              <Row>
              <Col>
                <AvField type="select" name="country" label="Country" helpMessage="Idk, this is an example. Deal with it!">
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
              <Col><AvField name="state" label="State" /></Col>
              <Col><AvField name="postcode" label="Post_Code" validate={{pattern: {value: '^[0-9]+$'}}}/></Col></Row>
              <Row>
                <Col><AvField name="address1" label="Address 1" /></Col>
                <Col><AvField name="address2" label="Address 2" /></Col>
              </Row>
              <FormGroup check className="checkbox" row>
                <Col>
                  <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
                  <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
                </Col>
                <Col style={{ paddingTop: 10, paddingBottom: 10 }}>
                  {this.loadAvCollapse()}
                </Col>
              </FormGroup>
              <Row>
                <Col><AvField name="organization" label="Organization"  /></Col>
                <Col><AvField name="website" label="Website" /></Col>
              </Row>
              <center><FormGroup row>
                <Col>
                  <Button color="info" > Save Contact </Button>
                  <a href="/contact/viewContacts"> <Button active color="light" type="button">Cancel</Button></a>
                </Col>
              </FormGroup></center>
            </AvForm>
          </CardBody>
        </Card>
      </div>)
  }
  
  loadCreatedMessage = () =>{
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Label</strong></CardHeader>
          <center style={{ paddingTop: '20px' }}>
            <h5><b>Label Created Successfully !!</b> <br /> <br /><b><a href="/label/labels">View Lables</a></b></h5>
          </center>
        </Card>
      </div>)
  }

  loadAvCollapse = () =>{
    return (
      <Collapse isOpen={this.state.collapse}>
        <AvField type="select" name="labelIds" label="Option" helpMessage="MULTIPLE!" multiple>
          {this.state.labels.map((label,key) => {return(
              <option key={key} value={label.id}>{label.name} </option> )})}
        </AvField>
      </Collapse>);
  }
}

export default CreateContact;
