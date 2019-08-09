import React, { Component } from "react";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";
import { ReUseComponents } from "../utility/ReUseComponents";
import Config from "../../data/Config";

class DeleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      profileDeleted: false,
      color: "blue",
      content: "Deleting profile ......"
    };
  }

  componentDidMount = () => {
    new ProfileApi().deleteProfile(this.successCall, this.errorCall, this.state.id);
  };

  successCall = () => {
    this.callAlertTimer("Profile Deleted Successfully!  ");
  };

  errorCall = () => {
    this.callAlertTimer("warning", "Unable to Process Request, Please Try Again!! ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {
      this.setState({ profileDeleted: true });
      window.location.reload();
    }, Config.apiTimeoutMillis);
  };

  render() {
    const { profileDeleted, content, color } = this.state;
    return <div>{profileDeleted ? <Profiles /> : ReUseComponents.loadDeleting("Profile", content, color)}</div>
  }

}

export default DeleteProfile;
