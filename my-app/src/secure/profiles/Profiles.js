import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import { Redirect } from 'react-router';
import ProfileApi from "../../services/ProfileApi";
import { DeleteModel } from "../utility/DeleteModel";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { Container, Button, Card, CardBody, Table, CardHeader, Alert } from "reactstrap";
import ProfileForm from './ProfileForm';
import Config from '../../data/Config';
import Store from '../../data/Store';
import { userAction } from '../../data/GlobalKeys';
import { UpgradeProfileType } from "./UpgradeProfileType";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";
/**
 * Display list of profiles,Manage profile like (update, delete)
 * Call Add,Update, delete Componets.
 * TODO: handle Error Message
 */
class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: []
    };
  }

  async componentDidMount() {
    new ProfileApi().getProfiles(this.successCall, this.errorCall);
  }

  componentDidUpdate() {
    // solved Reload issues
    if (this.state.profileUpgraded) {
      new ProfileApi().getProfiles(this.successCall, this.errorCall, true);
      this.setState({ profileUpgraded: false });
    }
  }

  successCall = async profiles => {
    let profilesById = [];
    if (!profiles.length) {
      this.setState({ profiles: [], spinner: true })
    } else {
      await profiles.map(profile => {
        // to get dynamic dropdowns for Profile Upgrade
        // dropdown is based on "profile.upgradeTypes"
        new ProfileApi().getProfileById(async (profileById) => {
          profilesById.push(profileById);
          await this.setState({ profiles: profilesById })
        }, this.errorCall, profile.id);
        return 0;
      });
    }
  };

  errorCall = error => { 
    this.setState({ visible: true }); 
    if (error && error.response) {
      this.callAlertTimer("danger", "Unable to process your request", true);
    } else {
      this.callAlertTimer("danger", "please check with your network");
    }
  }

  updateProfile = (profileId, profileName) => {
    this.setState({ profileId, profileName, updateProfile: true, })
  };

  handleConfirmUpgrade = () => {
    this.setState({ userConfirmUpgrade: !this.state.userConfirmUpgrade });
  }

  handleUserConfirm = (profileId, profileType) => {
    this.handleConfirmUpgrade()
    this.setState({ profileId, profileType, alertColor: undefined, alertMessage: undefined })
  }

  handleUpgradeProfile = () => {
    this.handleConfirmUpgrade();
    // After login, userAction getting undefined through ComponetDidMount, to resolve this issue, it is placed here.
    const action = Store.getUser() ? Store.getUser().action : true; // This is user action(actually from store(API response))
    if (action) {
      switch (action) {
        case userAction.ADD_BILLING: // This is Global variable(declared in GlobalKeys.js), to compare 'action' of user
          this.callAlertTimer("danger", "Add your billing address", true);
          break;
        case userAction.ADD_CREDITS:
          this.callAlertTimer("danger", "Add credits", true);
          break;
        default: this.callAlertTimer("danger", "Your credits are low, please add more credits", true);
          break;
      }
    } else {
      new ProfileApi().upgradeProfile(this.upgradeSuccessCall, this.upgradeErrorCall, this.state.profileId, this.state.profileType);
    }
  }

  upgradeSuccessCall = (profiles) => {
    this.setState({ profileUpgraded: true });
    this.callAlertTimer("success", "Your profile upgraded successfully", true);
  }

  upgradeErrorCall = (error) => {
    const response = error && error.response ? error.response : '';
    if (response && response.status === 400 && !response.data) {
      this.callAlertTimer("danger", "Your credits are low, please add more credits", true);
    } else {
      this.callAlertTimer("danger", "Unable to process your request", true);
    }
  }

  callAlertTimer = (alertColor, alertMessage, emptyMessages) => {
    this.setState({ alertColor, alertMessage });
    if (emptyMessages) {
      setTimeout(() => {
        this.setState({ alertColor: "", alertMessage: "" });
      }, Config.apiTimeoutMillis);
    }
  }

  callCreateProfile = () => {
    this.setState({ createProfile: true })
  }

  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  render() {
    const { profiles, profileId, profileName, createProfile, updateProfile, selectProfile, spinner, danger } = this.state;
    if (profiles.length === 0 && !createProfile) {
      return <div>{!spinner ? this.loadSpinner() : <ProfileEmptyMessage />}</div>
    } else if (selectProfile) {
      let url = "/profiles/" + profileId
      return (<Container> <Redirect push to={url} /></Container>)
    } else if (createProfile) {
      return <ProfileForm />
    } else if (updateProfile) {
      return <ProfileForm profileId={profileId} profileName={profileName} loadProfileType={this.loadProfileType} />
    } else {
      return <div> {danger && this.loadDeleteProfile()} {this.showProfile(profiles)}</div>
    }
  }

  loadHeader = () => {
    return (
      <CardHeader style={{ paddingBottom: "20px" }} ><strong>PROFILES</strong>
        <Button color="success" className="float-right" onClick={this.callCreateProfile}> + Create Profile </Button>
      </CardHeader>)
  }

  loadSpinner = () => {
    return ShowServiceComponent.loadSpinnerAction('Profiles', this.state.alertMessage, this.callCreateProfile, '+ Create Profile', this.state.visible);
  }

  //if one or more profile is there then this method Call
  showProfile = (profiles) => {
    let user = Store.getUser();
    let profileTypes = Store.getProfileTypes();
    return (
      <Card>
        <div className="animated fadeIn">
          {this.loadHeader()}
          <CardBody>
            {this.state.alertMessage && <Alert color={this.state.alertColor} >{this.state.alertMessage}</Alert>}
            <Table bordered >
              <thead>
                <tr className="table-tr" align='center'>
                  <th>Profile Name</th>
                  <th>Profile Type </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="tbody-padding">
                {profiles.map((profile, key) => {
                  return this.loadSingleProfile(profile, key, user, profileTypes);
                })}
              </tbody>
            </Table><br /><br />
            <center>
              {/* If user action is not null then excutes this conditions for create profile */}
              {/* Button text changed according to user action */}
              {user && user.action && (userAction.ADD_BILLING === user.action ? <>
                <b>Please Add Billing Address to upgrade your profile</b>&nbsp;<Link to="/billing/address/add">Add Billing Address</Link> <br /><br /><br />
              </>
                : userAction.ADD_CREDITS_LOW === user.action && <><b>Please add credits to upgrade your profile</b>&nbsp; <Link to="/billing/paymentHistory">Add Credits</Link> <br /><br />
                </>)
              }
            </center>
          </CardBody>
        </div></Card>)
  }

  selectProfile = (selectedId) => {
    this.setState({ profileId: selectedId, selectProfile: true })
  }

  //this method load the single profile
  loadSingleProfile = (profile, key, user, profileTypes) => {
    return <tr key={key} >
      <td><b onClick={() => { this.selectProfile(profile.id) }} ><Avatar name={profile.name.charAt(0)} size="40" round={true} /> &nbsp;&nbsp;{profile.name}</b> </td>
      <td style={{ paddingTop: 18 }}>{this.loadProfileType(profile.type)} </td>
      <td>
        <Button style={{ backgroundColor: "#43A432", color: "#F0F3F4" }} onClick={() => { this.updateProfile(profile.id, profile.name) }}>Edit</Button> &nbsp;&nbsp;
        {(user && !user.action) && <UpgradeProfileType userProfile={profile} profileTypes={profileTypes} handleUserConfirm={this.handleUserConfirm} />}
      </td>
      {this.state.userConfirmUpgrade && this.loadConfirmations()}
    </tr>
  }

  loadProfileType = (type) => {
    let profileType = "";
    switch (type) {
      case 1: profileType = "Basic Profile";
        break;
      case 2: profileType = "Premium Profile";
        break;
      case 3: profileType = "Free Business Profile";
        break;
      case 4: profileType = "Business Profile";
        break;
      case 5: profileType = "CRM Profile";
        break;
      case 6: profileType = "Business + CRM Profile";
        break;
      default: profileType = "Free Profile";
        break;
    }
    return profileType;
  }

  // delete model
  loadConfirmations = () => {
    return <DeleteModel
      danger={this.state.userConfirmUpgrade}
      headerMessage="Upgrade Profile"
      bodyMessage="Upgrading a profile may incur some charges. Are you sure you want to upgrade "
      toggleDanger={this.handleUserConfirm}
      delete={this.handleUpgradeProfile}
      cancel={this.handleConfirmUpgrade}
      buttonText="Upgrade Profile"
    />
  }

}
export default Profiles;