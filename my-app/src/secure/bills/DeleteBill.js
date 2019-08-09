import React, { Component } from "react";
import { Card, CardHeader, CardBody, Alert, Col } from "reactstrap";
import Bills from "./Bills";
import BillApi from "../../services/BillApi";
import Config from "../../data/Config";

class DeleteBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id : props.id,
      profileId : props.pid,
      labelDeleted : false,
      color : "warning",
      content : "Deleting Bill.....",
      
    };
  }

  componentDidMount = () => {
    new BillApi().deleteBill(this.successCall, this.errorCall, this.state.profileId, this.state.id);
  };

  successCall = () => {
    this.callAlertTimer("success","Bill Deleted Successfully....");
  };
  
  errorCall = () => {
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {this.setState({ color: "", content:"", labelDeleted: true });}, Config.notificationMillis);
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <Bills /> : this.deleteBill(color, content)}</div>
  }

  deleteBill = (color, content) =>{
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

export default DeleteBill;
