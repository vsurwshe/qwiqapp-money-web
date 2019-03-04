import React, { Component } from "react";
import {
  Container,
  Button,
  Card,
  CardBody,
  Input,Alert,
  CardTitle
} from "reactstrap";
import ProfileApi from "../services/ProfileApi";

class DeleteProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.id,
            profileDeleted:false,
            color:"",
            content: ""
        }
    }
    componentDidMount = ()=> {
        new ProfileApi().deleteProfile(this.successCall, this.errorCall, this.state.id);
    }
    successCall = () =>{
        this.setState({ profileDeleted: true }); 
        this.callAlertTimer("success", "Profile Deleted Successfully ");
    }
    errorCall = () => {
        this.setState({ profileDeleted: true });
        this.callAlertTimer("failure", " Something went wrong  ");
    }
    callAlertTimer = (color,content) => {
        this.setState({
          color:color,
          content:content,
        })
          setTimeout(() => {
            this.setState({ color:'',content:''})
          },5500)
      }
    
    render() { 
        if (this.state.profileDeleted) {
            return ( <Container>
                {this.state.content}
                <Alert color={this.state.color}>{this.state.content}</Alert>
            </Container> );
        } else {
            return ( <Container>
                <p>under process.....</p>
            </Container> );
        }
    }
}
 
export default DeleteProfile;