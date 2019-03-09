import React, { Component } from "react";
import { Container, Button, Card, CardBody, Input, Alert } from "reactstrap";
import ProfileApi from "../services/ProfileApi";

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: "",
      color: "",
      content: "",
      updateSuccess: false
    };
    this.handleUpdate = this.handleUpdate.bind(this);
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
      return (
        <Container>
          <center>
            <h5><b>Your Profile Updated Successfully !!</b><br /><br />
            <a href="/profiles">View Profile</a></h5>
          </center>
        </Container>
      );
    } else {
      return (
          <Container>
            <center>
              <h5><b>EDIT PROFILE</b></h5>
              <Card >
                <CardBody>
                    <Alert color={color}>{content}</Alert>
                    <form>
                    <Input type="text" name="profile name" value={name} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }}/>
                    <br />
                    <Button color="success" disabled={!name} onClick={this.handleUpdate} > {" "} Update Profile{" "} </Button>
                    </form>
                </CardBody>
              </Card> 
            </center>
          </Container>
      );
    }
  }
}

export default UpdateProfile;
