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
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory();

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: this.props.name,
      color:'',
      content:''
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleUpdate = () => {
    let data = {
      name: this.state.name
    };
    if (this.state.name === "") {
      console.log("Name should be null")
    } else {
      new ProfileApi().updateProfile(
        () => {
          this.callAlertTimer("success","Profile Updated Successfully!!")
         
        },
        this.errorCall,
        data,
        this.state.id
      );
    }
    
  };

  errorCall = err => {
    return <CardTitle>{err}</CardTitle>;
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
      },1500)
  }

  render() {
    return (
      <div style={{ paddingTop: "10" }}>
        <Container>
          <Card>
            <CardBody>
            <Alert color={this.state.color}>{this.state.content}</Alert>
              <p>hello update</p>
              <Input
                type="text"
                name="profile name"
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              />
              <Button color="success" onClick={this.handleUpdate}>
                Update Profile
              </Button>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default UpdateProfile;
