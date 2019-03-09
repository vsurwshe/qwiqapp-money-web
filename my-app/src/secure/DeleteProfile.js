import React, { Component } from "react";
import { Container, Alert } from "reactstrap";
import ProfileApi from "../services/ProfileApi";

class DeleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      profileDeleted: false,
      color: "",
      content: ""
    };
  }
  componentDidMount = () => {
    new ProfileApi().deleteProfile(
      this.successCall,
      this.errorCall,
      this.state.id
    );
  };
  successCall = () => {
    this.setState({
      profileDeleted: true,
      content: "Profile Deleted Successfully !!"
    });
    // this.callAlertTimer("success", "Profile Deleted Successfully !!");
  };
  errorCall = () => {
    this.setState({ profileDeleted: true });
    this.callAlertTimer(
      "danger",
      "Something went wrong, Please Try Again...  "
    );
  };
  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
    setTimeout(() => {
      this.setState({ color: "" });
    }, 5500);
  };

  render() {
    const { profileDeleted, content } = this.state;
    if (profileDeleted) {
      return (
        <Container>
          <center>
            {" "}
            <h5><b>{content}</b><br /> <br />
            <a href="/profiles">New Profile </a></h5>
          </center>
        </Container>
      );
    } else {
      return (
        <Container>
         <h5><b>Deleting Profile.....</b></h5>
        </Container>
      );
    }
  }
}

export default DeleteProfile;
