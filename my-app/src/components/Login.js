import React, { Component } from "react";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Container,Button,Input,Card,CardBody,CardTitle,FormFeedback,Alert,FormGroup} from "reactstrap";
import LoginApi from "../services/LoginApi";
import Store from "../data/Store";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      color: "",
      content: "",
      validate: {
        emailState: "",
        passwordState: ""
      }
    };
  }

  handleEvent = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleEnter = event => {
    if (event.key === "Enter" && event.keyCode === 0) {
      this.handleButton();
    }
  };
  handleButton = event => {
    if (this.state.email === "" || this.state.password === "") {
      this.callAlertTimer("danger", "Please Enter Username/Password");
    } else {
      new LoginApi().login(
        this.state.email,
        this.state.password,
        () => {
          browserHistory.push("/dashboard");
          Store.clearDummyAccessToken();
          window.location.reload();
        },
        () => {
          this.callAlertTimer("danger", "Incorrect Username/Password");
        }
      );
    }
  };

  resetData() {
    this.setState({
      email:'',
      password:'',
      validate :{
        emailState:'',
        passwordState:''
      }
    })
  }

  callAlertTimer(color, content) {
    this.setState({
      color: color,
      content: content
    });
    this.resetData();
    setTimeout(() => this.setState({ color: "", content: "" }), 5000);
  }

  validateEmail = e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
      if (emailRex.test(e.target.value)) { validate.emailState = 'success' }
      else { validate.emailState = 'danger'; }
      this.setState({ validate })
  }

  render() {
    const {emailState} = this.state.validate;
    if (Store.isAppUserLoggedIn()) {
      return (
        <div>
          <Container style={{ padding: 20 }} classmail="App">
            <h3>
              Already loggedin. Go to
              <Link to="/dashboard"> Dashboard </Link>
            </h3>
            <br />
          </Container>
        </div>
      );
    } else {
      return (
        <div style={{ color: "teal" }}>
          <center>
            <Container style={{ paddingTop: 50 }} className="App">
              <Alert color={this.state.color}>{this.state.content}</Alert>
              <Card style={{ width: 300, borderRadius: 8 }}>
                <CardBody>
                  <CardTitle>Welcome Back!</CardTitle>
                  <br />
                  <FormGroup>
                  <Input name="email" type="email" placeholder="Your Email" value={this.state.email} valid={ emailState === 'success' }
                      invalid={ emailState === 'danger'} onChange={ (e) => { this.validateEmail(e);this.handleEvent(e) }} />
                  <FormFeedback> Uh oh! Incorrect email. </FormFeedback>  
                  </FormGroup>
                  <FormGroup>
                   <Input type="password"  name="password" onChange={(e) => { this.handleEvent(e)}}
                   onKeyPress={this.handleEnter} placeholder="Your Password" value={this.state.password} /> 
                  </FormGroup>
                  <Button color="info" onClick={this.handleButton}>
                    Login
                  </Button>
                </CardBody>
                <CardBody>
                  <span>Don't have an Account yet? </span>&nbsp;
                  <br />
                  <Link to="/signup">Signup Now</Link>
                </CardBody>
              </Card>
            </Container>
          </center>
        </div>
      );
    }
  }
}

const browserHistory = createBrowserHistory();

export default Login;
