import React, { Component } from "react";
import { Card, CardHeader,CardBody,Alert,Col } from "reactstrap";
import Lables from "./Contact";
import ContactApi from "../../services/ContactApi";
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
    new ContactApi().deleteContact(this.successCall,this.errorCall,this.state.profileId,this.state.id);
   };
 
  successCall = () => {
    this.callAlertTimer("success","Contact Deleted Successfully....");
  };
 
  errorCall = () => {
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({color: color,content: content});
    setTimeout(() => {this.setState({ color: "",content:"",labelDeleted: true });}, 2000);
  };

  render() {
    const { labelDeleted, content,color } = this.state;
    return <div>{labelDeleted?<Lables />:this.loadDeleteing(color,content)}</div>
  }

  loadHeader=()=>{
    return(<CardHeader>
      <strong>Delete Contact</strong>
    </CardHeader>);
  }

  loadDeleteing=(color,content)=>{
    return(<div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
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
