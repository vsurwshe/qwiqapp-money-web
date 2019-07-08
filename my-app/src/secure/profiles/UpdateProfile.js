import React, { Component } from "react";
import { Link } from 'react-router-dom'

import { Button, Card, Col, Input, Alert, CardHeader, FormGroup } from "reactstrap";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import Config from "../../data/Config";
import Store from "../../data/Store";

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      color: "",
      content: "",
      updateSuccess: false,
      cancelUpdateProfile: false,
    };
  }
  handleUpdate = () => {
    let data = { name: this.state.name };
    new ProfileApi().updateProfile(this.successCall, this.errorCall, data, this.state.id);
  };

  successCall = () => {
    let storeProfile;
    if(this.state.id === Store.getProfile().id){
      storeProfile = Store.getUserProfiles().filter(profile => profile.id === this.state.id)
      Store.saveProfile(storeProfile[0])
    }
    this.callAlertTimer("success", "Profile Updated Succesfully!");
  }

  errorCall = err => {
    this.callAlertTimer("danger", "Unable to Process Request, Please Try Again!! ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {
      this.setState({ name: '', color: '', updateSuccess: true });
      window.location.href = "/profiles";
      
    }, Config.notificationMillis);
  };

  cancelUpdateProfile = () => {
    this.setState({ cancelUpdateProfile: true });
  }
  
  render() {
    const { name, color, content, updateSuccess, cancelUpdateProfile } = this.state;
      return <div>{(updateSuccess || cancelUpdateProfile) ? <Profiles /> : this.loadUpdateProfile(name, color, content)}</div>

  }
  loadHeader = () => <CardHeader><strong>Profile</strong></CardHeader>

  // when updating profile
  loadUpdateProfile = (name, color, content) => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center>
            <Alert color={color}>{content}</Alert>
            <FormGroup>
              <h5><b>EDIT PROFILE</b></h5>
              <Col sm="6">
                <Input type="text" name="profile name" value={name} style={{ fontWeight: 'bold', color: '#000000' }} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }} />
              </Col>
              <br />
              <Button color="success" disabled={!name} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
              <Button active color="light" aria-pressed="true" onClick={this.cancelUpdateProfile}>Cancel</Button>
            </FormGroup>
          </center>
        </Card>
      </div>)
  }
}

export default UpdateProfile;
