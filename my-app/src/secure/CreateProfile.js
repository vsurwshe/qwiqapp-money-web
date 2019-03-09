import React, { Component } from "react";
import {
  Alert,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Container
} from "reactstrap";
import Store from "../data/Store";
import ProfileApi from "../services/ProfileApi";

import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory();

class CreateProfiles extends Component {
  state = {
    name: "",
    userToken: "",
    color: "",
    content: "",
    profileCreated: false
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAccessToken() });
  }

  handleSubmit = e => {
    e.preventDefault();
    const data = { name: this.state.name };
    new ProfileApi().createProfile(
      () => {
        this.setState({ profileCreated: true });
        this.callAlertTimer("success", "New Profile Created!!");
      },
      this.errorCall,
      data
    );
  };

  errorCall = err => {
    this.callAlertTimer("danger", err);
  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      this.setState({ name: "", content: "", color: "" });
    }, 3500);
  };

  render() {
    if (!this.state.profileCreated) {
      return (
            <center>
              <Container style={{ paddingTop: 50 }} className="App">
                <Alert color={this.state.color}>{this.state.content}</Alert>
                <Card >
                  <CardBody>
                    <CardTitle><b>CREATE PROFILE</b></CardTitle><br/>
                    <form>
                      <Input name="name" value={this.state.name} type="text" placeholder="Enter Profile name" autoFocus={true} onChange={e => this.handleInput(e)} /> <br />
                      <Button color="info" disabled={!this.state.name} onClick={e => this.handleSubmit(e)} > {" "} Save{" "} </Button>
                    </form>
                  </CardBody>
                </Card>
              </Container>
            </center>
      );
    } else {
      return (
        <Container>
          <center>
          <h5><b>Profile Created Successfully !!</b> <br /> <br />
            <b><a href="/profiles">View Profile</a></b></h5>
          </center>
        </Container>
      );
    }
  }
}

export default CreateProfiles;
