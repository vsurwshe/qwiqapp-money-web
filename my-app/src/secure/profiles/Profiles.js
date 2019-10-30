import Avatar from 'react-avatar';
import React, { Component } from "react";
import Loader from 'react-loader-spinner'
import DeleteProfile from "./DeleteProfile";
import { Redirect } from 'react-router';
import ProfileApi from "../../services/ProfileApi";
import { DeleteModel } from "../utility/DeleteModel";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { Container, Button, Card, CardBody, Table, CardHeader, Alert, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";
import ProfileForm from './ProfileForm';
import Config from '../../data/Config';
import Store from '../../data/Store';
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
    new ProfileApi().getProfiles(this.successCall, this.errorCall);
  }
  componentDidUpdate() {
    if (this.state.profileUpgraded) {
      new ProfileApi().getProfiles(this.successCall, this.errorCall, "True");
      this.setState({profileUpgraded: false});
    }
  }

  successCall = async profiles => {
    if (profiles === null) {
      this.setState({ profiles: [], spinner: true })
    } else {
      let profilesById = [];
      await profiles.map((profile, key) => {
        new ProfileApi().getProfilesById((profileById) => { profilesById.push(profileById) }, this.errorCall, profile.id)
      });
      this.setState({ profiles: profilesById, spinner: true })
    }
  };

  errorCall = err => { this.setState({ visible: true }); console.log("Internal Server Error"); console.log(err) }

  updateProfile = (profileId, profileName) => {
    this.setState({ profileId, profileName, updateProfile: true, })
  };

  handelUpgradeProfile = (profileId, profileType) => {
    new ProfileApi().upgradeProfile(this.upgradeSuccessCall, this.errorCall, profileId, profileType);
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
              {/* <Loader type="TailSpin" color="#2E86C1" height={60} width={60} /> */}
              <div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
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
    return (
      <tr key={key} >
        <td><b onClick={() => { this.selectProfile(profile.id) }} >
          <Avatar name={profile.name.charAt(0)} size="40" round={true} /> &nbsp;&nbsp;{profile.name}</b> </td>
        <td style={{ paddingTop: 18 }}>{this.loadProfileType(profile.type)} </td>
        <td align="center">
          <Button style={{ backgroundColor: "#43A432", color: "#F0F3F4" }} onClick={() => { this.updateProfile(profile.id, profile.name) }}>Edit</Button> &nbsp;
          {profile.upgradeTypes ? <UncontrolledDropdown group>
            <DropdownToggle caret >Upgrade</DropdownToggle>
            {profileTypes && <DropdownMenu>
              {profile.upgradeTypes.map((upgreadType, id) => {
                const data = profileTypes.filter(profile => profile.type === upgreadType);
                return <DropdownItem key={id} onClick={() => this.handelUpgradeProfile(profile.id, data[0].type)} >{data[0].name} </DropdownItem>
              })}
            </DropdownMenu>
            }
          </UncontrolledDropdown>
            : <span style={{ paddingRight: 100 }}></span>
          }
        </td>
      </tr>
    );
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
  loadDeleteProfile = () => {
    return (
      <DeleteModel danger={this.state.danger} headerMessage="Delete Profile" bodyMessage="Are You Sure Want to Delete Profile?"
        toggleDanger={this.toggleDanger} delete={this.deleteProfile} cancel={this.toggleDanger} />)
  }
}
export default Profiles;