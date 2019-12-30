import React, { Component } from "react";
import { Card, CardBody, CardHeader, Col, Alert } from "reactstrap";
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
      comparisionText: "Hide Feature Comparision",
      buttonText: "Create Free Profile"
    };
  }

  componentDidMount = async () => {
    // This Condtions Checks the Profile is Edit or Create
    if (this.state.profileId) {
      await new ProfileApi().getProfileById(this.successCallById, this.errorCallById, this.state.profileId);
    }
    let user = Store.getUser();
    await new ProfileTypesApi().getProfileTypes((profileTypes) => { this.setState({ profileTypes }) }, (error) => { console.log("error", error); })
    if (user) {
      this.setState({ action: user.action, user });
    }
  }

  successCallById = (profile) => {
    this.setState({ profile });
  }

  errorCallById = (error) => {
    console.log(error);
  }

  // Set button text according to user (selected profile type)
  setButtonText = async (event) => {
    const { value } = event.target; // value type is String, like "1", "0"
    let buttonText = "";
    const { profileTypes } = this.state
    if (profileTypes.length) {
      buttonText = await profileTypes.filter(profile => profile.type === parseInt(value));
      this.setState({ buttonText: "Create " + buttonText[0].name + " Profile", profileType: parseInt(value) })
    }
  }

  handleEditProfileCancel = () => {
    this.setState({ cancelEditProfile: true });
  }

  toggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  handleSubmit = (e, data) => {
    const { profileId, action, profileType } = this.state;
    if (profileId) {
      new ProfileApi().updateProfile(this.successCall, this.errorCall, data, profileId);
    } else {
      if (action !== userAction.VERIFY_EMAIL) {
        new ProfileApi().createProfile(this.successCall, (err) => { this.errorCall(err, data.type) }, { ...data, type: profileType });
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

  handleConfirmUpgrade = () => {
    this.setState({ userConfirmUpgrade: !this.state.userConfirmUpgrade });
  }

  handleUserConfirm = (profileId, profileType) => {
    this.handleConfirmUpgrade()
    this.setState({ profileId, profileType, color: undefined, content: undefined })
  }

  render() {
    const { color, content, profileCreated, cancelEditProfile, profileInfoTable, profileId } = this.state
    if (profileCreated || cancelEditProfile) {
      // to solve loading Sidebar. Side bar not loading while after created first profile.
      !cancelEditProfile && window.location.reload();
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
            {this.loadProfileForm()}
            {!this.state.profileId && <><h5>
              <span onClick={this.profileViewTable} className="float-right profile-comparision-text">
                <u>{this.state.comparisionText}</u>
              </span>
            </h5> <br />
              {!profileInfoTable && <ProfileInfoTable />} </>}
          </Col>
        </CardBody>
      </Card>
    </div>
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
    this.callAlertTimer("success", "Your profile upgraded successfully !", true);
  }

  upgradeErrorCall = (error) => {
    const {response} = error && error.response
    if (response && response.status === 400 && !response.data) {
      this.callAlertTimer("danger", "Your credits are low, please add more credits", true);
    } else {
      this.callAlertTimer("danger", "Unable to process your request", true);
    }
  }

  loadProfileForm = () => {
    const { profile, profileName, tooltipOpen, currencies, profileTypes, action, buttonText, profileType, user, userConfirmUpgrade } = this.state;
    const profileFields = {
      profile: profile,
      action: action,
      profileType: profileType,
      profileTypes: profileTypes,
      profileName: profileName,
      tooltipOpen: tooltipOpen,
      buttonMessage: this.props.profileId ? 'Update' : buttonText,
      currencies: currencies,
      user: user,
      userConfirmUpgrade: userConfirmUpgrade
    }
    return <ProfileFormUI
      data={profileFields}
      toggle={this.toggle}
      handleSubmit={this.handleSubmit}
      setButtonText={this.setButtonText}
      handleEditProfileCancel={this.handleEditProfileCancel}
      handleUserConfirm={this.handleUserConfirm}
      handleConfirmUpgrade={this.handleConfirmUpgrade}
      handleUpgradeProfile={this.handleUpgradeProfile}
      loadProfileType={this.props.loadProfileType}
    />
  }
}
export default ProfileForm;
