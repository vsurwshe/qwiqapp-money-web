import React, { Component } from "react";
import Contacts from "./Contacts";
import ContactApi from "../../services/ContactApi";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";
import Config from "../../data/Config";

class DeleteContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactId: props.contactId,
      contactDeleted: false,
      color: "#00bfff",
      content: "Deleting Contact.....",
      profileId: props.profileId
    };
  }

  componentDidMount = () => {
    new ContactApi().deleteContact(this.successCall, this.errorCall, this.state.profileId, this.state.contactId);
  };

  successCall = async () => {
    this.callAlertTimer("success", "Contact Deleted Successfully....");
  };

  errorCall = (error) => {
    this.callAlertTimer("danger", "Unable to handle the request, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    setTimeout(() => {
      this.setState({ color, content, contactDeleted: true });
    }, Config.notificationMillis)
  };

  render() {
    const { contactDeleted, content, color } = this.state;
    return <div>{contactDeleted ? <Contacts color={color} content={content} visible={true} />
      : ShowServiceComponent.loadDeleting("Contacts", content, color)}</div>
  }
}

export default DeleteContact;
