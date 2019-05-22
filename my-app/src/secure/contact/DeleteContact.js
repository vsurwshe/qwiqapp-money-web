import React, { Component } from "react";
import Contacts from "./Contacts";
import ContactApi from "../../services/ContactApi";
import { ReUseComponents } from "../uitility/ReUseComponents";

class DeleteContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactId: props.contactId,
      labelDeleted: false,
      color: "warning",
      content: "Deleting Label.....",
      profileId: props.profileId
    };
  }
  componentDidMount = () => {
    new ContactApi().deleteContact(this.successCall, this.errorCall ,this.state.profileId, this.state.contactId);
   };
   
  successCall = async () => {
    this.setState({ labelDeleted: true  });
    this.callAlertTimer("success","Contact Deleted Successfully....");
     window.location.reload();
  };
 
  errorCall = () => {
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color , content});
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <Contacts color={color} content={content}/> 
                               : ReUseComponents.loadDeleting("Delete Contact", "Contact Deleting")}</div>
  }   
}

export default DeleteContact;
