import React, { Component } from "react";
import { Button, Input, Card, CardBody, CardHeader, Col, Alert, Table } from "reactstrap";
import Store from "../../data/Store";
import { Link } from 'react-router-dom';
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import Config from "../../data/Config";
import ProfileInfoTable from './ProfileInfoTable';
import ProfileTypesApi from "../../services/ProfileTypesApi";
import { ProfileFormUI } from "../utility/FormsModel";
import '../../css/style.css';

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: Store.getCurrencies() ? Store.getCurrencies() : [],
      profileId: props.profileId ? props.profileId : '',
      profileName: props.profileName? props.profileName:'',
      profileType: 0,
      profileTypes: [],
      comparisionText: "View Feature Comparision"
    };
  }

  componentDidMount = async () => {
    if (this.state.profileId) {
      await new ProfileApi().getProfilesById(this.successCallById, this.errorCallById, this.state.profileId);
    } else {
      let user = Store.getUser();
      this.setState({ action: Store.getUser().action });
      await new ProfileTypesApi().getProfileTypes((profileTypes) => {
        this.setState({ profileTypes })
      },
        (error) => { console.log("error", error); }
      )
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

  handleEditProfileCancel = () => {
    this.setState({ cancelEditProfile: true });
  }

  toggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  handleSubmit = (e, values) => {
    e.preventDefault();
    const { profileId, profileType, action } = this.state;
    const data = { name: values.name, currency: values.currency };
    if (profileId) { 
      new ProfileApi().updateProfile(this.successCall, this.errorCall, data, profileId);
    } else {
      if (action !== 'VERIFY_EMAIL') {
        const newData = { ...data, type: profileType };
        new ProfileApi().createProfile(this.successCall, this.errorCall, newData);
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

  errorCall = err => {
    if (this.state.profileType) {
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
    const { color, content, profileCreated, cancelEditProfile, action, profileType, profileInfoTable, profileTypes, profileId } = this.state
    if (profileCreated || cancelEditProfile) {
      return <Profiles />
    } else if (profileId) {
      return this.loadProfile(color, content, "UPDATE PROFILE")
    } else {
      const profileTypesOptions = profileTypes.map(proTypes => {
        return <tr key={proTypes.type}>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Input type="radio" name="radio1" value={proTypes.type} checked={proTypes.type === profileType}
            onChange={() => this.selectProfileType(proTypes.type)} />{' '}</td>
          <td>{proTypes.name}</td>
          <td>{proTypes.cost}</td>
          <td>{proTypes.description}</td>
        </tr>
      })
      return <div>
        {(profileCreated || cancelEditProfile) ? <Profiles /> : this.loadProfile(color, content, "CREATE PROFILE", action, profileType, profileInfoTable, profileTypesOptions)}
      </div>
    }
  }

  // when Profile Creation in process.
  loadProfile = (color, content, headerMessage, action, profileType, profileInfoTable, profileTypesOptions) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>{headerMessage}</strong></CardHeader>
          <CardBody>
            <Col>{color && <Alert color={color}>{content}</Alert>}</Col>
            <Col>
              {
              profileTypesOptions ? <>
                <center>
                  <h5><b>Choose profile types</b></h5>
                  <Col >
                    {action !== "VERIFY_EMAIL" && this.createProfileTypes(profileTypesOptions)}
                    <br />{this.loadActionsButton(action, profileType)}<br /><br />
                    <h5><span onClick={this.profileViewTable} className="float-right profile-comparision-text" ><u>{this.state.comparisionText}</u></span></h5>
                  </Col>
                </center> <br /><br />
                {profileInfoTable && <ProfileInfoTable />}</> : this.loadProfileForm()
            }
            </Col>
          </CardBody>
        </Card>
      </div>);
  }

  createProfileTypes = (profileTypesOptions) => {
    return <Table bordered striped hover>
      <thead className="table-header-color">
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
  }

  loadActionsButton = (action, profileType) => {
    let url = action === 'ADD_BILLING' ? "/billing/address" : '/billing/paymentHistory';
    if (action === "VERIFY_EMAIL") {
      return <Alert color="warning">Sorry you cannot Create Profile until you verify Your Email</Alert>
    } else if (profileType !== 0 && profileType !== 3 && action) {
      return <>
        <Button color="info"><Link to={url} style={{ color: "black" }}> {action}</Link></Button>
        <Button active color="danger" style={{ marginLeft: 20 }} aria-pressed="true" onClick={this.handleEditProfileCancel}>Cancel</Button>
      </>
    } else {
      return this.loadProfileForm()
    }
  }

  loadProfileForm = () => {
    const { profile, profileName, tooltipOpen, currencies } = this.state;
    const profileFields = {
      profile: profile,
      profileName : profileName,
      tooltipOpen: tooltipOpen,
      buttonMessage: this.props.profileId ? 'Update' : 'Save',
      currencies: currencies,
    }
    return <ProfileFormUI data={profileFields}
      toggle={this.toggle} handleSubmit={this.handleSubmit}
      handleEditProfileCancel={this.handleEditProfileCancel} />
  }
}
export default ProfileForm;
