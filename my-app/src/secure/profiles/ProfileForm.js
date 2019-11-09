import React, { Component } from "react";
import { Card, CardBody, CardHeader, Col, Alert, Container } from "reactstrap";
import Store from "../../data/Store";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import Config from "../../data/Config";
import ProfileInfoTable from './ProfileInfoTable';
import ProfileTypesApi from "../../services/ProfileTypesApi";
import { ProfileFormUI } from "../utility/FormsModel";
import { userAction } from "../../data/GlobalKeys";
import '../../css/style.css';


class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: Store.getCurrencies() ? Store.getCurrencies() : [],
      profileId: props.profileId ? props.profileId : '',
      profileName: props.profileName ? props.profileName : '',
      profileType: 0,
      profileTypes: [],
      comparisionText: "View Feature Comparision",
      buttonText: "Create Free Profile"
    };
  }

  componentDidMount = async () => {
    // This Condtions Checks the Profile is Edit or Create
    if (this.state.profileId) {
      await new ProfileApi().getProfileById(this.successCallById, this.errorCallById, this.state.profileId);
    } else {
      let user = Store.getUser();
      await new ProfileTypesApi().getProfileTypes((profileTypes) => { this.setState({ profileTypes }) }, (error) => { console.log("error", error); })
      if (user) {
        this.setState({ action: user.action });
      }
    }
  }

  successCallById = (profile) => {
    this.setState({ profile });
  }

  errorCallById = (error) => {
    console.log(error);
  }

  setButtonText = async (profileType) => {
    let buttonText = "Create Free Profile";
    const { profileTypes } = this.state
    if (profileTypes.length) {
      buttonText = await profileTypes.filter(profile => profile.type === profileType);
      this.setState({ buttonText: "Create " + buttonText[0].name + " Profile", profileType })
    }
  }

  handleEditProfileCancel = () => {
    this.setState({ cancelEditProfile: true });
  }

  toggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  handleSubmit = (e, data) => {
    const { profileId, action } = this.state;
    if (profileId) {
      new ProfileApi().updateProfile(this.successCall, this.errorCall, data, profileId);
    } else {
      if (action !== userAction.VERIFY_EMAIL) {
        new ProfileApi().createProfile(this.successCall, (err) => { this.errorCall(err, data.type) }, data);
      } else {
        this.callAlertTimer("danger", "First Please verify with the code sent to your Email.....")
      }
    }
  };

  successCall = () => {
    if (this.state.profileId) {
      this.callAlertTimer("success", "Profile Updated Successfully!!");
    } else {
      this.callAlertTimer("success", "New Profile Created!!");
    }
  }

  errorCall = (error, profileType) => {
    if (profileType) {
      this.callAlertTimer("danger", "You need to purchase credits to create these Profiles, For more info View Feature Comparision.....");
    } else if (Store.getProfile() !== null) {
      if (this.state.profileId) {
        this.callAlertTimer("danger", "Unable to process request, Please Try Again ...");
      } else {
        this.callAlertTimer("danger", "Sorry, You can't create another Profile.....");
      }
    } else {
      this.callAlertTimer("danger", "Unable to process request, Please Try Again ...");
    }
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    if (color === "success") {
      setTimeout(() => {
        this.setState({ content: '', color: '', profileName: '', profileCreated: true });
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
    const { color, content, profileCreated, cancelEditProfile, profileInfoTable, profileId } = this.state
    if (profileCreated || cancelEditProfile) {
      if (!Store.getProfile()) { // to solve loading Sidebar. Side bar not loading while after created first profile.
        window.location.reload();
      }
      return <Profiles />
    } else if (profileId) {
      return this.loadProfile(color, content, "UPDATE PROFILE")
    } else {
      return <div>
        {(profileCreated || cancelEditProfile) ? <Profiles /> : this.loadProfile(color, content, "CREATE PROFILE", profileInfoTable)}
      </div>
    }
  }

  // when Profile Creation in process.
  loadProfile = (color, content, headerMessage, profileInfoTable) => {
    return <div className="animated fadeIn">
      <Card>
        <CardHeader><strong>{headerMessage}</strong></CardHeader>
        <CardBody>
          {color && <Alert color={color}>{content}</Alert>}
          <Col>
            <Container>
              {this.loadProfileForm()}
              <h5>
                <span onClick={this.profileViewTable} className="float-right profile-comparision-text">
                  <u>{this.state.comparisionText}</u>
                </span>
              </h5>
              {profileInfoTable && <ProfileInfoTable />}
            </Container>
          </Col>
        </CardBody>
      </Card>
    </div>
  }

  loadProfileForm = () => {
    const { profile, profileName, tooltipOpen, currencies, profileTypes, action, buttonText, profileType } = this.state;
    const profileFields = {
      profile: profile,
      action: action,
      profileType: profileType,
      profileTypes: profileTypes,
      profileName: profileName,
      tooltipOpen: tooltipOpen,
      buttonMessage: this.props.profileId ? 'Update' : buttonText,
      currencies: currencies
    }
    return <ProfileFormUI
      data={profileFields}
      toggle={this.toggle}
      handleSubmit={this.handleSubmit}
      setButtonText={this.setButtonText}
      handleEditProfileCancel={this.handleEditProfileCancel}
    />
  }
}
export default ProfileForm;
