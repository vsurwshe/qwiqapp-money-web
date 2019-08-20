import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Card, CardBody, Alert, FormGroup, Button, Container, Col, Input, Label, Collapse } from 'reactstrap';
import SignupApi from '../services/SignupApi';
import '../../src/css/style.css';


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: '',
      alertMessage: '',
      disableDoubleClick: false,
      resetCode: false,
      enableLink: false,
      forgotPassword: true
    };
  }
  componentDidMount() {
    new SignupApi().getToken();
  }

  handleForgotPassword = async (events,values) => {
    this.setState({ disableDoubleClick: true });
    await new SignupApi().forgotPassword(this.successCall, this.errorCall, values.email)
  }

  //when user signup successfull, this method is called ashc@as.com
  successCall = () => {
    this.setState({ disableDoubleClick: false });
    this.callAlertTimer("success", "Thank You !! You should receive an email with the reset code .... ")
  };
  // when any internal Error occur
  errorCall = error => {
    this.setState({ disableDoubleClick: false });
    if (error.response.status) {
      if (error.response.status === 500) {
        this.callAlertTimer("danger", "Email doesn't exists, please enter valid email...");
      }
    } else {
      this.callAlertTimer("danger", "Unable to Process Request, Please try Again...");
    }
  };

  handleResetCode = (events,values) => {
    this.setState({ disableDoubleClick: true });
    new SignupApi().resetPassword(this.resetSuccessCall, this.resetErrorCall, values.email, values.otp, values.newpwd)
  }

  resetSuccessCall = () => {
    this.setState({ enableLink: true, disableDoubleClick: false });
    this.callAlertTimer("success", "Your password reset Successfully, please login now ...")
  }

  resetErrorCall = (error) => {
    this.setState({ disableDoubleClick: false });
    if (error.response.status === 400) {
      this.callAlertTimer("danger", "Expired activation code, already verified or not existing")
    } else if (error.response.status === 500) {
      this.callAlertTimer("danger", "Invalid email, please check your email and try Again ....")
    } else {
      this.callAlertTimer("danger", "unable to process request, please try again ...")
    }
  }

  //this prints onscreen alert
  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
   }

  handleAlertMessage = () => {
    this.callAlertTimer('', '')
  }

  render() {
    const { alertMessage, alertColor } = this.state;
    return <center>
      <Container className="container-top">
        <Card >
          <CardBody>
            <h5 className="padding-top"><b><center> FORGOT/RESET PASSWORD</center></b></h5>
            <Col sm="12" md={{ size: 8, offset: 0.5 }} >
              {alertMessage && <Alert color={alertColor}>{alertMessage}</Alert>}
                {this.loadRadioButtons()}<br /><br />
              <Collapse isOpen={this.state.forgotPassword}>
                {this.loadForgotPassword()}
              </Collapse>
              <Collapse isOpen={this.state.resetCode}>
                {this.loadResetPassword()}
              </Collapse>
            </Col>
          </CardBody>
        </Card>
      </Container>
    </center>
  }

  // This functions loads the radio buttons
  loadRadioButtons = () => {
    return <>
        <Label className="text-size" check>
          <Input type="radio" name="forgot" onChange={this.handleRadioButtons} checked={this.state.forgotPassword} />I don't have a Reset Code
        </Label><br /><br />
        <Label className="text-size" check>
            <Input type="radio" name="reset" onChange={this.handleRadioButtons} checked={this.state.resetCode} />I have a Reset Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Label>
      </>
  }

  handleRadioButtons = () =>{
    this.setState({ 
      resetCode: !this.state.resetCode,
      alertColor:'',
      alertMessage:'',
      forgotPassword: !this.state.forgotPassword 
    })
    this.form && this.form.reset();
  }
  
  // this functions loads the Forget Password UI
  loadForgotPassword = () => {
    return <AvForm onValidSubmit={this.handleForgotPassword} >
      <Col ><p style={{ float: 'left' }} >Enter Registered Email ID : </p><AvField name="email" type="email" onChange={(e)=>this.handleAlertMessage(e)} placeholder="Your Email" errorMessage="Invalid Email Format" className="placeholder-style"
        required /></Col>
      <center><FormGroup row>
        <Col><Button color="info" disabled={this.state.disableDoubleClick} > Forgot Password </Button> &nbsp; &nbsp;
      <Link to="/login"><Button > Cancel</Button></Link>
        </Col>
      </FormGroup></center>
    </AvForm>
  }

  // this functions loads the reset password UI
  loadResetPassword = () => {
    return <AvForm onValidSubmit={this.handleResetCode} ref={cd=>(this.form=cd)}>
      <Col><AvField name="email" type="email" placeholder="Email" onChange={this.handleAlertMessage} errorMessage="Invalid Email Format" className="placeholder-style" required /></Col>
      <Col><AvField name="otp" placeholder="OTP Code" required onChange={this.handleAlertMessage}  /></Col>
      <Col><AvField name="newpwd" type="password" placeholder="New Password" onChange={this.handleAlertMessage}  validate={{ minLength: { value: 6 } }} errorMessage="Password must be minimum 6 characters" required /></Col>
      <Col><AvField name="confirmpwd" placeholder="Confirm Password" onChange={this.handleAlertMessage}  type="password" validate={{ match: { value: 'newpwd' } }} errorMessage="New password and confirm password doesn't match" required /></Col>
      <center><FormGroup row>
        <Col>
          <Button color="info" disabled={this.state.disableDoubleClick} > Reset Password </Button> &nbsp; &nbsp;
                            <Link to="/login"><Button > Cancel</Button></Link><br /><br />
          {this.state.enableLink && <p className="text-size">Click here to {<Link to="/login"> Login</Link>} Now</p>}
        </Col>
      </FormGroup></center>
     </AvForm>
  }
}

export default ForgotPassword;