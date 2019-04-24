import React, { Component } from "react";
import {Alert,Button,Input,Card,CardHeader,FormGroup,Col,Collapse,Label,FormText} from "reactstrap";
import Lables from './Contact';
import "default-passive-events";
import ContactApi from "../../services/ContactApi";

class CreateContact extends Component {
  constructor(props){
    super(props);
    this.state = {
      profileId: this.props.pid,
      labels: this.props.lables,
      alertColor: "",
      contactCreated: false,
      collapse: false,
      userAddress1: "",
      userAddress2: "",
      userCountry: "",
      userEmail: "",
      labelsIds:[],
      userOrganizations: "",
      userphone: "",
      userPostCode: "",
      userState: "",
      userWebsite: ""
     
    };
  }
 
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  
  handleSubmit =async e => {
    e.preventDefault();
    console.log(this.state.labelsIds)
    const data = {
      address1 : this.state.userAddress1,
      address2 : this.state.userAddress2,
      country  : this.state.userCountry,
      email    : this.state.userEmail,
      labelIds : this.state.labelsIds,
      organization : this.state.userOrganizations,
      phone :this.state.userphone,
      postcode : this.state.userPostCode,
      state   : this.state.userState,
      website : this.state.userWebsite };
      await new ContactApi().createContact(this.successCreate,this.errorCall,this.state.profileId,data);
  };
  
  successCreate=()=>{
     this.callAlertTimer("success", "New Contact Created....");
  }
  
  errorCall = err => { console.log(err); this.callAlertTimer("danger", "No Contact Created");};
  
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "",contactCreated: true });
     }, 2000);
  };
  
  toggle=()=> {
    this.setState({ collapse: !this.state.collapse });
  }
  
  render() {
    const { alertColor, content} = this.state;
    return <div>{this.state.contactCreated?<Lables />:this.loadCreatingLable(alertColor,content)}</div>
    }
  
  loadHeader=()=>{
    return( <CardHeader>
      <strong>Create Contact</strong>
    </CardHeader>)
  }
  
  loadCreatingLable=(alertColor,content)=>{
    return (<div className="animated fadeIn" >
      <Card>
        {this.loadHeader()}
        <Col xs="10" md={{ size: 12}}>
          <br />
          <Alert color={alertColor}>{content}</Alert>
          <h5 className="text-center"><b>CREATE CONTACT</b></h5>
          <FormGroup>
            <FormGroup row>
              <Col>
                <Input type="text" name="userAddress1" placeholder="Address 1" onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Address 1 Line</FormText>
              </Col>
              <Col>
                <Input type="text" name="userAddress2" placeholder="Address 2" onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Address 2 Line</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="email" name="userEmail" placeholder="Enter Email" autoComplete="email" onChange={e => this.handleInput(e)} />
                <FormText className="help-block">Please enter email</FormText>
              </Col>
              <Col>
                <Input type="text" name="userOrganizations" placeholder="Organizations" onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Organizations Name</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="text" name="userState" placeholder="State" onChange={e => this.handleInput(e)}/>
                <FormText color="muted">Please enter State</FormText>
              </Col>
              <Col>
                <Input type="select" name="userCountry" onChange={(event)=>this.setState({userCountry:event.target.value})}>
                  <option value="">Select</option>
                  <option value="India">India</option>
                  <option value="UK">UK</option>
                  <option value="USA">USA</option>
                </Input>
                <FormText color="muted">Please Select Country</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="text" name="userphone" placeholder="Mobile No" onChange={e => this.handleInput(e)}/>
                <FormText color="muted">Please enter Phone / Mobile Number</FormText>
              </Col>
              <Col>
                <Input type="text" name="userPostCode" placeholder="Postal Code" onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Postal Code</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="text" name="userWebsite" placeholder="Website" onChange={e => this.handleInput(e)}/>
                <FormText color="muted">Please enter Website Link</FormText>
              </Col>
            </FormGroup>
            <FormGroup check className="checkbox" row>
              <Col>
                <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
                <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
              </Col>
              <Col style={{ paddingTop: 10, paddingBottom: 10 }}>
                {this.loadCollapse()}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Button color="info" disabled={!this.state.userAddress1} onClick={e => this.handleSubmit(e)} > Save Contact </Button>
                <a href="/contact/manageContact" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
              </Col>
            </FormGroup>
          </FormGroup>
          </Col>
      </Card>
    </div>);
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
  
  loadCollapse=()=>{
    return (<Collapse isOpen={this.state.collapse}>
        <Input type="select" name="selectLg" id="selectLg" onChange={(e)=>this.setState({labelsIds:[].slice.call(e.target.selectedOptions).map(o => {
            return o.value;
        })})} bsSize="lg" multiple>
          {/* <option value="null">Please select Parent Lables</option> */}
          {this.state.labels.map((label,key) => {return(
            <option key={key} value={label.id}>{label.name}
              </option>
              )})}
         </Input>
      </Collapse>);
  }
}

export default CreateContact;
