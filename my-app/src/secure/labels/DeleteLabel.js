import React, { Component } from "react";
import LabelApi from "../../services/LabelApi";
import Lables from "./Label";
import Config from "../../data/Config";
import { ReUseComponents } from "../Utility/ReUseComponents";

class DeleteLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      labelDeleted: false,
      color: "",
      content: "Deleting Label.....",
      profileId: this.props.pid
    };
  }

  componentDidMount = async () => {
    await new LabelApi().deleteLabel(this.successCall, this.errorCall, this.state.profileId, this.state.id);
  };

  successCall = () => {
    this.callAlertTimer("success", "Label Deleted Successfully....");
  };

  errorCall = () => {
    this.callAlertTimer("danger", "Unable to Process Request, Please Try Again...  ");
  };

  //this  method show the on page alert
  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      this.setState({ color: "", content: "", labelDeleted: true });
    }, Config.notificationMillis);
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <Lables /> : ReUseComponents.loadDeleting("Label", "", color, content)}</div>
  }
}

export default DeleteLabel;
