import React, { Component } from "react";
import { Card, CardHeader, CardBody, Col, Alert } from "reactstrap";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";

class DeleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      profileDeleted: false,
      color: "warning",
      content: "profile Deleting......"
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
    this.callAlertTimer( "success", "Profile Deleted Successfully!  " );
  };
  errorCall = () => {
    this.callAlertTimer( "danger", "Unable to Process Request, Please Try Again!! " );
  };
  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
    setTimeout(() => {
      this.setState({ color: "" ,content:"",profileDeleted : true});
      window.location.reload();
    }, 2000);
  };

  render() {
    const { profileDeleted, content, color } = this.state;
    return <div>{ profileDeleted ? <Profiles /> : this.loadDeleting(color,content) }</div>
  }

  //this Method Call Between Deleting Process.
  loadDeleting = (color, content) =>{
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Label</strong></CardHeader>
          <CardBody>
            <Col sm="12" md={{ size: 5, offset: 4 }}>
              <Alert color={color}>{content}</Alert>
            </Col>
          </CardBody>
        </Card>
        </div>
    )
  }
}

export default DeleteProfile;
