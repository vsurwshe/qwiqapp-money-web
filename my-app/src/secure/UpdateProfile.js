import React, { Component } from "react";
import { Button, Card,Col, Input, Alert ,CardHeader,FormGroup} from "reactstrap";
import ProfileApi from "../services/ProfileApi";


class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: this.props.name,
      color: "",
      content: "",
      updateSuccess: false
    };
    //this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleUpdate = () => {
    let data = { name: this.state.name };
    new ProfileApi().updateProfile( () => {
        this.setState({ updateSuccess: true });
      }, this.errorCall, data, this.state.id );
  };

  errorCall = err => {
    this.callAlertTimer( "danger", "Something went wrong, Please Try Again... ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      this.setState({ name: '', color: ''});
    }, 4000);
  };

  render() {
    const { name, color, content, updateSuccess } = this.state;
    if (updateSuccess) {
      return <div>{this.loadUpdateMessage()}</div>
    } else {
      return <div>{this.loadUpdatingProfile(name,color,content)}</div>
    }
  }

  //this method call after successfully updtaed profile
  loadUpdateMessage=()=>{
    return(<div className="animated fadeIn">
    <Card>
      <CardHeader>
        <strong>Profile</strong>
      </CardHeader>
      <center style={{paddingTop:'20px'}}>
        <h5><b>Your Profile Updated Successfully !!</b><br /><br />
        <a href="/profiles">View Profile</a></h5>
      </center>
    </Card>
    </div>)
  }

  //this method call when updating profile
  loadUpdatingProfile=(name,color,content)=>{
    return( <div className="animated fadeIn">
    <Card>
      <CardHeader>
        <strong>Profile</strong>
      </CardHeader>
      <center>
               <Alert color={color}>{content}</Alert>
                <FormGroup>
                <h5><b>EDIT PROFILE</b></h5>
                 <Col sm="6">
                <Input type="text" name="profile name" value={name}style={{fontWeight:'bold',color:'#000000'}} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }}/>
                </Col>
                <br />
                <Button color="success" disabled={!name} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
                <a href="/profiles" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a>
                </FormGroup>
               </center>
      
      </Card>
      </div>)
  }
}

export default UpdateProfile;
