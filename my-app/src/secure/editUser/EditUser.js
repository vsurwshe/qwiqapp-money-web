import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {Button} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from 'react-router-dom'
import UserApi from '../../services/UserApi';
import Config from '../../data/Config';


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            updated: false,
            user: ""
         }
    }

    userUpdate = (event, error, values) =>{
        if (error.length === 0 ) {
            new UserApi().updateUser(this.updateSuccessCall, this.updateErrorCall, values);
        }
    }

    updateSuccessCall = (user) =>{
        this.setState({ user, updated: true, content: "User Updated Succesfully " });
    }
    updateErrorCall = (error) =>{
        this.setState({ updated: true,content: "Something went wrong. Please Try Again. " });
        console.log(error.message)
    }
    
    render() { 
        const {updated} = this.state;
        if (updated) {
            return this.loadUpdateSuccess();
        } else {
            return this.loadEditUser();
        }
    }

    loadUpdateSuccess = () => {
        const {user, content} = this.state
        return (<Card>
            <CardHeader>EDIT USER </CardHeader>
            <CardBody><center>{content}</center> 
            {this.callReload()}
            </CardBody>
        </Card>)
    }
    callReload = () => {
        setTimeout(()=>{
            window.location.reload()
        }, Config.apiTimeoutMillis)
    }
    loadEditUser = () =>{
        return ( <div>
            <AvForm onSubmit={this.userUpdate} >
                 <AvField name="email" type="email" label="Email" placeholder="Email" />
                 <AvField name="name" type="text" label="User Name" placeholder="User Name" />
                 <center>
                 <Button color="success" >Update</Button>
                 <Link to="/dashboard" style={{marginLeft: 10}} ><Button color="secondary" type="button" >Cancel</Button></Link>
                 </center>
            </AvForm></div> );
    }

}
 
export default EditUser;