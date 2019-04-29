import React, { Component } from "react";
import { Card, CardHeader,CardBody,Alert,Col } from "reactstrap";
import Bills from "./Bill";
import BillApi from "../../services/BillApi";
class DeleteBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id : this.props.id,
      profileId : this.props.pid,
      labelDeleted : false,
      color : "warning",
      content : "Deleting Bill.....",
      
    };
  }
  componentDidMount = () => {
    new BillApi().deleteBill(this.successCall,this.errorCall,this.state.profileId,this.state.id);
   };
  //this method call when the delete api called and successfully Executed.
  successCall = () => {
    this.callAlertTimer("success","Bill Deleted Successfully....");
  };
  
  //when any api goto the api executions failed then called this method 
  errorCall = () => {
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  //this  method show the on page alert
  callAlertTimer = (color, content) => {
    this.setState({color: color,content: content});
    setTimeout(() => {this.setState({ color: "",content:"",labelDeleted: true });}, 2000);
  };

  render() {
    const { labelDeleted, content,color } = this.state;
    return <div>{labelDeleted?<Bills />:this.loadDeleteing(color,content)}</div>
  }

  //this Method Call Between Deleteing Label Process.
  loadDeleteing=(color,content)=>{
    return(<div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Delete Bill</strong>
          </CardHeader>
        <CardBody>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <Alert color={color}>{content}</Alert>
          </Col>
        </CardBody>
        </Card>
      </div>)
  }
}

export default DeleteBill;
