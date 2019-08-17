import React, { Component } from 'react';
// import {Redirect} from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Card, CardBody, Alert, FormGroup, Button, Container, Col } from 'reactstrap';
import SignupApi from '../services/SignupApi';
import Config from '../data/Config';


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: '',
      alertMessage: '',
      otpSent: false,
      disableDoubleClick: false
    };
  }

  componentDidMount() {
    new SignupApi().getToken();
  }

  handleSubmit = async (events, errors, values) => {
    if (!errors.length) {
      this.setState({ disableDoubleClick: true });
      await new SignupApi().forgotPassword(this.successCall, this.errorCall, values.email)
    }
  }

  //when user signup successfull, this method is called ashc@as.com
  successCall = () => {
    this.callAlertTimer("success", "Succesfull !! Please check your email for reset code .... ")
  };

  // when any internal Error occur
  errorCall = error => {
    if (error.response.status) {
      if (error.response.status === 500) {
        this.callAlertTimer("danger", "Email doesn't exists, please enter your registered email...");
      }
    } else {
      this.callAlertTimer("danger", "Unable to Process Request, Please try Again...");
    }
  };

  //this prints onscreen alert
  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    if (alertColor === "success") {
      setTimeout(async () => {
        await this.setState({ alertColor: '', alertMessage: '', otpSent: true })
      }, Config.apiTimeoutMillis)
    }
  }

  render() {
    const { alertMessage, alertColor, otpSent } = this.state;
    // TODO: Redirect to reset password functionality
    if (otpSent) {
      // return <Redirect to="/passwd/reset"/>
      return <div>Redirected to Reset Password</div>
    } else {
      return <div>
        <center>
          <Container className="container-top">
            <Card >
              <CardBody>
                <h4 className="padding-top"><b><center> FORGOT PASSWORD</center></b></h4><br />
                <p>Enter your email address below and we'll send you a otp code to reset your password.</p>
                <Col sm="12" md={{ size: 8, offset: 0.5 }} >
                  <Alert color={alertColor}>{alertMessage}</Alert>
                  <AvForm onSubmit={this.handleSubmit}>
                    <Col><AvField name="email" type="email" placeholder="your register email" errorMessage="Invalid Email Format" className="placeholder-style"
                      onChange={() => this.setState({ alertColor: '', alertMessage: '' })} required /></Col>
                    <center><FormGroup row>
                      <Col><Button color="info" disabled={this.state.disableDoubleClick} > Forgot Password </Button> &nbsp; &nbsp;</Col>
                    </FormGroup></center>
                  </AvForm>
                </Col>
              </CardBody>
            </Card>
          </Container>
        </center>
      </div>
    }
  }
}

export default ForgotPassword;