import React, { Component } from "react";
import { Card, CardHeader, CardBody, Alert, Col } from "reactstrap";
import Config from "../../../data/Config";
import PaymentApi from "../../../services/PaymentApi";
import ViewPayment from "./ViewPayment";

class DeleteBillPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "warning",
      content: "Deleting bill payment.....",
    };
  }

  componentDidMount = () => {
    new PaymentApi().deleteBillPayment(this.successCall, this.errorCall, this.props.profileId, this.props.bill.id, this.props.taxId);
  };

  successCall = () => {
    this.callAlertTimer("success", "BillPayment deleted successfully !!");
  };

  errorCall = () => {
    this.callAlertTimer("danger", "Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {
      this.setState({ labelDeleted: true });
    }, Config.apiTimeoutMillis);
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <ViewPayment bill={this.props.bill} profileId={this.props.profileId} cancel={this.props.cancelViewPay} /> : this.deleteBillPayment(color, content)}</div>
  }

  deleteBillPayment = (color, content) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Delete Bill Payment</strong></CardHeader>
          <CardBody>
            <Col sm="12" md={{ size: 5, offset: 4 }}><Alert color={color}>{content}</Alert></Col>
          </CardBody>
        </Card>
      </div>)
  }
}

export default DeleteBillPayment;
