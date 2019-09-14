import React, { Component } from "react";
import { Card, CardHeader, CardBody, Alert, Col } from "reactstrap";
import RecurringBillsApi from "../../services/RecurringBillsApi";
import Config from "../../data/Config";
import RecurringBills from "./RecurringBills";
import Store from "../../data/Store";

class DeleteRecurringBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelDeleted: false,
      color: "warning",
      content: "Deleting Bill.....",
    };
  }

  componentDidMount = () => {
    new RecurringBillsApi().deleteRecurringBill(this.successCall, this.errorCall, this.props.profileId, this.props.recurBillId, this.props.removeDependents);
  };

  successCall = () => {
    this.callAlertTimer("success", "Bill Deleted Successfully....");
  };

  errorCall = () => {
    this.callAlertTimer("danger", "Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(async () => { 
       await Store.clearBills();
      this.setState({ color: "", content: "", labelDeleted: true });
    }, Config.notificationMillis);
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <RecurringBills /> : this.deleteBill(color, content)}</div>
  }

  deleteBill = (color, content) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Delete Bill</strong></CardHeader>
          <CardBody>
            <Col sm="12" md={{ size: 5, offset: 4 }}><Alert color={color}>{content}</Alert></Col>
          </CardBody>
        </Card>
      </div>)
  }
}

export default DeleteRecurringBill;
