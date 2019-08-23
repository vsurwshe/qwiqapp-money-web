import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Alert, Button } from 'reactstrap';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import { AvField, AvForm } from 'availity-reactstrap-validation';
import UserApi from '../../services/UserApi';
import Config from '../../data/Config';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '',
            content: '',
            doubleClick: false,
        }
    }

    updatePassword = (event, error, values) => {
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

    render() {
        const { color, content, } = this.state;
        return this.loadChangePassword(color, content)
    }

    loadChangePassword = (color, content) => {
        return (
            <Card>
                <CardHeader><b>CHANGE PASSWORD</b></CardHeader>
                <CardBody>
                    {color === "success" ? <><Alert color={color}>{content}</Alert>
                        {this.state.redirectTo && <Redirect to="/dashboard" style={{ marginLeft: 10 }} ></Redirect>}
                    </> : <>
                            {(color !== "success" || color) && <Alert color={color}>{content}</Alert>}
                            <AvForm onSubmit={this.updatePassword} >
                                <AvField name="old" type="password" label="Old Password" errorMessage="Enter Correct Password" placeholder="Enter Old Password" value={color === "danger" && ""} required />
                                <AvField name="new" type="password" label="New Password" errorMessage="New Password Required" placeholder="Enter  New Password" required />
                                <center>
                                    <Button color="success" disabled={this.state.doubleClick}>Edit</Button>
                                    <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="secondary" type="button" >Cancel</Button></Link>
                                </center>
                            </AvForm></>
                    }
                </CardBody>
            </Card>
        );
    }

    loadResponse = (content) => {
        return <Card>
            <CardHeader><b>CHANGE PASSWORD</b></CardHeader>
            <CardBody>
                <center style={{ color: 'green' }}>{content} <br /><br />
                </center> </CardBody>
        </Card>
    }
}

export default ChangePassword;