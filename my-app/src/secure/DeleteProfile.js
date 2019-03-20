import React, { Component } from "react";
import { Card, CardHeader,CardBody } from "reactstrap";
import ProfileApi from "../services/ProfileApi";
class DeleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      profileDeleted: false,
      color: "",
      content: ""
    };
  }
  componentDidMount = () => {
    new ProfileApi().deleteProfile(
      this.successCall,
      this.errorCall,
      this.state.id
    );
  };
  successCall = () => {
    this.setState({
      profileDeleted: true,
      content: "Profile Deleted Successfully !!"
    });
    
  };
  errorCall = () => {
    this.setState({ profileDeleted: true });
    this.callAlertTimer(
      "danger",
      "Something went wrong, Please Try Again...  "
    );
  };
  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
    setTimeout(() => {
      this.setState({ color: "" });
    }, 5500);
  };

  render() {
    const { profileDeleted, content } = this.state;
    if (profileDeleted) {
      return <div>{this.loadDeleteMessage(content)}</div>
    } else {
      return <div>{this.loadDeleteing()}</div>
    }
  }
  //This Method called After Deleted Profile
  loadDeleteMessage=(content)=>{
    return(
    <div className="animated fadeIn">
    <Card>
      <CardHeader>
        <strong>Profile</strong>
      </CardHeader>
      <center style={{paddingTop:'20px'}}>
        <h5><b>{content}</b><br /> <br />
          <a href="/profiles">View Profiles </a></h5>
      </center>
    </Card>
  </div>)
  }

  //this Method Call Between Deleteing Process.
  loadDeleteing=()=>{
    return(
      <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Profile</strong>
        </CardHeader>
          <CardBody>  
          <h5><b>Deleting Profile.....</b></h5>
          </CardBody>
        </Card>
        </div>
    )
  }
}

export default DeleteProfile;
