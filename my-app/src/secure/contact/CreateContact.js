import React, { Component } from "react";
import {CardBody,Button,Input,Card,CardHeader,FormGroup,Col,Collapse,Label} from "reactstrap";
import { AvForm, AvField} from 'availity-reactstrap-validation';
import Contacts from './Contact';
import "default-passive-events";
import ContactApi from "../../services/ContactApi";

class CreateContact extends Component {
  constructor(props){
    super(props);
    this.state = {
      profileId: this.props.pid,
      labels: this.props.lables,
     
      contactCreated: false,
      failContactCreate: false,
      collapse: false,
      // alertColor: "",
      // firstName: "",
      // lastName: "",
      // userAddress1: "",
      // userAddress2: "",
      // userCountry: "",
      // userEmail: "",
      // labelsIds:[],
      // userOrganizations: "",
      // userphone: "",
      // userPostCode: "",
      // userState: "",
      // userWebsite: "",
      // errors: [],
      // values:[]
    };
  }
 
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  
  handleSubmit =async (event, errors, values) => {
    // event.preventDefault();
    event.persist();
    if (errors.length===0) {
      console.log(values);
      await new ContactApi().createContact(this.successCreate,this.errorCall,this.state.profileId,values);
    } 
  }
  
  successCreate=(response)=>{
    // console.log(response)
    this.setState({ contactCreated: true });
  }
  
  errorCall = err => { 
    console.log(err);
    this.setState({ failContactCreate: true })};
  
  toggle=()=> {
    this.setState({ collapse: !this.state.collapse });
  }
  render() {
    return <div>{this.state.contactCreated?<Contacts />:(this.state.failContactCreate ? this.loadFailCreateContact() : this.loadAvCreateLable())}</div>
    }
  
  loadHeader=()=>{
    return( <CardHeader>
      <strong>Create Contact</strong>
    </CardHeader>)
  }
  loadFailCreateContact = () =>{
    return <Card>
      {this.loadHeader()}
      <br />
      <CardBody>
        <center>
          <p>Somthing went wrong in creation </p>
        <a href="/contact/manageContact"><Button color="info">Goto Contacts</Button></a>
        </center>
        </CardBody>
    </Card>
  }
  loadAvCreateLable = ()=>{
    return (<div>
      <AvForm onSubmit = { this.handleSubmit}>
        <AvField name="firstName" label="First_Name" required />
        <AvField name="lastName" label="Last_Name" required />
        <AvField name="phone" label="Phone_Number" required />
        <AvField name="email" label="Email (proper email )" type="text" validate={{email: true}} required />
        <AvField type="select" name="country" label="Country" helpMessage="Idk, this is an example. Deal with it!">
          <option value="">select</option>
          <option value="India">INDIA</option>
          <option value="UnitedKingdom">UK</option>
          <option value="Afghanistan">AFGHANISTAN</option>
          {/* <option value="United States">ENGLAND</option> */}
          <option value="Australia">AUSTRALIA</option>
          <option value="Russia">RUSSIA</option>
          <option value="France">FRANCE</option>
          <option value="Germany">GERMANY</option>
          <option value="Romania">ROMANIA</option>
          
        </AvField>
        <AvField name="state" label="State" />
        <AvField name="address1" label="Address 1" />
        <AvField name="address2" label="Address 2" />
        <FormGroup check className="checkbox" row>
          <Col>
            <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
            <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
          </Col>
          <Col style={{ paddingTop: 10, paddingBottom: 10 }}>
            {this.loadAvCollapse()}
          </Col>
        </FormGroup>
        <AvField name="organization" label="Organization"  />
        <AvField name="postcode" label="Post_Code" />
        <AvField name="website" label="Website" />
        <center><FormGroup row>
          <Col>
            {/* <Button>submit</Button> */}
            <Button color="info" > Save Contact </Button>
            <a href="/contact/manageContact" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
          </Col>
        </FormGroup></center>
      </AvForm>
      </div>
    )
  }
  
  loadCreatedMessage=()=>{
    return (<div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Label</strong>
        </CardHeader>
        <center style={{ paddingTop: '20px' }}>
          <h5><b>Label Created Successfully !!</b> <br /> <br />
            <b><a href="/label/labels">View Lables</a></b></h5>
        </center>
      </Card>
    </div>)
  }
  loadAvCollapse=()=>{
    return (<Collapse isOpen={this.state.collapse}>
    <AvField type="select" name="labelIds" label="Option" helpMessage="MULTIPLE!" multiple>
      {this.state.labels.map((label,key) => {return(
              <option key={key} value={label.id}>{label.name} </option> )})}
      </AvField>
      </Collapse>);
  }
  
  
}

export default CreateContact;
