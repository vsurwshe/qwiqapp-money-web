import React, { Component } from "react";
import { CardBody, Button, Input, Card, Row, CardHeader, FormGroup, Col, Collapse,Alert, Label} from "reactstrap";
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
      collapse: false,
      alertColor:'',
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
    this.callAlertTimer("success","Contact Created Successfully !" );
  }
  
  errorCall = (err) => { 
    this.callAlertTimer("danger","Unable to Process the request, Please Try Again" );
    this.setState({ failContactCreate : true, alertColor:"danger", message : "" })};
  
  toggle = () => {
    this.setState({ collapse : !this.state.collapse });
  }
 
  callAlertTimer = (alertColor, message) => {
    this.setState({ alertColor, message });
    setTimeout(() => {
      this.setState({ contactCreated: true});
    }, 2000);
  };

  render() {
    const { contactCreated, alertColor, message } = this.state;
    return <div>{contactCreated?<Contacts />:this.loadAvCreateLable(alertColor,message)}</div>
    }
  
  loadHeader = () =>{
    return <CardHeader><strong>Contacts</strong></CardHeader>
  }

  loadAvCreateLable = (alertColor,message) =>{
    return (
      <div>
        <Card>
          {/* {this.loadHeader()}  */}
          <CardBody>
            {console.log("ALert Color = ", alertColor)}
          <Alert color={alertColor}>{message}</Alert>
          <center><h5>Create Contact</h5></center><br/>
            <AvForm onSubmit = { this.handleSubmit}>
              <Row>
                <Col><AvField name="firstName" placeholder="Enter First Name" validate={{pattern: {value: '^[A-Za-z]+$'}}} required /></Col>
                <Col><AvField name="lastName" placeholder="Enter Last Name" required /></Col></Row>
              <Row>
                <Col><AvField name="phone" placeholder="Enter Phone Number" required /></Col>
                <Col><AvField name="email" placeholder="Enter Your Email" type="text" validate={{email: true}} required /></Col></Row>
              <Row>
              <Col>
                <AvField type="select" name="country" placeholder="Country" helpMessage="Select Country">
                  <option value="">Select</option>
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
              <Col><AvField name="state" placeholder="Enter Your State" /></Col>
              <Col><AvField name="postcode" placeholder="Enter Your Postal Code" errorMessage="Enter Valid Postal Code" validate={{pattern: {value: '^[0-9]+$'}}}/></Col></Row>
              <Row>
                <Col><AvField name="address1" placeholder="Address 1" /></Col>
                <Col><AvField name="address2" placeholder="Address 2" /></Col>
              </Row>
              <FormGroup check className="checkbox" row>
                <Col>
                  <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
                  <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp; Labels </Label>
                </Col>
                <Col style={{ paddingTop: 10, paddingBottom: 10 }}>
                  {this.loadAvCollapse()}
                </Col>
              </FormGroup>
              <Row>
                <Col><AvField name="organization" placeholder="Enter Your Organization"  /></Col>
                <Col><AvField name="website" placeholder="Enter Your Website" /></Col>
              </Row>
              <center><FormGroup row>
                <Col>
                  <Button color="info" > Save Contact </Button>
                  <a href="/contact/viewContacts" style={{textDecoration:'none'}}> <Button active color="light" type="button">Cancel</Button></a>
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
        <AvField type="select" name="labelIds" label="Option" helpMessage="Select Label" multiple>
          {this.state.labels.map((label,key) => {return(
              <option key={key} value={label.id}>{label.name} </option> )})}
        </AvField>
      </Collapse>);
  }
}

export default CreateContact;
