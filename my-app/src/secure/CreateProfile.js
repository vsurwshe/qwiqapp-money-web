import React, { Component } from "react";
import { Alert, Button, Input, Card, CardBody, CardHeader,FormGroup,Col } from "reactstrap";
import Store from "../data/Store";
import ProfileApi from "../services/ProfileApi";
class CreateProfiles extends Component {
  state = {
    name: "",
    userToken: "",
    color: "",
    content: "",
    profileCreated: false
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAccessToken() });
  }

  handleSubmit = e => {
    e.preventDefault();
    const data = { name: this.state.name };
    new ProfileApi().createProfile(
      () => {
        this.setState({ profileCreated: true });
        this.callAlertTimer("success", "New Profile Created!!");
      },
      this.errorCall,
      data
    );
  };

  errorCall = err => {
    this.callAlertTimer("danger", err);
  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      this.setState({ name: "", content: "", color: "" });
    }, 3500);
  };

  render() {
    if (!this.state.profileCreated) {
      return <div>{this.loadCreatingProfile()}</div>
    } else {
      return <div>{this.loadCreatedMessage()}</div>
    }
  }

  //this Method Call when Profile Creation in porceess.
  loadCreatingProfile=()=>{
    return(
      <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <strong>Profile</strong>
            </CardHeader>
            <Alert color={this.state.color}>{this.state.content}</Alert>
            <CardBody>
              <center>
              <FormGroup>
                <h5><b>CREATE PROFILE</b></h5>
                 <Col sm="6">
                 <Input name="name" value={this.state.name} type="text" placeholder="Enter Profile name" autoFocus={true} onChange={e => this.handleInput(e)} />
                </Col>
                <br />
                <Button color="info" disabled={!this.state.name} onClick={e => this.handleSubmit(e)} >  Save </Button>
                <a href="/profiles" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancle</Button></a>
                </FormGroup>
              </center>
            </CardBody>
          </Card>
        </div>
    );
  }

  //this method call after Creations Of Profile Successfully.
  loadCreatedMessage=()=>{
    return(
      <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <strong>Profile</strong>
            </CardHeader>
          <center>
            <h5><b>Profile Created Successfully !!</b> <br /> <br />
              <b><a href="/profiles">View Profile</a></b></h5>
          </center>
        </Card>
        </div>
    )
  }
}

export default CreateProfiles;
