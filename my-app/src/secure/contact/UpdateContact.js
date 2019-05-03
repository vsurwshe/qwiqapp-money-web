import React, { Component } from "react";
import { Button,Col, Input, Row ,FormGroup, CardHeader, Label, Collapse, Card, CardBody } from "reactstrap";
import Contacts from "./Contacts";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ContactApi from "../../services/ContactApi";

class UpdateLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: "#000000",
      content: "",
      updateSuccess: false,
      profileId: this.props.profileId,
      collapse: false,
      labels: this.props.lables,
      contactId:  this.props.contact.id,
      firstName: this.props.contact.firstName,
      lastName: this.props.contact.lastName,
      userAddress1: this.props.contact.address1,
      userAddress2: this.props.contact.address2,
      userCountry: this.props.contact.country,
      userEmail: this.props.contact.email,
      labelsIds: this.props.contact.labeslIds,
      userOrganizations: this.props.contact.organization,
      userphone: this.props.contact.phone,
      userPostCode: this.props.contact.postalcode,
      userState: this.props.contact.state,
      userWebsite: this.props.contact.website
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

  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content});
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
    const { updateSuccess } = this.state;
    return <div>{updateSuccess ? <Contacts /> : this.loadUpdateContact()}</div>
  }
  loadHeader = () =>  <CardHeader><strong>EDIT CONTACT</strong></CardHeader>

  loadUpdateContact = () =>{
    return (
     <Card>
        {this.loadHeader()}
        <CardBody>
        <AvForm onSubmit={this.handleUpdate}>
          <Row>
            <Col><AvField name="firstName" placeholder={this.props.contact.firstName} value={this.props.contact.firstName} /></Col>
            <Col><AvField name="lastName" placeholder={this.props.contact.lastName} value={this.props.contact.lastName} /></Col>
          </Row>
          <Row>
            <Col><AvField name="phone" placeholder={this.props.contact.phone} value={this.props.contact.phone} /></Col>
            <Col><AvField name="email" type="text" validate={{ email: true }} placeholder={this.props.contact.email} value={this.props.contact.email} /></Col>
          </Row>
          <Row>
            <Col>
              <AvField type="select" name="country" value={this.props.contact.country} helpMessage="List of countries we supported!">
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
            <Col><AvField name="state" placeholder={this.props.contact.state} value={this.props.contact.state} /></Col>
            <Col><AvField name="postcode" placeholder={this.props.contact.postcode} value={this.props.contact.postcode} /></Col>
          </Row>
          <Row>
             <Col><AvField name="address1" placeholder={this.props.contact.address1} value={this.props.contact.address1} /></Col>
             <Col><AvField name="address2" placeholder={this.props.contact.address2} value={this.props.contact.address2} /></Col>
          </Row>
          <Row>
             <Col><AvField name="organization"  placeholder={this.props.contact.organization} value={this.props.contact.organization} /></Col>
             <Col><AvField name="website" placeholder={this.props.contact.website} value={this.props.contact.website} /></Col>
          </Row>
          <FormGroup check className="checkbox" row>
            <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
            <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
            {this.loadAvCollapse()}
          </FormGroup>
          <center>     
             <Button color="info" > Save Contact </Button> &nbsp;&nbsp;
             <a href="/contact/viewContacts"> <Button active color="light" type="button">Cancel</Button></a>
           </center>
        </AvForm>
      </CardBody>
    </Card >)
 }

  loadAvCollapse = () => {
    return (
      <Collapse isOpen={this.state.collapse}>
        <AvField type="select" name="labelIds" label="Option" value={this.props.contact.labelIds} helpMessage="MULTIPLE!" multiple>
          {this.state.labels.map((label,key) => {return( <option key={key} value={label.id}>{label.name} </option> )})}
        </AvField>
      </Collapse>);
  }
}

export default UpdateLabel;
