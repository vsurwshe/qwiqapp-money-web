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
      this.setState({ color: "", content: "", name: "" });
    }, 4000);
  };

  render() {
    if (!this.state.profileCreated) {
      return (
        <div className="container-fluid">
          <div className="flex-xl-nowrap row">
            {/* <Sidemenu/> */}
            <center>
              <Container style={{ paddingTop: 50 }} className="App">
                <Alert color={this.state.color}>{this.state.content}</Alert>
                <Card style={{ width: 400 }}>
                  <CardBody>
                    <CardTitle>Create Profile</CardTitle>
                    <form>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter Profile name"
                        onChange={e => this.handleInput(e)}
                      />
                      <br />
                      <Button
                        color="info"
                        disabled={!this.state.name}
                        onClick={e => this.handleSubmit(e)}
                      >
                        {" "}
                        Save{" "}
                      </Button>
                    </form>
                  </CardBody>
                </Card>
              </Container>
            </center>
          </div>
        </div>
      );
    } else {
      return (
        <Container>
          <center>
            <b>Profile Created Successfully !!</b>
            <br />
            <br />
            <a href="/profiles">View Profile</a>
          </center>
        </Container>
      );
    }
  }
}

export default CreateProfiles;
