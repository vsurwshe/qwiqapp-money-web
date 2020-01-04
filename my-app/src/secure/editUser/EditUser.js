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
            user: ""
        }
    }

    componentDidMount = () => {
        let user = Store.getUser();
        if (user) {
            this.setState({ user: user });
        }
    }

    userUpdate = (event, values) => { //onValidSubmit passing two paramentes(events, values)
        this.setState({ doubleClick: true });
        new UserApi().updateUser(this.updateSuccessCall, this.updateErrorCall, values);
    }

    updateSuccessCall = (user) => {
        this.callReload("success", "User Updated Succesfully !")
    }

    updateErrorCall = (error) => {
        this.callReload("danger", "Unable to process request, Please try Again.. ")
        this.setState({ doubleClick: !this.state.doubleClick });
    }

    render() {
        return this.loadEditUser();
    }

    callReload = (color, content) => {
        this.setState({ color, content, updated: true })
        if (color === 'success') {
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, Config.apiTimeoutMillis);
        }
    }

    // This method loads the edit user from
    loadEditUser = () => {
        const { doubleClick, color, content, user } = this.state
        return (
            <Card>
                {this.loadHeader()}
                <CardBody>
                    {color && <Alert color={color}>{content}</Alert>}
                    <Col sm={12} md={{ size: 8, offset: 1 }} lg={{ size: 20, offset: 3 }} xl={{ size: 20, offset: 3 }}>
                        <AvForm onValidSubmit={this.userUpdate}>
                            <Row>
                                <Col sm={3} ><Label>Email</Label></Col>
                                <Col sm={6}><AvField name="email" type="email" placeholder="Email" value={user.email} required /></Col>
                            </Row>
                            <Row>
                                <Col sm={3} ><Label>User Name</Label></Col>
                                <Col sm={6}><AvField name="name" type="text" placeholder="User Name" value={user.name} required /></Col>
                            </Row><br />
                            <Row>
                                <Col sm={3}></Col>
                                <Col sm={6}>
                                    <Button color="success" disabled={doubleClick}>Edit</Button>
                                    <Link to="/dashboard" style={{ marginLeft: 10 }} ><Button color="secondary" type="button" >Cancel</Button></Link>
                                </Col>
                            </Row>
                        </AvForm>
                    </Col>
                </CardBody>
            </Card>)
    }

    // This method loads the header
    loadHeader = () => <CardHeader style={{ height: 60 }}>
        <Row form>
            <Col className="marigin-top"><strong>Edit User</strong></Col>
        </Row>
    </CardHeader>
}

export default EditUser;