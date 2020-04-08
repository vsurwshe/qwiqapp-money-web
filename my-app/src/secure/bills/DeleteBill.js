import React, { Component } from "react";
import { Card, CardBody } from "reactstrap";
import Bills from "./Bills";
import BillApi from "../../services/BillApi";
import Config from "../../data/Config";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";

class DeleteBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      billId: props.billId,
      profileId: props.profileId,
    };
  }

  componentDidMount = () => {
    new BillApi().deleteBill(this.successCall, this.errorCall, this.state.profileId, this.state.billId, this.props.removeDependents);
  };
  successCall = () => {
    this.callAlertTimer("success", "Bill deleted successfully....");
  };

  errorCall = (error) => {
    const response = error && error.response ? error.response : '';
    if (response && (response.status === 500 && response.data && response.data.error)) {
      this.callAlertTimer("danger", "You are not able to delete, beacuse this bills has attachments or payments");
    } else {
      this.callAlertTimer("danger", "Unable to process your request, please check with your internet connection and re-try again.");
    }
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {
      this.setState({ labelDeleted: true });
    }, Config.notificationMillis);
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ?  <Bills /> : this.deleteBill(color, content)}</div>
  }

  deleteBill = (color, content) => {
    return (
      <div className="animated fadeIn">
        <Card>
          {ShowServiceComponent.loadHeaderAction("Delete bill")}
          <CardBody>
            <center>
              {content ? ShowServiceComponent.loadAlert(color, content) : ShowServiceComponent.loadBootstrapSpinner()}
            </center>
          </CardBody>
        </Card>
      </div>)
  }
}

export default DeleteBill;
