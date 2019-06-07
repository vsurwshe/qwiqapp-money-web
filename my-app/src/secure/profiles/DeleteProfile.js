import React, { Component } from "react";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import { ReUseComponents } from "../Utility/ReUseComponents";
import Config from "../../data/Config";

class DeleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      profileDeleted: false,
      color: "warning",
      content: "profile Deleting......"
    };
  }
  componentDidMount = () => {
    new ProfileApi().deleteProfile(
      this.successCall,
      this.errorCall,
      this.state.id
    );
  };
  successCall = () => {
    this.callAlertTimer("success", "Profile Deleted Successfully!  ");
  };
  errorCall = () => {
    this.callAlertTimer("danger", "Unable to Process Request, Please Try Again!! ");
  };
  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
    setTimeout(() => {
      this.setState({ color: "", content: "", profileDeleted: true });
      window.location.reload();
    }, Config.notificationMillis);
  };

  render() {
    const { profileDeleted, content, color } = this.state;
    return <div>{profileDeleted ? <Profiles /> : ReUseComponents.loadDeleting("Profile", "", color, content)}</div>
  }

}

export default DeleteProfile;
