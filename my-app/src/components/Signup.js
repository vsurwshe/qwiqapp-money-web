import React from "react";
import Loader from 'react-loader-spinner';
import { createBrowserHistory } from "history";
import { Container, Alert, Label, Button, Input, Card, CardBody, CardTitle, FormGroup, FormFeedback } from "reactstrap";
import { Link } from "react-router-dom";
import SignupApi from "../services/SignupApi";
import LoginApi from "../services/LoginApi";
import Store from "../data/Store";
import Config from "../data/Config";
import '../css/style.css';


const browserHistory = createBrowserHistory();
class Signup extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    flag: true,
    color: '',
    content: '',
    emailAlert: false,
    validate: {
      emailState: '',
      passwordState: ''
    }
  };

  //This method sets the input fields value into state variable
  handleInput = e => {
    if (e.target.name === "email") {
      this.validateEmail(e);
    } else if (e.target.name === "password") {
      this.validatePassword(e);
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  //when pressed 'enter' key, this method will be called
  handleEnter = (event) => {
    if (event.key === 'Enter') { this.handleSubmit(event); }
  }


  handleSubmit = e => {
    e.preventDefault();
    const data = { name: this.state.name, email: this.state.email, password: this.state.password };
    if (!this.state.name) {
      this.callAlertTimer("danger", "Name should not be empty")
    } else if (this.state.password.length > 5) {
      new SignupApi().registerUser(this.successCall, this.errorCall, data);
    }
  };

  //when user signup successfull, this method is called
  successCall = () => {
    this.callAlertTimer("success", "Succesfull! Please Check your Email for Activation Link")
  };

  //When Email Already Exists
  successCallCheck = (emailExist) => {
    const { validate } = this.state;
    validate.emailState = 'danger'; this.setState({ emailAlert: true });
    if (emailExist) {
      this.emptyPwd();
    }
  };
  emptyPwd = () => {
    this.setState({ password: '', validate: { passwordState: "danger", emailState: "danger" } });
  }
  // when any internal Error occur
  errorCall = err => {
    if (!err.response.data && err.response.status === 400) {
      this.callAlertTimer("danger", "Your email is alredy register with us, please login or use another email for register");
    } else {
      this.callAlertTimer("danger", "Unable to Process Request, Please try Again...");
    }
  };

  //if Email not exists
  errorCallCheck = err => {
    const { validate } = this.state;
    validate.emailState = 'danger'
  };

  //this prints onscreen alert
  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    if (color === "success") {
      setTimeout(async () => {
        await this.setState({ color: '', content: '', flag: false })
        new LoginApi().login(this.state.email, this.state.password, this.loginSuccessCall, this.errorCall)
      }, Config.apiTimeoutMillis)
    }

  };

  loginSuccessCall = () => {
    browserHistory.push("/profiles");
    Store.clearDummyAccessToken();
    window.location.reload();
  }

  //this method checks user entered email is in valid format or not
  validateEmail = e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    let email = e.target.value;
    if (emailRex.test(email)) {
      validate.emailState = 'success'
      this.forceUpdate()
    } else {
      this.setState({ emailAlert: false })
      validate.emailState = 'danger'
    }
    this.setState({ validate });
  };

  //validate the user entered password 
  validatePassword = e => {
    const { validate } = this.state
    if (e.target.value.length > 5) {
      validate.passwordState = 'success'
    } else {
      validate.passwordState = 'danger'
    }
    this.setState({ validate })
  }

  handleFocusOutEvent = () => {
    new SignupApi().existsUser(this.successCallCheck, this.errorCallCheck, { email: this.state.email });
  }
  render() {
    const { emailState, passwordState } = this.state.validate
    const { name, email, password, content, color, flag, emailAlert } = this.state
    if (Store.isAppUserLoggedIn()) {
      return (
        <div>
          <Container style={{ padding: 20 }} classmail="App">
            <h3>
              You have already Signedup with WebMoney. Go to
              <Link to="/dashboard"> Dashboard </Link>
            </h3>
            <br />
          </Container>
        </div>
      );
    }
    else if (flag) {
      return <div>{this.loadSignupComponent(emailState, passwordState, name, email, password, content, color, emailAlert)}</div>
    } else {
      return (
        <Container style={{ paddingTop: "20%" }} className="App" >
          <Card style={{ padding: 40, border: 0, textAlign: "center" }}> <p><b>You are Succesfully Registered with Web Money !!<br />
            <Loader type="TailSpin" color="#2E86C1" height={60} width={60} />
            <br />Redirecting you to Login !</b></p>
            <br /> <br />
          </Card>
        </Container>
      )
    }
  }

  loadSignupComponent = (emailState, passwordState, name, email, password, content, color, emailAlert) => {
    let buttonDissabled = !password || (emailAlert && emailState === 'danger');
    return (<div style={{ paddingTop: 50 }} className="animated fadeIn">
      <center>
        <Card style={{ width: 400, border: 0 }}>
          <CardBody>
            <Alert color={color}>{content}</Alert>
            <center>
              <CardTitle style={{ color: "teal" }}> Create a Web Money Account </CardTitle> <br />
            </center>
            <FormGroup className="row-text-align">
              <Label for="Name">Name <span className="text-color">*</span></Label>
              <Input name="name" type="text" placeholder="Your Name" value={name} onChange={e => this.handleInput(e)} />
            </FormGroup>
            <FormGroup className="row-text-align">
              <Label for="Email">Email <span className="text-color">*</span></Label>
              <Input name="email" type="email" placeholder="Your Email" value={email} valid={emailState === 'success'}
                invalid={emailState === 'danger'} onChange={e => { this.handleInput(e) }} onBlur={this.handleFocusOutEvent} />
              <FormFeedback > {emailAlert ? "Email already Exists, try another Email..." : "Uh oh! Incorrect email"}
              </FormFeedback>
            </FormGroup>
            <FormGroup className="row-text-align">
              <Label for="password">Password <span className="text-color">*</span></Label>
              <Input name="password" type="password" placeholder="Your password" onChange={e => { this.handleInput(e) }}
                onKeyPress={this.handleEnter} disabled={!email || emailState === 'danger'} valid={passwordState === 'success'} invalid={passwordState === 'danger'} value={password} />
              <FormFeedback > Password length must be more then 5 characters </FormFeedback>
            </FormGroup>
            <center>
              <Button color="info" disabled={buttonDissabled} onClick={e => this.handleSubmit(e)}> Signup </Button>
              <CardBody>
                <span> I already have an Account. </span>
                <Link to="/login"> Login Now </Link>
              </CardBody>
            </center>
          </CardBody>
        </Card>
      </center>
    </div>)
  }
}

export default Signup;
