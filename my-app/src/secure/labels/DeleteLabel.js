import React, { Component } from "react";
import { Card, CardHeader,CardBody,Alert,Col } from "reactstrap";
import LabelApi from "../../services/LabelApi";
import Lables from "./Label";

class DeleteLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      labelDeleted: false,
      color: "warning",
      content: "Deleting Label.....",
      profileId:this.props.pid
    };
  }
  componentDidMount = () => {
    new LabelApi().deleteLabel(this.successCall,this.errorCall,this.state.profileId,this.state.id);
   };
  //this method call when the delete api called and successfully Executed.
  successCall = () => {
    this.callAlertTimer("success","Profile Deleted Successfully....");
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
    return <div>{labelDeleted?<Lables />:this.loadDeleteing(color,content)}</div>
  }

  //This Method called After Deleted Label
  loadDeleteMessage=(content)=>{
    return(<div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Label</strong>
        </CardHeader>
        <center style={{paddingTop:'20px'}}>
          <h5><b>{content}</b><br /> <br />
            <a href="/label/labels">View Labels </a></h5>
        </center>
      </Card>
    </div>)
  }

  //this Method Call Between Deleteing Label Process.
  loadDeleteing=(color,content)=>{
    return(<div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Label</strong>
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

export default DeleteLabel;
