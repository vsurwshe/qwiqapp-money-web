import React, { Component } from "react";
import { Button,Col, Input, Alert ,FormGroup,Card,CardHeader,Label,Collapse,FormText} from "reactstrap";
import Contacts from "./Contact";
import ContactApi from "../../services/ContactApi";

class UpdateLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: "#000000",
      content: "",
      updateSuccess: false,
      profileId: this.props.pid,
      collapse: false,
      labels: this.props.lables,
      id:  this.props.contact.id,
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

  handleUpdate = () => {
    const data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address1 : this.state.userAddress1,
      address2 : this.state.userAddress2,
      country  : this.state.userCountry,
      email    : this.state.userEmail,
      labelIds : this.state.labelsIds,
      organization : this.state.userOrganizations,
      phone :this.state.userphone,
      postcode : this.state.userPostCode,
      state   : this.state.userState,
      website : this.state.userWebsite,
      version : this.props.contact.version
    };
      new ContactApi().updateContact(this.SuccessCall, this.errorCall, data,this.state.profileId, this.state.id )
  };
  
  SuccessCall = json => {
     this.callAlertTimer( "success", "Contact Updated Successfully... ");
  };
 
  errorCall = err => {
    this.callAlertTimer( "danger", "Something went wrong, Please Try Again... ");
  };

  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content});
    setTimeout(() => {this.setState({ name: '', alertColor: '',updateSuccess: true });
    }, 2000);
  };

  changeParentId=()=>{
    this.setState({parentId:""});
  }


  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggle=()=> {
    this.setState({ collapse: !this.state.collapse });
   
  }

  render() {
    const {alertColor, content, updateSuccess} = this.state;
    return <div>{updateSuccess ?<Contacts />:this.loadUpdatingLable(alertColor,content)}</div>
  }

  loadHeader=()=>{
    return(
      <CardHeader>
      <strong>Edit Contact</strong>
    </CardHeader>
    )
 }

 loadUpdatingLable=(alertColor,content)=>{
     return( 
       <div className="animated fadeIn" >
         <Card>
            {this.loadHeader()}
           <Col sm="12" md={{ size: 10}}>
           <br/>
             <Alert color={alertColor}>{content}</Alert>
             <h5 className="text-center"><b>EDIT CONTACT</b></h5>
             <FormGroup>
             <FormGroup row>
              <Col>
                <Input type="text" value={this.state.firstName} name="firstName" placeholder="First_Name" onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Address 1 Line</FormText>
              </Col>
              <Col>
                <Input type="text" name="lastName" placeholder="Last_Name" value={this.state.lastName} onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Address 2 Line</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="text" value={this.state.userAddress1} name="userAddress1" placeholder="Address 1" onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Address 1 Line</FormText>
              </Col>
              <Col>
                <Input type="text" name="userAddress2" placeholder="Address 2" value={this.state.userAddress2} onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Address 2 Line</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="email" name="userEmail" placeholder="Enter Email" value={this.state.userEmail} autoComplete="email" onChange={e => this.handleInput(e)} />
                <FormText className="help-block">Please enter email</FormText>
              </Col>
              <Col>
                <Input type="text" name="userOrganizations" placeholder="Organizations" value={this.state.userOrganizations} onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Organizations Name</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="text" name="userState" placeholder="State" value={this.state.userState} onChange={e => this.handleInput(e)}/>
                <FormText color="muted">Please enter State</FormText>
              </Col>
              <Col>
                <Input type="select" name="userCountry" value={this.state.userCountry} onChange={(event)=>this.setState({userCountry:event.target.value})}>
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
                <Input type="text" name="userphone" placeholder="Mobile No" value={this.state.userphone} onChange={e => this.handleInput(e)}/>
                <FormText color="muted">Please enter Phone / Mobile Number</FormText>
              </Col>
              <Col>
                <Input type="text" name="userPostCode" placeholder="Postal Code" value={this.state.userPostCode} onChange={e => this.handleInput(e)} />
                <FormText color="muted">Please enter Postal Code</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Input type="text" name="userWebsite" placeholder="Website" value={this.state.userWebsite} onChange={e => this.handleInput(e)}/>
                <FormText color="muted">Please enter Website Link</FormText>
              </Col>
            </FormGroup>
            <FormGroup check className="checkbox" row>
              <Col>
                <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
                <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest Contact under </Label>
              </Col>
              <Col style={{ paddingTop: 10, paddingBottom: 10 }}>
                {this.loadCollapse()}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Button color="info" disabled={!this.state.firstName} onClick={e => this.handleUpdate(e)} > Update Contact </Button>
                <a href="/contact/manageContact" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
              </Col>
            </FormGroup>
          </FormGroup>
          </Col>
         </Card>
       </div>)
  }
 
   loadCollapse=()=>{
    return (<Collapse isOpen={this.state.collapse}>
        <Input type="select" name="selectLg" id="selectLg" onChange={(e)=>this.setState({labelsIds:[].slice.call(e.target.selectedOptions).map(o => {
            return o.value;
        })})} bsSize="lg" multiple>
          {/* <option value="null">Please select Parent Lables</option> */}
          {this.state.labels.map((labels) => {return( this.state.id===labels.id ? '': <option key={labels.id} value={labels.id}>{labels.name}</option>)})}
         </Input>
      </Collapse>);
  }


}

export default UpdateLabel;
