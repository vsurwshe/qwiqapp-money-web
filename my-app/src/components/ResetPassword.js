import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Col, Card, Button, Alert, FormGroup, CardBody, Container, } from 'reactstrap';
import '../css/style.css';
import SignupApi from '../services/SignupApi';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertColor: '',
            content: '',
            disableDoubleClick: false,
            enableLink:false

        };
    }

    handleSubmitValue = (event, errors, values) => {
        if (!errors.length) {
            this.setState({ disableDoubleClick: true });
            new SignupApi().resetPassword(this.successCall, this.errorCall, values.email, values.otp, values.newpwd)
        }
    }

    successCall = () => {
        this.setState({ enableLink: true });        
        this.callAlertTimer("success", "Your password reset Successfully, please login now ...")
    }

    errorCall = (error) => {
        if (error.response.status === 400) {
            this.callAlertTimer("danger", "Expired activation code, already verified or not existing")
        } else if (error.response.status === 500) {
            this.callAlertTimer("danger", "Invalid email, please check your email and try Again ....")
        } else {
            this.callAlertTimer("danger", "unable to process request, please try again ...")
        }
    }

    callAlertTimer = (alertColor, content) => {
        this.setState({ alertColor, content })
    }

    render() {
        const { alertColor, content,disableDoubleClick,enableLink } = this.state;
        return <div >
            <center>
                <Container style={{ paddingTop: 50 }} className="App">
                    <Card >
                        <CardBody>
                            <h4 className="padding-top"><b><center> RESET PASSWORD</center></b></h4><br />
                            <Col sm="12" md={{ size: 8, offset: 0.5 }} >
                                <Alert color={alertColor}>{content}</Alert>
                                <AvForm onSubmit={this.handleSubmitValue}>
                                    <Col><AvField name="email" type="email" placeholder="Email" errorMessage="Invalid Email Format" className="placeholder-style" required /></Col>
                                    <Col><AvField name="otp" placeholder="OTP Code" required /></Col>
                                    <Col><AvField name="newpwd" type="password" placeholder="New Password" validate={{ minLength: { value: 6 } }} errorMessage="Password must be minimum 6 characters" required /></Col>
                                    <Col><AvField name="confirmpwd" placeholder="Confirm Password" type="password" validate={{ match: { value: 'newpwd' } }} errorMessage="New password and confirm password doesn't match" required /></Col>
                                    <center><FormGroup row>
                                        <Col>
                                            <Button color="info" disabled={disableDoubleClick} > Reset Password </Button> &nbsp; &nbsp;
                                            {enableLink && <p>Please go back to {<Link to="/login"> Login</Link>}</p>}
                                        </Col>
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

export default ResetPassword;