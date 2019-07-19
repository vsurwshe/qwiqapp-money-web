import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import UserApi from '../../services/UserApi';
import Config from '../../data/Config';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordUpdated: false,
            color: '',
            content: '',
        }
    }

    updatePassword = (event, error, values) => {
        new UserApi().changePassword(this.changePasswordSuccess, this.changePwdError, values);
    }

    changePasswordSuccess = (resp) => {
        this.setState({ passwordUpdated: true, content: "Password changed Succesfully!!"});
    }

    changePwdError = (err) => {
        if (err !== 'Wrong password supplied.') {
            this.callAlert("warning", "Unable to process request, Please Try again")
        } else {
            this.callAlert("danger", "You entered wrong password, Please Enter correct password")
        }
    }

    callAlert = (color, content) => {
        this.setState({ color, content });
        if (color === 'warning') {
            setTimeout(() => {
                this.setState({ color: '', content: '' });
            }, Config.apiTimeoutMillis)
        }
    }

    render() {
        const { color, content, passwordUpdated } = this.state;
        return <div>{passwordUpdated ? this.loadResponse(content) : this.loadChangePassword(color, content)}</div>
    }

    loadChangePassword = (color, content) => {
        const {oldPassword, newPassword} = this.state
        return (<Card>
            <CardHeader><b>CHANGE PASSWORD</b></CardHeader>
            <CardBody>
                {color && <Alert color={color}>{content}</Alert>}
                <AvForm onSubmit={this.updatePassword} >
                    <AvField name="old" type={oldPassword? "text" : "password"} label="Old Password" errorMessage="Enter Correct Password" placeholder="Enter Old Password" value={color === "danger" && ""} required />
                    <AvField name="new" type={newPassword ? "text" : "password"} label="New Password" errorMessage="New Password Required" placeholder="Enter  New Password" required />
                    <center>
                        <Button color="success" >Update</Button>
                        <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="secondary" type="button" >Cancel</Button></Link>
                    </center>
                </AvForm>
            </CardBody>
        </Card>);
    }

    loadResponse = (content) => {
        return (<Card>
            <CardHeader><b>CHANGE PASSWORD</b></CardHeader>
            <CardBody> <center style={{ color: 'green' }}>{content} <br /><br />
            <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="info" type="button" >Dashboard </Button></Link>
            </center> </CardBody>
        </Card>)
    }
}

export default ChangePassword;