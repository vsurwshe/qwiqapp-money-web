import React, { Component } from "react";
import { Button,Col, Input, Row ,FormGroup, CardHeader, Label, Collapse, Card, CardBody, Alert } from "reactstrap";
import Contacts from "./Contacts";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ContactApi from "../../services/ContactApi";

class UpdateContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: "#000000",
      message: "",
      updateSuccess: false,
      profileId: this.props.profileId,
      collapse: false,
      labels: this.props.lables,
      contactId:  this.props.contact.id,
    };
  }

  handleUpdate = (event, errors, values) => {
    const { profileId, contactId } = this.state
    if (errors.length === 0) {
      var new_Values= {...values, "version": this.props.contact.version}
      if (profileId !== undefined | contactId !== undefined) {
        new ContactApi().updateContact(this.successCall, this.errorCall, new_Values, this.state.profileId, this.state.contactId)
      }
    }
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
    const { updateSuccess,alertColor, message } = this.state;
    return <div>{updateSuccess ? <Contacts /> : this.loadUpdateContact(alertColor,message)}</div>
  }
  loadHeader = () =>  <CardHeader><strong>EDIT CONTACT</strong></CardHeader>

  loadUpdateContact = (alertColor,message) =>{
    return (
     <Card>
        {this.loadHeader()}
        <CardBody>
          <Alert color={alertColor}>{message}</Alert>
        <AvForm onSubmit={this.handleUpdate}>
          <Row>
            <Col><AvField name="firstName" placeholder="Enter First name" value={this.props.contact.firstName} /></Col>
            <Col><AvField name="lastName" placeholder="Enter Last name" value={this.props.contact.lastName} /></Col>
          </Row>
          <Row>
            <Col><AvField name="phone" placeholder="Enter Phone Number" value={this.props.contact.phone} /></Col>
            <Col><AvField name="email" type="text" placeholder="Enter Your Email" validate={{ email: true }}  value={this.props.contact.email} /></Col>
          </Row>
          <Row>
            <Col>
              <AvField type="select" name="country" value={this.props.contact.country} helpMessage="Select Country">
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
            <Col><AvField name="state" placeholder="Enter Your State" value={this.props.contact.state} /></Col>
            <Col><AvField name="postcode" placeholder="Enter Your Postal Code" value={this.props.contact.postcode} /></Col>
          </Row>
          <Row>
             <Col><AvField name="address1" placeholder="Address 1" value={this.props.contact.address1} /></Col>
             <Col><AvField name="address2" placeholder="Address 2" value={this.props.contact.address2} /></Col>
          </Row>
          <FormGroup check className="checkbox" row>
          <Col>
            <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
            <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;labels </Label>
          </Col>
           <Col style={{ paddingTop: 10, paddingBottom: 10 }}>
               {this.loadAvCollapse()}
           </Col>
          </FormGroup>
          <Row>
             <Col><AvField name="organization"  placeholder="Enter Organization Name" value={this.props.contact.organization} /></Col>
             <Col><AvField name="website" placeholder="Enter Your Website" value={this.props.contact.website} /></Col>
          </Row>
        
          <center>     
             <Button color="info" > Update Contact </Button> &nbsp;&nbsp;
             <a href="/contact/viewContacts" style={{textDecoration:'none'}}> <Button active color="light" type="button">Cancel</Button></a>
           </center>
        </AvForm>
      </CardBody>
    </Card >)
 }
 DeleteContact
  loadAvCollapse = () => {
    return (
      <Collapse isOpen={this.state.collapse}>
        <AvField type="select" name="labelIds" label="Option" value={this.props.contact.labelIds} helpMessage="Select Label" multiple>
          {this.state.labels.map((label,key) => {return( <option key={key} value={label.id}>{label.name} </option> )})}
        </AvField>
      </Collapse>);
  }
}

export default UpdateContact;
