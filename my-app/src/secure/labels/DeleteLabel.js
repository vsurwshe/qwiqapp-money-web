import React, { Component } from "react";
import LabelApi from "../../services/LabelApi";
import Lables from "./Labels";
import Config from "../../data/Config";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";

class DeleteLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "Deleting label.....",
      color: "#00bfff",
    };
  }

  componentDidMount = async () => {
    await new LabelApi().deleteLabel(this.successCall, this.errorCall, this.props.profileId, this.props.labelId);
  };

  successCall = () => {
    this.callAlertTimer("success", "Label deleted successfully....");
  };

  errorCall = (error) => {
    const response = error && error.response ? error.response : '';
    if (response) {
      const {status, data} = response; // directly assigning value, because we already checked that response is not a falsy(null, '', undefined, 0) value, then only come here.
      if (status === 500 && (data && data.error && data.error.debugMessage) ) {
        this.callAlertTimer("danger", "This label is associated with contacts or bills.");
      } else {
        this.callAlertTimer("danger", "Unable to process request, please try again.");
      }
    } else {
      this.callAlertTimer("danger", "Please check your internet connection and re-try again.");
    }
  };

  //this  method show the on page alert
  callAlertTimer = (color, content) => {
    setTimeout(() => {
      this.setState({ color, content, labelDeleted: true });
    }, Config.notificationMillis);
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <Lables color={color} content={content} visible={true} /> : ShowServiceComponent.loadDeleting("Labels", content, color)}</div>
  }
}

export default DeleteLabel;
