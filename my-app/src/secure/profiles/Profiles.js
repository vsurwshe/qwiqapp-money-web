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
import { user_actions } from '../../data/StoreKeys';
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
      this.setState({ userAction: user.action });
    }
  }
  componentDidUpdate() { 
    // solved Reload issues
    if (this.state.profileUpgraded) {
      new ProfileApi().getProfiles(this.successCall, this.errorCall, "True");
      this.setState({ profileUpgraded: false });
    }
  }

  successCall = async profiles => {
    let profilesById = [];
    if (!profiles.length) {
      this.setState({ profiles: [], spinner: false })
    } else {
      await profiles.map(profile => {
        // to get dynamic dropdowns for Profile Upgrade
        // dropdown is based on "profile.upgradeTypes"
        new ProfileApi().getProfilesById(async (profileById) => { 
          profilesById.push(profileById);
         await this.setState({profiles: profilesById, spinner: false })  
        }, this.errorCall, profile.id);
        return 0;
      });
    }
  };

  errorCall = err => { this.setState({ visible: true }); console.log("Internal Server Error"); console.log(err) }

  updateProfile = (profileId, profileName) => {
    this.setState({ profileId, profileName, updateProfile: true, })
  };

  handleConformUpgrade = () => {
    this.setState({ userConformUpgarde:!this.state.userConformUpgarde });
  }
  handelUserConform=(profileId, profileType)=>{
    this.handleConformUpgrade()
    this.setState({ profileId, profileType, alertColor: undefined, alertMessage: undefined})
  }
  
  handelUpgradeProfile = () => {
    this.handleConformUpgrade();
    const userAction=Store.getUser();
    if(userAction.action){
      switch (userAction.action) {
        case user_actions.ADD_BILLING:
          this.setState({ alertColor: "danger", alertMessage: "Add your billing address" });
          break;
        case user_actions.ADD_CREDITS:
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
      return <ProfileForm profileId={profileId}  profileName={profileName}/>
    } else if (deleteProfile) {
      return <DeleteProfile profileId={profileId} />
     } else  {
       return <div> { danger && this.loadDeleteProfile()} {this.showProfile(profiles)}</div>
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
              <div className="spinner-border text-primary" style={{width: 100, height: 100}} role="status">
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
              <tr style={{ backgroundColor: "#DEE9F2  ", color: '#000000' }} align='center'>
                <th>Profile Name</th>
                <th>Profile Type </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ paddingBottom: "20px" }}>
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
            <DropdownToggle caret >Upgrade</DropdownToggle>
            {profileTypes && <DropdownMenu>
              {profile.upgradeTypes.map((upgreadType, id) => {
                const data = profileTypes.filter(profile => profile.type === upgreadType);
                return <DropdownItem key={id} onClick={() => this.handelUserConform(profile.id, data[0].type)} >{data[0].name} </DropdownItem>
              })}
            </DropdownMenu>
            }
          </UncontrolledDropdown>
            : <span style={{ paddingRight: 100 }}></span>
          }
        </td>
        {this.state.userConformUpgarde && this.loadConformations()}
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
  loadConformations = () => {
    return <DeleteModel 
      danger={this.state.userConformUpgarde} 
      headerMessage="Upgrade Profile" 
      bodyMessage="This profile cost higher then current profile, are you sure You wants to upgrade"
      toggleDanger={this.handelUserConform} 
      delete={this.handelUpgradeProfile} 
      cancel={this.handleConformUpgrade} 
      buttonText="Upgrade Profile"
      />
  }

}
export default Profiles;