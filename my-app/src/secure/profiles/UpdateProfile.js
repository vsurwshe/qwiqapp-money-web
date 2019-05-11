import React, { Component } from "react";
import { Button, Card,Col, Input, Alert ,CardHeader,FormGroup} from "reactstrap";
import ProfileApi from "../../services/ProfileApi";
import Profiles from "./Profiles";


class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      color: "",
      content: "",
      updateSuccess: false
    };
    //this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleUpdate = () => {
    let data = { name: this.state.name };
    new ProfileApi().updateProfile( this.successCall, this.errorCall, data, this.state.id );
  };

  successCall = () =>{
    this.callAlertTimer( "success", "Profile Updated Succesfully!");
  }

  errorCall = err => {
    this.callAlertTimer( "danger", "Unable to Process Request, Please Try Again!! ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      this.setState({ name : '', color : '', updateSuccess : true});
      window.location.reload();
    }, 2000);
  };

  render() {
    const { name, color, content, updateSuccess } = this.state;
    return <div>{updateSuccess ? <Profiles /> : this.loadUpdateProfile(name,color,content)}</div>
  }

  loadHeader = () => <CardHeader><strong>Profile</strong></CardHeader>

  //this method called after successfully updating profile
  loadUpdateMessage = () =>{
    return(
      <div className="animated fadeIn">
        <Card>
         {this.loadHeader()}
          <center style={{paddingTop:'20px'}}>
            <h5><b>Your Profile Updated Successfully !!</b><br /><br />
            <a href="/profiles">View Profile</a></h5>
          </center>
        </Card>
    </div>)
  }

  //this method called when updating profile
  loadUpdateProfile = (name, color, content) =>{
    return( 
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center>
            <Alert color={color}>{content}</Alert>
            <FormGroup>
              <h5><b>EDIT PROFILE</b></h5>
              <Col sm="6">
                <Input type="text" name="profile name" value={name} style={{ fontWeight: 'bold', color: '#000000' }} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }} />
              </Col>
              <br />
              <Button color="success" disabled={!name} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
              <a href="/profiles" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
            </FormGroup>
          </center>
        </Card>
      </div>)
  }
}

export default UpdateProfile;
