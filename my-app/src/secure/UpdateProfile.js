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

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: '',
      color:'',
      content:''
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleUpdate = () => {
    let data = { name: this.state.name };
      new ProfileApi().updateProfile(
        () => {
          this.callAlertTimer("success","Profile Updated Successfully!!")
        }, this.errorCall, data, this.state.id );
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
        this.setState({name:"", color:'',content:''})
      },5500)
  }

  render() {
    return (
      <div style={{ paddingTop: "10" }}>
        <Container>
          <Card>
            <CardBody>
            <Alert color={this.state.color}>{this.state.content}</Alert>
              <p>hello update</p>
              <Input type="text" name="profile name" value={this.state.name} onChange={e => { this.setState({ name: e.target.value }); }} />
              <Button color="success" disabled={!this.state.name} onClick={this.handleUpdate}>
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
