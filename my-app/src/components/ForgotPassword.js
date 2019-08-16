import React, { Component } from 'react';
// import {Redirect} from 'react-router-dom';
import { Card, CardBody, Alert, CardTitle, Label, FormGroup, Input, FormFeedback, Button } from 'reactstrap';
import SignupApi from '../services/SignupApi';
import Config from '../data/Config';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      color: '',
      content: '',
      emailAlert: false,
      validate: {
        emailState: ''
      },
      otpSent: false,

    };
  }
  //This method sets the input fields value into state variable
  handleInput = e => {
    this.validateEmail(e);
    this.setState({ [e.target.name]: e.target.value });
  };

  //when pressed 'enter' key, this method will be called
  handleEnter = (event) => {
    if (event.key === 'Enter') { this.handleSubmit(event); }
  }


  handleSubmit = e => {
    e.preventDefault();
    new SignupApi().forgotPassword(this.successForgot, this.errorForgot, this.state.email)
  };

  successForgot = () => {
    console.log("OTP Success");
    this.callAlertTimer("success", "OTP sent to your Email, Please check ...")
  }

  errorForgot = () => {
    console.log("Failed to sent OTP");
  }

  //when user signup successfull, this method is called
  successCall = () => {
    this.callAlertTimer("success", "Succesfull! Please check your email for reset code")
  };

  

  // when any internal Error occur
  errorCall = err => {
    this.callAlertTimer("danger", "Unable to Process Request, Please try Again...");
  };

  //this prints onscreen alert
  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    if (color === "success") {
      setTimeout(async () => {
        await this.setState({ color: '', content: '', otpSent: true })
      }, Config.apiTimeoutMillis)
    }
  }

  // user entered email validing
  validateEmail = e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    let email = e.target.value;
    let data = { email: e.target.value };
    if (emailRex.test(email)) {
      validate.emailState = 'success'
      new SignupApi().existsUser(this.successCallCheck, this.errorCallCheck, data)
      this.forceUpdate();
    } else {
      this.setState({ emailAlert: false })
      validate.emailState = 'danger'
    }
    this.setState({ validate });
  }
//When Email Already Exists
successCallCheck = (response) => {
  
  if (response.data) {
    const { validate } = this.state;
    validate.emailState = 'success'; 
    this.setState({ emailAlert: true });
  }
}
//if Email not exists
errorCallCheck = err => {
  const { validate } = this.state;
      validate.emailState = 'danger';
};

  render() {
    const requiredLabel = { color: 'red' }
    const align = { textAlign: "left" }
    const { emailState } = this.state.validate
    const { email, content, color, emailAlert, otpSent } = this.state;
    if (otpSent) {
      // return <Redirect to="/passwd/reset"/>
      return <div>Reset Password</div>
    } else {
      return <div>{this.forgotpwdForm(requiredLabel, align, emailState, email, content, color, emailAlert)}</div>
    }
  }

  forgotpwdForm = (requiredLabel, align, emailState, email, content, color, emailAlert) => {
    console.log("email state =", emailState);
    return <div style={{ paddingTop: 50 }} className="animated fadeIn">
      <center>
        <Card style={{ width: 400, border: 0 }}>
          <CardBody>
            <Alert color={color}>{content}</Alert>
            <center>
              <CardTitle style={{ color: "teal" }}> Forgot Password </CardTitle> <br />
              <p>Enter your email address below and we'll send you a link to reset your password.</p>
            </center>
            <FormGroup style={align}>
              <Label style={{ align }} for="Email">Email <span style={requiredLabel}>*</span></Label>
              <Input name="email" type="email" placeholder="Your Email" value={email} valid={emailState === 'success'}
                invalid={emailState === 'danger'} onChange={e => { this.handleInput(e) }} />
              <FormFeedback > {!emailAlert && "Uh oh! Incorrect email"}
              </FormFeedback>
            </FormGroup>
            <center>
              <Button color="info" disabled={!email || (emailAlert && emailState === 'danger')} onClick={e => this.handleSubmit(e)}> ForgotPassword </Button><br />
            </center>
          </CardBody>
        </Card>
      </center>
    </div>
  }
}

export default ForgotPassword;