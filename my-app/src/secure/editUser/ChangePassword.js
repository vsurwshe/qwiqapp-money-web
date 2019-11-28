import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Card, CardBody, CardHeader, Alert, Button, Row, Col, Label, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvField, AvForm, AvInput, AvGroup } from 'availity-reactstrap-validation';
import Config from '../../data/Config';
import UserApi from '../../services/UserApi';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import '../../css/style.css';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '',
            content: '',
            doubleClick: false,
            checked: 'true',
            isOpen: false
        }
    }

    updatePassword = (event, error, values) => {
        //console.log(values.pwd, "===", values.show);
        if (error.length === 0) {
            this.setState({ doubleClick: true });
            new UserApi().changePassword(this.changePasswordSuccess, this.changePwdError, values);
        }
    }

    changePasswordSuccess = (resp) => {
        this.callAlert("success", "Password changed Succesfully!!")
    }

    changePwdError = (err) => {
        this.setState({ doubleClick: false })
        if (err !== 'Wrong password supplied.') {
            this.callAlert("warning", "Unable to process request, Please Try again")
        } else {
            this.callAlert("danger", "You entered wrong password, Please Enter correct password")
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
        const { color, content, } = this.state;
        return this.loadChangePassword(color, content)
    }

    loadChangePassword = (color, content) => {
        let type = this.state.isOpen ? "text" : "password"
        return (
            <Card>
                <CardHeader><b>CHANGE PASSWORD</b></CardHeader>
                <CardBody>
                    {color === "success" ? <><Alert color={color}>{content}</Alert>
                        {this.state.redirectTo && <Redirect to="/dashboard" style={{ marginLeft: 10 }} ></Redirect>}
                    </> : <>
                            {(color !== "success" || color) && <Alert color={color}>{content}</Alert>}
                            <AvForm onSubmit={this.updatePassword} >
                                <Row>
                                    <Col sm={2}> <Label>Old password</Label> </Col>
                                    <Col sm={4}>
                                        <AvField name="old" type="password" errorMessage="Enter Correct Password" placeholder="Enter Old Password" value={color === "danger" && ""} required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={2}> <Label>New password</Label> </Col>
                                    <Col sm={4}>
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
                                    <Col sm={2}><Label>Confirm password</Label></Col>
                                    <Col sm={4}><AvField name="renew" type="password" errorMessage="New password and confirm password doesn't match" placeholder="Enter  New Password"
                                        validate={{ match: { value: 'new' } }} required />
                                    </Col>
                                </Row>
                                <center>
                                    <Button color="success" disabled={this.state.doubleClick}>Edit</Button>
                                    <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="secondary" type="button" >Cancel</Button></Link>
                                </center>
                            </AvForm>
                        </>
                    }
                </CardBody>
            </Card>
        );
    }
}

export default ChangePassword;