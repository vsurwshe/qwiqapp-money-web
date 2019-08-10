import React, { Component } from "react";
import { Button, Input, Card, CardBody, CardHeader, Col, Alert, Table } from "reactstrap";
import Store from "../../data/Store";
import { Link } from 'react-router-dom'
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import Config from "../../data/Config";
import ProfileInfoTable from './ProfileInfoTable';
import ProfileTypesApi from "../../services/ProfileTypesApi";

class CreateProfile extends Component {
  state = {
    name: '',
    color: '',
    content: '',
    profileCreated: false,
    cancelCreateProfile: false,
    profileType: 0,
    buttonText: "Create Free Profile",
    profileInfoTable: false,
    action: '',
    comparisionText: "View Feature Comparision",
    profileTypes: [],
  };

  componentDidMount = () => {
    this.setState({ action: Store.getUser().action });
    new ProfileTypesApi().getProfileTypes((profileTypes) => { this.setState({ profileTypes }) }, (error) => { console.log("error", error); })
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  selectProfileType = async profileType => {
    await this.setState({ profileType });
    this.profielTypeButtonText(profileType);
  }

  profielTypeButtonText = async (profileType) => {
    let buttonText = "Create Free Profile";
    const { profileTypes } = this.state
    if (profileTypes.length !== 0) {
      buttonText = await profileTypes.filter(profile => profile.type === profileType);
    }
    this.setState({ buttonText: "Create " + buttonText[0].name + " Profile" })
  }

  cancelCreateProfile = () => {
    this.setState({ cancelCreateProfile: true });
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

  profileViewTable = () => {
    let { comparisionText } = this.state
    this.setState({ profileInfoTable: !this.state.profileInfoTable });
    if (comparisionText === "View Feature Comparision") {
      this.setState({ comparisionText: "Hide Feature Comparision" });
    } else {
      this.setState({ comparisionText: "View Feature Comparision" });
    }
  }

  render() {
    const { color, profileCreated, cancelCreateProfile, action, profileType, profileInfoTable, profileTypes } = this.state
    const profileTypesOptions = profileTypes.map(proTypes => {
      return (<tr key={proTypes.type}>
        <td> <Input type="radio" name="radio1" value={proTypes.type} checked={proTypes.type === profileType}
          onChange={() => this.selectProfileType(proTypes.type)} />{' '}</td>
        <td>{proTypes.name}</td>
        <td>{proTypes.cost}</td>
        <td>{proTypes.description}</td>
      </tr>)
    })
    return <div>
      {(profileCreated || cancelCreateProfile) ? <Profiles /> : this.createProfile(color, action, profileType, profileInfoTable, profileTypesOptions)}
    </div>
  }

  // when Profile Creation in process.
  createProfile = (color, action, profileType, profileInfoTable, profileTypesOptions) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>CREATE PROFILE</strong></CardHeader>
          <CardBody>
            <center>
              <h5><b>CHOOSE PROFILE TYPES</b></h5>
              <Col >
                <Alert color={color}>{this.state.content}</Alert>
                {action !== "VERIFY_EMAIL" && this.createProfileTypes(profileTypesOptions)}
                {this.loadActionsButton(action, profileType)}<br /><br />
                <h5><span onClick={this.profileViewTable} className="float-right" style={{ color: '#7E0462' }} ><u>{this.state.comparisionText}</u></span></h5>
              </Col>
            </center> <br /><br />
            {profileInfoTable && <ProfileInfoTable />}
          </CardBody>
        </Card>
      </div>);
  }

  createProfileTypes = (profileTypesOptions) => {
    return (
      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Profile Type</th>
            <th>Cost</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {profileTypesOptions}
        </tbody>
      </Table>
    )
  }

  loadActionsButton = (action, profileType) => {
    let url = action === 'ADD_BILLING' ? "/billing/address" : '/billing/paymentHistory';
    if (action === "VERIFY_EMAIL") {
      return <Alert color="warning">Sorry you cannot Create Profile until you verify Your Email</Alert>
    } else if (profileType !== 0 && profileType !== 3 && action ) {
      return <>
        <Button color="info"><Link to={url} style={{ color: "black" }}> {action}</Link></Button>
        <Button active color="danger" style={{ marginLeft: 20 }} aria-pressed="true" onClick={this.cancelCreateProfile}>Cancel</Button>
      </>
    } else {
      return this.loadProfile()
    }
  }

  loadProfile = () => {
    const { name, buttonText } = this.state
    return (
      <>
        <Col sm="6">
          <Input name="name" value={name} type="text" placeholder="Enter Profile name" autoFocus={true} onChange={e => this.handleInput(e)} />
        </Col><br />
        <Button color="success" disabled={!name} onClick={e => this.handleSubmit(e)} > {buttonText} </Button>
        <Button active color="light" style={{ marginLeft: 20 }} aria-pressed="true" onClick={this.cancelCreateProfile}>Cancel</Button>
      </>)
  }
}
export default CreateProfile;
