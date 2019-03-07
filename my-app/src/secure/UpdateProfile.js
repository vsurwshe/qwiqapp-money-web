import React, { Component } from "react";
import {
  Container,
  Button,
  Card,
  CardBody,
  Input,
  Alert,
  CardTitle
} from "reactstrap";
import ProfileApi from "../services/ProfileApi";
import { createBrowserHistory } from "history";
import { Link } from "react-router";

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
    new ProfileApi().updateProfile(
      () => {
        this.setState({ updateSuccess: true });
      },
      this.errorCall,
      data,
      this.state.id
    );
  };

  errorCall = err => {
    this.callAlertTimer(
      "danger",
      "Something went wrong, Please Try Again...  "
    );
  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      this.setState({ name: "", color: "" });
    }, 4000);
  };

  render() {
    const { name, color, content, updateSuccess } = this.state;
    if (updateSuccess) {
      return (
        <Container>
          <center>
            <b>Your Profile Updated Successfully !!</b>
            <br />
            <br />
            <a href="/profiles">View Profile</a>
          </center>
        </Container>
      );
    } else {
      return (
        <div style={{ paddingTop: "10" }}>
          <Container>
            <Card style={{ border: 0 }}>
              <CardBody>
                <center>
                  <Alert color={color}>{content}</Alert>
                  <p>Edit Profile</p>
                  <Input
                    type="text"
                    name="profile name"
                    value={name}
                    onChange={e => {
                      this.setState({ name: e.target.value });
                    }}
                    style={{ width: "60%" }}
                  />
                  <br />
                  <Button
                    color="success"
                    disabled={!name}
                    onClick={this.handleUpdate}
                  >
                    {" "}
                    Update Profile{" "}
                  </Button>
                </center>
              </CardBody>
            </Card>
          </Container>
        </div>
      );
    }
  }
}

export default UpdateProfile;
