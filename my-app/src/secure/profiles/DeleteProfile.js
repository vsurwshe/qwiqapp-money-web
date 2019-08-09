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
      content: "Deleting profile ......"
    };
  }
  
  componentDidMount = () => {
    new ProfileApi().deleteProfile(this.successCall,this.errorCall,this.state.id );
  };

  successCall = () => {
    this.callAlertTimer("Profile Deleted Successfully!  ");
  };
  
  errorCall = () => {
    this.callAlertTimer("Unable to Process Request, Please Try Again!! ");
  };
  
  callAlertTimer = (content) => {
    this.setState({ content });
    setTimeout(() => {
      this.setState({ content: "", profileDeleted: true });
       window.location.reload();
    }, Config.apiTimeoutMillis);
  };

  render() {
    const { profileDeleted, content } = this.state;
    return <div>{profileDeleted ? <Profiles/> : ReUseComponents.loadDeleting("Profile", content)}</div>
  }

}

export default DeleteProfile;
