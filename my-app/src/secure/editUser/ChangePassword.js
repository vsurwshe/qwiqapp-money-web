import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Card, CardBody, CardHeader, Alert, Button, Row, Col, Label, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvField, AvForm, AvInput, AvGroup } from 'availity-reactstrap-validation';
import Config from '../../data/Config';
import UserApi from '../../services/UserApi';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import '../../css/style.css';
import Store from '../../data/Store';
import { userAction } from '../../data/GlobalKeys';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ''
        }
    }
    componentDidMount = () => {
        let user = Store.getUser();
        this.setState({ user: user })
    }

    updatePassword = (event, values) => { //onValidSubmit passing two paramentes(events, values)
        this.setState({ doubleClick: true });
        new UserApi().changePassword(this.changePasswordSuccess, this.changePwdError, values);
    }

    changePasswordSuccess = (resp) => {
        this.callAlert("success", "Password changed Succesfully!!")
    }

    changePwdError = (error) => {
        this.setState({ doubleClick: false })
        const data = (error && error.response) && error.response.data; //error and error.response are there then we are asigning data(error.response.data) to data(field/variable/obj)
        if ( data && data.error && data.error.debugMessage) { // If "data (OR) data.error (OR) data.error.debugMessage" are Falsy values(undefined) else block will executes
            this.callAlert("danger", "You entered wrong password, please enter correct password");
        } else {
            this.callAlert("warning", "Unable to process request, please try again")
        }
    }

    callAlert = (color, content) => {
        this.setState({ color, content });
        if (color === 'success') {
            setTimeout(() => {
                this.setState({ redirectTo: true });
            }, Config.apiTimeoutMillis)
        }
    }

    setChecked = (e) => {
        this.setState({ checked: e.target.value, isOpen: !this.state.isOpen })
    }

    render() {
        const { color, content, redirectTo, user } = this.state;
        let navigateUrl = (user.action === userAction.VERIFY_EMAIL) ? "/profiles" : "/dashboard"
        return redirectTo ? <Redirect to={navigateUrl} style={{ marginLeft: 10 }} ></Redirect> : this.loadChangePassword(color, content)
    }

    // This method call change password form
    loadChangePassword = (color, content) => {
        let type = this.state.isOpen ? "text" : "password"
        return (
            <Card>
                {this.loadHeader()}
                <CardBody>
                    {color && <Alert color={color}>{content}</Alert>}
                    <Col sm={12} md={{ size: 8, offset: 1 }} lg={{ size: 20, offset: 3 }} xl={{ size: 20, offset: 3 }}> {this.loadForm(color, type)} </Col>
                </CardBody>
            </Card>
        );
    }

    // This method loads the header
    loadHeader = () => <CardHeader style={{ height: 60 }}>
        <Row form>
            <Col className="marigin-top"><strong>Change Password</strong></Col>
        </Row>
    </CardHeader>

    // This is loading change Password Form
    loadForm = (color, type) => {
        return <AvForm onValidSubmit={this.updatePassword} >
            <Row>
                <Col sm={3}> <Label>Old password</Label> </Col>
                <Col sm={6}>
                    <AvField name="old" type="password" errorMessage="Enter Correct Password" placeholder="Enter Old Password" value={color === "danger" && ""} required />
                </Col>
            </Row>
            <Row>
                <Col sm={3}> <Label>New password</Label> </Col>
                <Col sm={6}>
                    <AvGroup>
                        <InputGroup>
                            <AvInput name="new" type={type} errorMessage="New Password Required" placeholder="Enter  New Password" required />
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>{this.state.isOpen ? <FaEye onClick={this.setChecked} /> : <FaEyeSlash onClick={this.setChecked} />}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </AvGroup>
                </Col>
            </Row>
            <Row>
                <Col sm={3}><Label>Confirm password</Label></Col>
                <Col sm={6}><AvField name="renew" type="password" errorMessage="New password and confirm password doesn't match" placeholder="Enter  New Password"
                    validate={{ match: { value: 'new' } }} required />
                </Col>
            </Row>
            <Row>
                <Col sm={3}></Col>
                <Col sm={6}>
                    <Button color="success" disabled={this.state.doubleClick}>Edit</Button>
                    <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="secondary" type="button" >Cancel</Button></Link>
                </Col>
            </Row>
        </AvForm>
       
        
    }
}

export default ChangePassword;