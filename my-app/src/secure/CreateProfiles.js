import React, { Component } from "react";
import {
  Alert,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  Row,
  Col
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
    content: ""
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAppUserAccessToken() });
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log("Profile Name ", this.state.name);
    const data = {
      name: this.state.name
    };

    new ProfileApi().createProfile(
      () => {
        this.callAlertTimer("success", "New Profile Created!!");
      },
      this.errorCall,
      data
    );
  };

  errorCall = err => {
    console.log("Calling Error Functions");
    this.callAlertTimer("danger", err);
  };

  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });

    setTimeout(() => {
      this.setState({ color: "", content: "" });
      browserHistory.push("/dashboard");
      window.location.reload();
    }, 2000);
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <Alert color={this.state.color}>{this.state.content}</Alert>
                <CardTitle>Create User Profiles</CardTitle>
                <form>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Enter Profile name"
                    onChange={e => this.handleInput(e)}
                  />
                  <br />
                  <Button color="info" onClick={e => this.handleSubmit(e)}>
                    Save
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateProfiles;
