import Avatar from 'react-avatar';
import React, { Component } from "react";
import DeleteProfile from "./DeleteProfile";
import { Redirect } from 'react-router';
import ProfileApi from "../../services/ProfileApi";
import { DeleteModel } from "../utility/DeleteModel";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { Container, Button, Card, CardBody, Table, CardHeader, Alert, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";
import ProfileForm from './ProfileForm';
import Config from '../../data/Config';
import Store from '../../data/Store';
import { userAction } from '../../data/GlobalKeys';
/**
 * Display list of profiles,Manage profile like (update, delete)
 * Call Add,Update, delete Componets.
 * TODO: handel Error Message
 */
class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: []
    };
  }

  componentDidMount() {
    let user = Store.getUser();
    new ProfileApi().getProfiles(this.successCall, this.errorCall);
    if (user) {
      this.setState({ action: user.action });
    }
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

  errorCall = err => { this.setState({ visible: true }); console.log("Internal Server Error"); console.log(err) }

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

  handelUpgradeProfile = () => {
    this.handleConfirmUpgrade();
    const action = this.state.action; // This is user action(actually from store(API response))
    if (action) {
      switch (action) {
        case userAction.ADD_BILLING: // This is Global variable(declared in GlobalKeys.js), to compare 'action' of user
          this.setState({ alertColor: "danger", alertMessage: "Add your billing address" });
          break;
        case userAction.ADD_CREDITS:
          this.setState({ alertColor: "danger", alertMessage: "Add credits" });
          break;
        default: this.setState({ alertColor: "danger", alertMessage: "Your credits are low, please add more credits" });
          break;
      }
    } else {
      new ProfileApi().upgradeProfile(this.upgradeSuccessCall, this.errorCall, this.state.profileId, this.state.profileType);
    }
  }

  upgradeSuccessCall = (profile) => {
    this.setState({ alertColor: "success", alertMessage: "Your profile upgraded successfully", profileUpgraded: true });
    setTimeout(() => {
      this.setState({ alertColor: '', alertMessage: '' });
    }, Config.apiTimeoutMillis);
  }

  deleteProfile = () => {
    this.setState({ deleteProfile: true })
  };

  callCreateProfile = () => {
    this.setState({ createProfile: true })
  }

  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  render() {
    const { profiles, profileId, profileName, createProfile, updateProfile, deleteProfile, selectProfile, spinner, danger } = this.state;
    if (profiles.length === 0 && !createProfile) {
      return <div>{!spinner ? this.loadSpinner() : <ProfileEmptyMessage />}</div>
    } else if (selectProfile) {
      let url = "/profiles/" + profileId
      return (<Container> <Redirect push to={url} /></Container>)
    } else if (createProfile) {
      return <ProfileForm />
    } else if (updateProfile) {
      return <ProfileForm profileId={profileId} profileName={profileName} />
    } else if (deleteProfile) {
      return <DeleteProfile profileId={profileId} />
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
    return (
      <div className="animated fadeIn">
        <Card>
          <center style={{ paddingTop: '20px' }}>
            {this.loadHeader()}
            <CardBody>
              {this.state.visible && <Alert color="danger">Unable to Process your Request, please try Again...</Alert>}
              <div className="text-primary spinner-size" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </CardBody>
          </center>
        </Card>
      </div>)
  }

  //if one or more profile is there then this method Call
  showProfile = (profiles) => {
    return (
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
                return this.loadSingleProfile(profile, key);
              })}
            </tbody>
          </Table>
        </CardBody>
      </div>)
  }

  selectProfile = (selectedId) => {
    this.setState({ profileId: selectedId, selectProfile: true })
  }

  //this method load the single profile
  loadSingleProfile = (profile, key) => {
    let profileTypes = Store.getProfileTypes();
    return <tr key={key} >
      <td><b onClick={() => { this.selectProfile(profile.id) }} ><Avatar name={profile.name.charAt(0)} size="40" round={true} /> &nbsp;&nbsp;{profile.name}</b> </td>
      <td style={{ paddingTop: 18 }}>{this.loadProfileType(profile.type)} </td>
      <td align="center">
        <Button style={{ backgroundColor: "#43A432", color: "#F0F3F4" }} onClick={() => { this.updateProfile(profile.id, profile.name) }}>Edit</Button> &nbsp;
          {profile.upgradeTypes ? <UncontrolledDropdown group>
          <DropdownToggle caret >Upgrade to</DropdownToggle>
          {profileTypes && <DropdownMenu>
            {profile.upgradeTypes.map((upgradeType, id) => {
              const data = profileTypes.filter(profile => profile.type === upgradeType);
              return <DropdownItem key={id} onClick={() => this.handleUserConfirm(profile.id, data[0].type)} >{data[0].name} </DropdownItem>
            })}
          </DropdownMenu>
          }
        </UncontrolledDropdown>
          : <span style={{ paddingRight: 110 }}></span>
        }
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
      // "This profile cost is higher than current profile, are you sure you want to upgrade ?"
      toggleDanger={this.handleUserConfirm}
      delete={this.handelUpgradeProfile}
      cancel={this.handleConfirmUpgrade}
      buttonText="Upgrade Profile"
    />
  }

}
export default Profiles;