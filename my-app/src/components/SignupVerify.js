import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { AvForm, AvField } from "availity-reactstrap-validation";
import { CardHeader, Card, CardBody, Col, Button, Alert } from "reactstrap";
import Config from "../data/Config";
import SignupApi from "../services/SignupApi";
import '../css/style.css'

class SignupVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      color: '#000000',
      redirect: false
    };
  }

  handleSubmit = (event, errors, values) => {
    if (errors.length === 0) {
      const code = values.code;
      new SignupApi().verifySignup(this.successCall, this.errorCall, code);
    }
  }

  successCall = json => {
    this.callAlertTimer("success", "Verified Successfully !")
    this.forceUpdate();
  };

  successResendCode = () =>{
    this.callAlertTimer("info", 'Code resent, please check your email now ...')
  }

  errorCall = error => {
    const response = error && error.response;
    console.log(response);
    // const response = error && error.response ? error.response : '';
    if (response) {
      this.callAlertTimer("danger", "Unable to process, please re-enter your verification code Again....")
    } else {
      this.callAlertTimer("danger", "please check with your network")
    }
    
  }

  callAlertTimer = (color, content) => {
    this.setState({ color, content })
    if (color === "success") {
      setTimeout(() => {
        this.setState({ color: '', content: '', redirect: true })
        window.location.href = "/profiles";
      }, Config.notificationMillis)
    }

  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/profiles" />
    } else {
      return this.loadVerify();
    }
  }

  loadVerify = () => {
    const { color, content } = this.state
    return (
      <div className="animated fadeIn">
        <Card >
          <CardHeader><strong>USER VERIFICATION</strong></CardHeader>
          <CardBody>
            <center>
              <Col sm="6">
                <Alert color={color}>{content}</Alert>
                <AvForm onSubmit={this.handleSubmit}>
                  <AvField type="number" name="code" placeholder="Enter Code sent to your Email" value={color === "danger" && ""} required errorMessage="Please Enter Valid 6-digit Code" onChange={()=>this.clearAlert(color)}></AvField>
                  <button type="button" className='button-hover' onClick={this.resendVerifyCode}>Resend Verification Code</button><br/><br/>
                  <Button color="info" >Verify</Button> &nbsp;&nbsp;&nbsp;
                  <Link to="/profiles"><Button type="button">Cancel</Button></Link>
                </AvForm>
              </Col>
            </center>
          </CardBody>
        </Card>
      </div>
    );
  }

  clearAlert = (color) =>{
    if(color === 'info'){
      this.setState({ color:'', content: '' });
    }
  }

  resendVerifyCode = () =>{
    new SignupApi().resendVerifyCode(this.successResendCode, this.errorCall)
  }
}

export default SignupVerify;