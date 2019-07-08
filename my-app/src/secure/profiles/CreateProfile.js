import React, { Component } from "react";
import { Button, Input, Card, CardBody, CardHeader, Col, Alert, FormGroup, Label } from "reactstrap";
import Store from "../../data/Store";
import { Link } from 'react-router-dom'
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import Config from "../../data/Config";
import ProfileInfoTable from './ProfileInfoTable';

class CreateProfile extends Component {
  state = {
    name: '',
    userToken: '',
    color: '',
    content: '',
    profileCreated: false,
    cancelCreateProfile: false,
    profileType: 0,
    buttonText: "Create Free Profile",
    profileInfoTable: false,
    action: '',
    addBillingRequest: false,
    comparisionText: "View Feature Comparision",
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  profileType = async type => {
    await this.setState({ profileType: type });
    this.buttonText(type);
  }

  buttonText = async (id) => {
    if (id === 0) {
      await this.setState({ buttonText: "Create Free Profile" });
    } else if (id === 1) {
      await this.setState({ buttonText: "Create Basic Profile" });
    } else {
      await this.setState({ buttonText: "Create Premium Profile" });
    }
  }

  cancelCreateProfile = () => {
    this.setState({ cancelCreateProfile: true });
  }

  componentDidMount = async () => {
    await this.setState({ action: Store.getUser().action });
    this.setState({ userToken: Store.getAppUserAccessToken() });
  }
  handleSubmit = e => {
    e.preventDefault();
    const { name, profileType, action } = this.state
    if (action !== 'VERIFY_EMAIL') {
      const data = { name: name, type: profileType };
      new ProfileApi().createProfile(this.successCall, this.errorCall, data);
    } else {
      this.callAlertTimer("danger", "First Please verify with the code sent to your Email.....")
    }
  };
  successCall = () => {
    this.callAlertTimer("success", "New Profile Created!!");
  }
  errorCall = err => {
    if (this.state.profileType) {
      this.callAlertTimer("danger", "You need to purchase credits to create these Profiles, For more info View Feature Comparision.....");
    } else if (Store.getProfile() !== null) {
      this.callAlertTimer("danger", "Sorry, You can't create another Profile.....");
    } else {
      this.callAlertTimer("danger", "Unable to process request, Please Try Again ...");
    }
  };
  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    if (color === "success") {
      setTimeout(() => {
        this.setState({ content: '', color: '', name: '', profileCreated: true });
        window.location.href = "/profiles";
      }, Config.apiTimeoutMillis);
    }
  };

  profileInfoTable = () => {
    let { comparisionText } = this.state
    this.setState({ profileInfoTable: !this.state.profileInfoTable });
    if (comparisionText === "View Feature Comparision") {
      this.setState({ comparisionText: "Hide Feature Comparision" });
    } else {
      this.setState({ comparisionText: "View Feature Comparision" });
    }
  }

  render() {
    const { color, content, profileCreated, cancelCreateProfile, action, profileType, comparisionText, profileInfoTable } = this.state
    return <div>
      {(profileCreated || cancelCreateProfile) ? <Profiles />
        : this.createProfiel(color, content, action, profileType, comparisionText, profileInfoTable)}
    </div>

  }

  // when Profile Creation in process.
  createProfiel = (color, content, action, profileType, comparisionText, profileInfoTable) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>CREATE PROFILE</strong></CardHeader>
          <CardBody>
            <center>
              <h5><b>CHOOSE PROFILE TYPES</b></h5>
              <Col >
                <Alert color={color}>{content}</Alert>
                {action !== "VERIFY_EMAIL" && this.createProfielTypes()}
               
                {this.createProfiel(action, profileType)}<br /><br />
                <h5><span onClick={this.profileInfoTable} className="float-right" style={{ color: '#7E0462' }} ><u>{comparisionText}</u></span></h5>
              </Col>
            </center> <br /><br />
            {profileInfoTable && <ProfileInfoTable />}
          </CardBody>
        </Card>
      </div>);
  }
  createProfielTypes = () => {
    const styles = {paddingLeft: 60}
    return (<>
      <FormGroup check>
        <Label check> <Input type="radio" name="radio1" onChange={() => this.profileType(0)} />{' '} Free  </Label>
        <Label check style={styles}> <Input type="radio" name="radio1" onChange={() => this.profileType(1)} />{' '} Basic </Label>
        <Label check style={styles}> <Input type="radio" name="radio1" onChange={() => this.profileType(2)} />{' '} Premium </Label>
      </FormGroup> <br />
    </>)
  }

  createProfiel = (action, profileType) => {
    const { name, buttonText } = this.state
    if (action === "VERIFY_EMAIL") {
      return <Alert color="warning">Sorry you can not Create Profile unitl verify Your Email</Alert>
    } else if ((action === "ADD_CREDITS" || action === "ADD_BILLING") && profileType > 0) {
      return <>
        <Link to="/billing/address" ><Button color="info" > {action} </Button> </Link>&nbsp;&nbsp;
        <Button active color="light" aria-pressed="true" onClick={this.cancelCreateProfile}>Cancel</Button>
      </>
    } else {
      return this.loadProfile(name, buttonText)
    }
  }

  loadProfile = (name, buttonText) => {
    return (
      <>
        <Col sm="6">
          <Input name="name" value={name} type="text" placeholder="Enter Profile name" autoFocus={true} onChange={e => this.handleInput(e)} />
        </Col><br />
        <Button color="success" disabled={!name} onClick={e => this.handleSubmit(e)} > {buttonText} </Button>&nbsp;&nbsp;
        <Button active color="light" aria-pressed="true" onClick={this.cancelCreateProfile}>Cancel</Button>
      </>)
  }
}
export default CreateProfile;
