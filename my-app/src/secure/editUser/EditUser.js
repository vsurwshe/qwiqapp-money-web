import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Alert, Row, Col, Label } from 'reactstrap';
import { Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from 'react-router-dom'
import UserApi from '../../services/UserApi';
import Config from '../../data/Config';
import Store from '../../data/Store';
import '../../css/style.css'


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updated: false,
            user: "",
            color: '',
            doubleClick: false
        }
    }

    componentDidMount = () => {
        let user = Store.getUser();
        if (user) {
            this.setState({ user });
        }
    }

    userUpdate = (event, error, values) => {
        if (error.length === 0) {
            this.setState({ doubleClick: true });
            new UserApi().updateUser(this.updateSuccessCall, this.updateErrorCall, values);
        }
    }

    updateSuccessCall = (user) => {
        this.callReload("success", "User Updated Succesfully !")
    }

    updateErrorCall = (error) => {
        this.callReload("danger", "Unable to process request, Please try Again.. ")
        this.setState({ doubleClick: !this.state.doubleClick });
    }

    render() {
        const { color, content, user } = this.state;
        return this.loadEditUser(user, color, content);
    }

    callReload = (color, content) => {
        this.setState({ color, content, updated: true })
        if (color === 'success') {
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, Config.apiTimeoutMillis);
        }
    }

    loadEditUser = (user, color, content) => {
        return <Card>
            <CardHeader><b >EDIT USER</b></CardHeader>
            <CardBody>
                <Alert color={color}>{content} </Alert>
                <center>
                <AvForm onSubmit={this.userUpdate} >
                    <Row>
                        <Col sm={2} className="label-align"><Label>Email</Label></Col>
                        <Col sm={4}><AvField name="email" type="email" placeholder="Email" value={user.email} required /></Col>
                    </Row>
                    <Row>
                        <Col sm={2} className="label-align"><Label>User Name</Label></Col>
                        <Col  sm={4}><AvField name="name" type="text" placeholder="User Name" value={user.name} required /></Col>
                    </Row><br/>
                    <Row>
                        <Col sm={{ size: 'auto', offset: 3 }}>
                           <Button color="success" disabled={this.state.doubleClick}>Edit</Button>
                           <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="secondary" type="button" >Cancel</Button></Link>
                       </Col>
                    </Row>
                </AvForm>
                </center>
            </CardBody>
        </Card>
    }
}

export default EditUser;