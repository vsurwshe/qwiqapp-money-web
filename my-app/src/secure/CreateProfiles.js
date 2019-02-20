import React, { Component } from "react";
import {
  Alert,
  Container,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle
} from "reactstrap";
import Store from "../data/Store";
import ProfileApi from "../services/ProfileApi";

import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory();

class CreateProfiles extends Component {
  state = {
    name: "",
    userToken: "",
    color:'',
    content:''
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAccessToken() });
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log("Profile Name ", this.state.name);
    const data = {
      name: this.state.name
    };

    new ProfileApi().createProfile(
      () => {
        this.callAlertTimer("success","New Profile Created!!")
        
      },
      this.errorCall,
      data
    );
  };

  errorCall = err => {
    console.log("Calling Error Functions");
    this.callAlertTimer("danger",err)
     
     
  };


  callAlertTimer = (color,content) => {
    this.setState({
      color:color,
      content:content,

    })
    
      setTimeout(() => {
        this.setState({color:'',content:''})
        browserHistory.push("/dashboard");
        window.location.reload();
      },2000)
    // }
    // else setTimeout(() => this.setState({color:'',content:''}),2000)
  }

  //this method call api and create user profile
  render() {
    return (
      <div>
        <center>
          <Container style={{ paddingTop: 50 }} className="App">
          <Alert color={this.state.color}>{this.state.content}</Alert>
            <Card style={{width:400}}>
              <CardBody>
                <CardTitle>Create User Profiles</CardTitle>
                <form>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Enter Profile name"
                    onChange={e => this.handleInput(e)}
                  />
                  <br />
                  <Button color="info" onClick={e => this.handleSubmit(e)}>
                    Save
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Container>
        </center>
      </div>
    );
  }
}

export default CreateProfiles;
