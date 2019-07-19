import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from 'react-router-dom'
import UserApi from '../../services/UserApi';
import Config from '../../data/Config';
import Store from '../../data/Store';


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updated: false,
            user: Store.getUser() ? Store.getUser() : ""
        }
    }

    userUpdate = (event, error, values) => {
        if (error.length === 0) {
            new UserApi().updateUser(this.updateSuccessCall, this.updateErrorCall, values);
        }
    }

    updateSuccessCall = (user) => {
        this.setState({ updated: true, content: "User Updated Succesfully !" });
    }
    updateErrorCall = (error) => {
        this.setState({ updated: true, content: "Unable to process request, Please try Again.. " });
        console.log(error.message)
    }

    render() {
        const { updated, content, user } = this.state;
        if (updated) {
            return this.loadUpdateSuccess(content);
        } else {
            return this.loadEditUser(user);
        }
    }

    loadUpdateSuccess = (content) => {
        return (<Card>
            <CardHeader><b>EDIT USER </b></CardHeader>
            <CardBody><center><b style={{ color: "green" }}>{content}</b></center>
                {this.callReload()}
            </CardBody>
        </Card>)
    }
    callReload = () => {
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, Config.apiTimeoutMillis);
    }
    loadEditUser = (user) => {
        return (<Card>
            <CardHeader><b >EDIT USER</b></CardHeader>
            <CardBody>
                <AvForm onSubmit={this.userUpdate} >
                    <AvField name="email" type="email" label="Email" placeholder="Email" value={user.email} required />
                    <AvField name="name" type="text" label="User Name" placeholder="User Name" value={user.name} required />
                    <center>
                        <Button color="success" >Update</Button>
                        <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="secondary" type="button" >Cancel</Button></Link>
                    </center>
                </AvForm>
            </CardBody>
        </Card>);
    }

}

export default EditUser;