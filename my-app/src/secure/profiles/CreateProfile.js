import React, { Component } from "react";
import { Button, Input, Card, CardBody, CardHeader, Col, Alert } from "reactstrap";
import Store from "../../data/Store";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";

class CreateProfile extends Component {
  state = {
    name : "",
    userToken : "",
    color : "",
    content : "",
    profileCreated : false
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAppUserAccessToken() });
  }

  handleSubmit = e => {
    e.preventDefault();
    const data = { name : this.state.name };
    new ProfileApi().createProfile( this.successCall, this.errorCall, data );
  };
  
  successCall = () => {
    this.callAlertTimer("success", "New Profile Created!!");
  }

  errorCall = err => {
    this.callAlertTimer("danger", "You can't Create Second Profile");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      window.location.reload();
      this.setState({ name : "", content : "", color : "", profileCreated: true });
    }, 2000);
  };

  render() {
    const {color,content}=this.state
    return <div>{this.state.profileCreated?<Profiles />:this.loadCreateProfile(color,content)}</div>
  }

  //this Method Call when Profile Creation in process.
  loadCreateProfile = (color,content) =>{
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Profile</strong></CardHeader>
          <CardBody>
            <center>
              <Col >
                <Alert color={color}>{content}</Alert>
                <h5><b>CREATE PROFILE</b></h5>
                <Col sm="6">
                  <Input name="name" value={this.state.name} type="text" placeholder="Enter Profile name" autoFocus={true} onChange={e => this.handleInput(e)}  />
                </Col><br />
                <Button color="info" disabled={!this.state.name} onClick={e => this.handleSubmit(e)} >  Save </Button>
                <a href="/profiles" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a>
              </Col>
            </center>
          </CardBody>
        </Card>
      </div>);
  }
}

export default CreateProfile;