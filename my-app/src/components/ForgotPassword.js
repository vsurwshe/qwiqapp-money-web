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

  handleForgotPassword = async (events, values) => {
    this.setState({ disableDoubleClick: true });
    await new SignupApi().forgotPassword(this.successCall, this.errorCall, values.email)

  }

  //when user signup successfull, this method is called ashc@as.com
  successCall = () => {
    this.setState({ disableDoubleClick: false, forgotPassword: true });
    this.callAlertTimer("success", "Thank You! You should receive an email with the reset code .... ")
    // this.form && this.form.reset()
  };

  // when any internal Error occur
  errorCall = error => {
    this.setState({ disableDoubleClick: false, forgotPassword: false });
    if (error.response.status) {
      if (error.response.status === 500) {
        this.callAlertTimer("danger", "Email doesn't exists, please enter valid email...");
      }
    } else {
      this.callAlertTimer("danger", "Unable to Process Request, Please try Again...");
    }
  };

  handleResetCode = (events, values) => {
    this.setState({ disableDoubleClick: true });
    new SignupApi().resetPassword(this.resetSuccessCall, this.resetErrorCall, values.email, values.otp, values.newpwd)
  }

  resetSuccessCall = () => {
    this.setState({ enableLink: true, disableDoubleClick: false });
    this.callAlertTimer("success", "Your password reset Successfully, please login now ...")
    this.form && this.form.reset();
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

  render() {
    const { alertMessage, alertColor, resetCode, forgotPassword } = this.state;
    return <center>
      <Container className="container-top">
        <Card >
          <CardBody>
            <h5 className="padding-top"><b><center> FORGOT / RESET PASSWORD</center></b></h5><br />
            <Col sm="12" md={{ size: 8, offset: 0.5 }} >
              {alertMessage && <Alert color={alertColor}>{alertMessage}</Alert>}
              {this.loadCheckBoxes()}<br /><br />
              {this.loadForgotResetpassword(resetCode, forgotPassword)}
            </Col>
          </CardBody>
        </Card>
      </Container>
    </center>
  }

  // This functions loads the radio buttons
  loadCheckBoxes = () => {
    return <>
      <Label className="text-size" >
        <Input type="checkbox" name="reset" onChange={this.handleCheckbox} checked={this.state.resetCode} />I have a reset code &nbsp;
        </Label>
    </>
  }

  handleCheckbox = () => {
    if (this.state.alertColor !== 'danger') {
      this.setState({
        alertColor: '',
        alertMessage: '',
        resetCode: !this.state.resetCode
      })
    }
  }

  // this functions loads the reset password UI
  loadResetPassword = () => {
    return <>
      <Col><AvField name="otp" placeholder="OTP Code" required onChange={this.handleAlertMessage} /></Col>
      <Col><AvField name="newpwd" type="password" placeholder="New Password" onChange={this.handleAlertMessage} validate={{ minLength: { value: 6 } }} errorMessage="Password must be minimum 6 characters" required /></Col>
      <Col><AvField name="confirmpwd" placeholder="Confirm Password" onChange={this.handleAlertMessage} type="password" validate={{ match: { value: 'newpwd' } }} errorMessage="New password and confirm password doesn't match" required /></Col>
      <center><FormGroup row>
        <Col>
          <Button color="info" disabled={this.state.disableDoubleClick} > Reset Password </Button> &nbsp; &nbsp;
                            <Link to="/login"><Button > Cancel</Button></Link><br /><br />
          {this.state.enableLink && <p className="text-size">Click here to {<Link to="/login"> Login</Link>} Now</p>}
        </Col>
      </FormGroup></center>
    </>
  }

  loadForgotResetpassword = (resetCode, forgotPassword) => {
    return <AvForm onValidSubmit={this.state.resetCode ? this.handleResetCode : this.handleForgotPassword} ref={c => (this.form = c)}>
      <Col ><p style={{ float: 'left' }} >Enter Registered Email ID : </p>
        <AvField name="email" type="email" placeholder="Your Email" errorMessage="Invalid Email Format" className="placeholder-style" 
          onChange={() => this.setState({ alertColor: "", alertMessage: "" })} required />
      </Col>
      <Collapse isOpen={!(resetCode && forgotPassword)}>
        <center><FormGroup row>
          <Col><Button color="info" disabled={this.state.disableDoubleClick} > Forgot Password </Button> &nbsp; &nbsp;
            <Link to="/login"><Button > Cancel</Button></Link>
          </Col>
        </FormGroup></center>
      </Collapse>
      {( resetCode && forgotPassword ) && <Collapse isOpen={true}>  {this.loadResetPassword()}</Collapse> }
    </AvForm>
  }
}

export default ForgotPassword;