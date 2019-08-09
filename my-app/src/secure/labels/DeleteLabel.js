import React, { Component } from "react";
import LabelApi from "../../services/LabelApi";
import Lables from "./Labels";
import Config from "../../data/Config";
import { ReUseComponents } from "../utility/ReUseComponents";

class DeleteLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      labelDeleted: false,
      content: "Deleting Label.....",
      profileId: this.props.pid
    };
  }

  componentDidMount = async () => {
    await new LabelApi().deleteLabel(this.successCall, this.errorCall, this.state.profileId, this.state.id);
  };

  successCall = () => {
    this.callAlertTimer("Label Deleted Successfully....");
  };

  errorCall = () => {
    this.callAlertTimer("Unable to Process Request, Please Try Again...  ");
  };

  //this  method show the on page alert
  callAlertTimer = (content) => {
    this.setState({ content });
    setTimeout(() => {
      this.setState({ content: "", labelDeleted: true });
    }, Config.notificationMillis);
  };

  render() {
    const { labelDeleted, content } = this.state;
    return <div>{labelDeleted ? <Lables /> : ReUseComponents.loadDeleting("Label", content)}</div>
  }
}

export default DeleteLabel;
