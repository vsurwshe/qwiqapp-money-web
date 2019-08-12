import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { AvForm, AvField } from "availity-reactstrap-validation";
import { CardHeader, Card, CardBody, Col, Button, Alert } from "reactstrap";
import Config from "../data/Config";
import SignupApi from "../services/SignupApi";

class SignupVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      color: '',
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

  errorCall = err => {
    this.callAlertTimer("danger", "Unable to process, Please Re-Enter your Verification code Again....")
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
                  <AvField type="number" name="code" placeholder="Enter Code sent to your Email" value={color === "danger" && ""} required errorMessage="Please Enter Valid 6-digit Code"></AvField>
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
}

export default SignupVerify;