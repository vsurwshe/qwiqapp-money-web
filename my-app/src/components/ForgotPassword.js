import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { AvForm, AvField} from 'availity-reactstrap-validation';
import { Card, CardBody, Alert, FormGroup, Button, Container, Col, Input, Label,Collapse } from 'reactstrap';
import SignupApi from '../services/SignupApi';
import Config from '../data/Config';


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: '',
      alertMessage: '',
      otpSent: false,
      disableDoubleClick: false,
      resetCode: false
    };
  }

  componentDidMount() {
    new SignupApi().getToken();
  }

  handleSubmit = async (events, errors, values) => {
    if (!errors.length) {
      this.setState( { disableDoubleClick:true});
      await new SignupApi().forgotPassword(this.successCall, this.errorCall, values.email)
    }
  }

  //when user signup successfull, this method is called ashc@as.com
  successCall = () => {
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
      return <div>
        <center>
          <Container className="container-top">
            <Card >
              <CardBody>
                <h5 className="padding-top"><b><center> FORGOT/RESET PASSWORD</center></b></h5>
                <Col sm="12" md={{ size: 8, offset: 0.5 }} >
                  <Alert color={alertColor}>{alertMessage}</Alert>
                      <Label check style={{color:'green'}}>
                        <Input type="checkbox" name="reset" onClick={()=>this.setState({resetCode:!this.state.resetCode})}/>I have a Reset Code
                      </Label><br/><br/>
                  <AvForm onSubmit={this.handleSubmit}>
                    <Col ><p style={{float:'left'}} >Enter Registered Email ID : </p><AvField name="email" type="email" disabled={otpSent} placeholder="Your Email" errorMessage="Invalid Email Format" className="placeholder-style"
                      onChange={() => this.setState({ alertColor: '', alertMessage: '' })} required /></Col>
                    <center><FormGroup row>
                      <Col><Button color="info" disabled={this.state.disableDoubleClick} > Forgot Password </Button> &nbsp; &nbsp;
                      <Link to="/login"><Button > Cancel</Button></Link>
                      </Col>
                    </FormGroup></center>
                  </AvForm>
                  <Collapse isOpen={this.state.resetCode}>
                      <h5>Reset Fields Called </h5>
                  </Collapse>
                </Col>
              </CardBody>
            </Card>
          </Container>
        </center>
      </div>
    }
}

export default ForgotPassword;