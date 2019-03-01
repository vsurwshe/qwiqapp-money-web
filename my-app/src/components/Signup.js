import React from "react";
import {
  Container,
  Alert,
  Label,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  FormFeedback
} from "reactstrap";
import { Link } from "react-router-dom";
import SignupApi from "../services/SignupApi";
class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    adminToken: "",
    flag: true,
    color: "",
    content: "",
    validate: {
      emailState: "",
      passwordState: ""
    }
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state.email + " " + this.state.password);
    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    new SignupApi().registerUser(this.successCall, this.errorCall, data);
  };

  successCall = json => {
    this.callAlertTimer(
      "success",
      "Succesfull! Please Check your Email for Activation Link"
    );
  };

  errorCall = err => {
    this.callAlertTimer("danger", "Internal Error");
  };

  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
    if (
      color === "success" &&
      content === "Succesfull! Please Check your Email for Activation Link"
    ) {
      setTimeout(() => {
        this.setState({ color: "", content: "", flag: false });
      }, 2000);
    } else {
      setTimeout(() => {
        this.setState({ color: "", content: "", email: "" });
      }, 4000);
    }
  };

  validateEmail = e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    let email = e.target.value;
    let data = {
      email: e.target.value
    };
    if (emailRex.test(email)) {
      new SignupApi().existsUser(
        () => {
          this.callAlertTimer("success", "User Already exists!");
        },
        () => {
          validate.emailState = "danger";
        },
        data
      );
    } else {
      validate.emailState = "danger";
    }
    this.setState({ validate });
  };

  validatePassword = e => {
    const { validate } = this.state;
    if (e.target.value.length >= 4) validate.passwordState = "success";
    else validate.passwordState = "danger";
    this.setState({ validate });
  };

  render() {
    var style = {
      color: "red"
    };

    if (this.state.flag) {
      return (
        <div>
          <center>
            <Container style={{ paddingTop: 50 }} className="App">
              <Card style={{ width: 400, border: 0 }}>
                <CardBody>
                  <Alert color={this.state.color}>{this.state.content}</Alert>
                  <center>
                    <CardTitle style={{ color: "teal" }}>
                      Create an Account
                    </CardTitle>
                    <br />
                  </center>
                  <FormGroup style={{ textAlign: "left" }}>
                    <Label for="Name">
                      Name <span style={style}>*</span>
                    </Label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      value={this.state.name}
                      onChange={e => this.handleInput(e)}
                      required
                    />
                  </FormGroup>
                  <FormGroup style={{ textAlign: "left" }}>
                    <Label style={{ textAlign: "left" }} for="Email">
                      Email <span style={style}>*</span>
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={this.state.email}
                      onChange={e => {
                        this.handleInput(e);
                        this.validateEmail(e);
                      }}
                      required
                      valid={this.state.validate.emailState === "success"}
                      invalid={this.state.validate.emailState === "danger"}
                    />
                    <FormFeedback invalid>Uh oh! Incorrect email.</FormFeedback>
                  </FormGroup>
                  <FormGroup style={{ textAlign: "left" }}>
                    <Label for="password">
                      Password <span style={style}>*</span>
                    </Label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Your password"
                      value={this.state.password}
                      onChange={e => {
                        this.handleInput(e);
                        this.validatePassword(e);
                      }}
                      // onKeyPress = {this.handleEnter}
                      required
                      valid={this.state.validate.passwordState === "success"}
                      invalid={this.state.validate.passwordState === "danger"}
                    />
                    <FormFeedback invalid tooltip>
                      Password length must be minimum 6 characters
                    </FormFeedback>
                  </FormGroup>
                  <center>
                    <Button color="info" onClick={this.handleSubmit}>
                      Signup
                    </Button>
                    <CardBody>
                      <span>I already have an Account. </span>
                      <Link to="/login">Login Now </Link>
                    </CardBody>
                  </center>
                </CardBody>
              </Card>
            </Container>
          </center>
        </div>
      );
    } else {
      return (
        <Container>
          <Card>
            {" "}
            <p>Please Check your Email for Activation Link!</p>
          </Card>
        </Container>
      );
    }
  }
}

export default Signup;
