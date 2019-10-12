import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Alert, Button } from 'reactstrap';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import { AvField, AvForm, AvInput } from 'availity-reactstrap-validation';
import UserApi from '../../services/UserApi';
import Config from '../../data/Config';
import '../../css/style.css';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '',
            content: '',
            doubleClick: false,
            checked : 'true'
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

    setChecked = (e) =>{
        this.setState({ checked : e.target.value})
    }

    render() {
        const { color, content, } = this.state;
        return this.loadChangePassword(color, content)
    }

    loadChangePassword = (color, content) => {
        let type = this.state.checked !== 'true' ? "text" : "password"
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
                                <AvField name="new" type={type} label="New Password" errorMessage="New Password Required" placeholder="Enter  New Password" required />
                                <span className="padding-left"><AvInput name="show" type="checkbox" onChange={e=>this.setChecked(e)}/>Show Password<br/><br/></span>
                                <AvField name="renew" type="password" label="ReEnter New Password" errorMessage="New password and re-enter password doesn't match" placeholder="Enter  New Password" validate={{match:{value:'new'}}} required />
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