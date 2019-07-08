import React, { Component } from "react";
import { Button, Input, Card, CardBody, CardHeader, Col, Alert } from "reactstrap";
import Store from "../../data/Store";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import Config from "../../data/Config";

class CreateProfile extends Component {
  state = {
    name: "",
    userToken: "",
    color: "",
    content: "",
    profileCreated: false,
    cancelCreateProfile: false,
    userAction: ''
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  cancelCreateProfile = () => {
    this.setState({ cancelCreateProfile: true });
  }

  componentDidMount() {
    this.setState({ userToken: Store.getAppUserAccessToken(), userAction: Store.getUser().action });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { name, profileType, userAction } = this.state
    if (userAction !== 'VERIFY_EMAIL') {
      const data = { name: name, type: profileType };
      new ProfileApi().createProfile(this.successCall, this.errorCall, data);
    } else {
      this.callAlertTimer("danger", "Please verify with the code sent to your Email.....");
    }
  };

  successCall = () => {
    this.callAlertTimer("success", "New Profile Created!!");
  }

  errorCall = err => {
    if (Store.getProfile() !== null) {
      this.callAlertTimer("danger", "Sorry, You can't create another Profile.....");
    } else {
      this.callAlertTimer("danger", "Sorry ! Unable to process request, Please try Again ...");
    }

  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    if (color === "success") {
      setTimeout(() => {
        this.setState({ content: "", color: "", name: "", profileCreated: true });
        window.location.href = "/profiles";
      }, Config.notificationMillis);
    }
  };

  render() {
    const { color, content, cancelCreateProfile } = this.state
    if (cancelCreateProfile) {
      return <Profiles />
    } else {
      return <div>{this.state.profileCreated ? <Profiles /> : this.loadCreateProfile(color, content)}</div>
    }
  }

  // when Profile Creation in process.
  loadCreateProfile = (color, content) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Profile</strong></CardHeader>
          <CardBody>
            <center>
              <Col >
                <Alert color={color}>{content}</Alert>
                <h5><b>CREATE PROFILE</b></h5>
                <Col sm="6">
                  <Input name="name" value={this.state.name} type="text" placeholder="Enter Profile name" autoFocus={true} onChange={e => this.handleInput(e)} />
                </Col><br />
                <Button color="info" disabled={!this.state.name} onClick={e => this.handleSubmit(e)} >Save </Button>&nbsp;&nbsp;
                <Button active color="light" aria-pressed="true" onClick={this.cancelCreateProfile}>Cancel</Button>
              </Col>
            </center>
          </CardBody>
        </Card>
      </div>);
  }
}

export default CreateProfile;
