import React, { Component } from "./node_modules/react";
import { Card, CardHeader, CardBody, Alert, Col } from "./node_modules/reactstrap";
import Bills from "./Bill";
import BillApi from "../../services/BillApi";

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

  //this method called when the delete api called and successfully Executed.
  successCall = () => {
    this.callAlertTimer("success","Bill Deleted Successfully....");
  };
  
  //This method shows API Error if there's any 
  errorCall = () => {
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  //This method show the alert message
  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {this.setState({ color: "", content:"", labelDeleted: true });}, 2000);
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <Bills /> : this.loadDeleting(color, content)}</div>
  }

  //This Method Call while Deletion is in Process.
  loadDeleting = (color, content) =>{
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
