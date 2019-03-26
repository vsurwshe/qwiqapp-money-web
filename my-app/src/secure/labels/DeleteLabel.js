import React, { Component } from "react";
import { Card, CardHeader,CardBody } from "reactstrap";
import LabelApi from "../../services/LabelApi";
import ProfileApi from "../../services/ProfileApi";
class DeleteLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      labelDeleted: false,
      color: "",
      content: "",
      profileId:this.props.pid
    };
  }
  componentDidMount = () => {
    new LabelApi().deleteLabel(this.successCall,this.errorCall,this.state.profileId,this.state.id);
   };
  //this method call when the delete api called and successfully Executed.
  successCall = () => {
    this.setState({labelDeleted: true,content: "Profile Deleted Successfully !!"
    });
  };
  
  //when any api goto the api executions failed then called this method 
  errorCall = () => {
    this.setState({ labelDeleted: true });
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };
  //this  method show the on page alert
  callAlertTimer = (color, content) => {
    this.setState({color: color,content: content});
    setTimeout(() => {this.setState({ color: "" });}, 5500);
  };

  render() {
    const { labelDeleted, content } = this.state;
    if (labelDeleted) { return <div>{this.loadDeleteMessage(content)}</div>
    } else {return <div>{this.loadDeleteing()}</div>}
  }

  //This Method called After Deleted Label
  loadDeleteMessage=(content)=>{
    return(<div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Profile</strong>
        </CardHeader>
        <center style={{paddingTop:'20px'}}>
          <h5><b>{content}</b><br /> <br />
            <a href="/label/labels">View Labels </a></h5>
        </center>
      </Card>
    </div>)
  }

  //this Method Call Between Deleteing Label Process.
  loadDeleteing=()=>{
    return(<div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Label</strong>
          </CardHeader>
          <CardBody>
            <h5><b>Deleting Label.....</b></h5>
          </CardBody>
        </Card>
      </div>)
  }
}

export default DeleteLabel;
