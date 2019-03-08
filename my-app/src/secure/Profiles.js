import React, { Component } from "react";
import {
  Container,
  Button,
  Label,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Popover,
  PopoverBody,
  PopoverHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Alert
} from "reactstrap";

import ProfileApi from "../services/ProfileApi";
import UpdateProfile from "../secure/UpdateProfile";
import CreateProfile from "./CreateProfile";
import DeleteProfile from "./DeleteProfile";
import Avatar from "react-avatar";

class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      visible: false,
      addContainer: false,
      updateContainer: false,
      deleteProfile: false,
      id: 0,
      name: "",
      popoverOpen: false,
      success: false,
      danger: false,
      content: "",
      color: ""
    };
  }

  componentDidMount() {
    new ProfileApi().getProfiles(this.successCall, this.errorCall);
  }

  successCall = json => {
    console.log(json);
    if (json === "Deleted Successfully") {
      this.setState({ profiles: [0], visible: true });
      this.callTimer();
    } else this.setState({ profiles: json });
  };

  // successupdate = json => {
  //   console.log("Updated Data ", json);
  // };

  // errorCall = err => {
  //   return <CardTitle>{err}</CardTitle>;
  // };

  callTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
    setTimeout(() => {
      this.setState({ name: "", color: "", content: "" });
      window.location.reload();
    }, 1500);
  };

  // Update Profile
  // updateProfile = uid => {
  //   this.setState({ id: uid });
  //   this.setState({ updateContainer: true });
  // };

  updateUserProfile = () => {
    let data = { name: this.state.name };
    new ProfileApi().updateProfile(
      () => {
        this.callTimer("success", "Profile Updated Successfully!!");
      },
      () => {
        this.callTimer("danger", "Profile not Updated Successfully!!");
      },
      data,
      this.state.uid
    );
  };

  //Delete profile
  // deleteProfile = dId => {
  //   this.setState({ deleteProfile: true, id: dId });
  //   // new ProfileApi().deleteProfile(this.successCall, this.errorCall, id);
  // };

  deleteUserProfile = () => {
    new ProfileApi().deleteProfile(
      () => {
        this.callTimer("success", "Profile Deleted Successfully!!");
      },
      () => {
        this.callTimer("danger", "Profile not Deleted Successfully!!");
      },

      this.state.uid
    );
  };

  //this method call the create profile
  callCreateProfile = e => {
    e.preventDefault();
    this.setState({ addContainer: !this.state.addContainer });
  };

  //this method called Provers
  toggle = Id => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };
  //this call the update model called
  toggleSuccess = () => {
    this.setState({
      success: !this.state.success
    });
  };

  //this method call delete model
  toggleDanger = () => {
    this.setState({
      danger: !this.state.danger
    });
  };

  //this method handle all inputs
  handleEvent = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    if (this.state.profiles.length === 0) {
      return <div>{this.loadCreateProfile()}</div>;
    } else {
      return <div>{this.loadProfile()}</div>;
    }
  }

  //this method when call if there is no any profile
  loadCreateProfile = () => {
    return (
      <Card>
        <CardHeader>
          <strong>Profile Mangement</strong>
        </CardHeader>
        <CardBody>
          <b>You haven't created any Profiles yet... </b>
          <br />
        </CardBody>
        <CardBody>
          {this.state.addContainer ? (
            <CreateProfile />
          ) : (
            <center>
              <Button color="info" onClick={this.callCreateProfile}>
                Create One
              </Button>
            </center>
          )}
        </CardBody>
      </Card>
    );
  };

  //this method when call if there is 1 or more than 1 profile is avialble
  loadProfile = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Profile Mangement</strong>
          </CardHeader>
          <CardBody>
            {this.state.profiles.map(profiles => {
              return (
                <Label id="Popover1" onClick={this.toggle} key={profiles.id}>
                  <Avatar name={profiles.name} size="40" round={true} /> &nbsp;
                  {profiles.name}
                  {this.loadProvers(profiles)}
                  {this.loadUpdateModel()}
                  {this.loadDeleteModel()}
                </Label>
              );
            })}
          </CardBody>
        </Card>
      </div>
    );
  };

  //this method call the provers
  loadProvers = profiles => {
    return (
      <Popover
        placement="right"
        isOpen={this.state.popoverOpen}
        target="Popover1"
        toggle={this.toggle}
      >
        <PopoverHeader>Profile Details</PopoverHeader>
        <PopoverBody>
          {this.state.profiles.map(profiles => {
            return (
              <Label key={profiles.id}>
                <b>Profile Id : </b>
                {profiles.id}
                <br />
                <b>Profile Creations : </b> {profiles.created}
                <br />
                <b>Profile Type : </b>
                {profiles.type}
                <br />
                <b>Profile Creation URL : </b>
                {profiles.url}
                <br />
                <Row>
                  <Col xs="2">
                    <i
                      className="cui-pencil icons font-2xl d-block mt-4"
                      onClick={() => {
                        this.setState({ uid: profiles.id });
                        this.toggle();
                        this.toggleSuccess();
                      }}
                    />
                  </Col>
                  <i
                    className="cui-delete icons font-2xl d-block mt-4"
                    onClick={() => {
                      this.setState({ uid: profiles.id });
                      this.toggle();
                      this.toggleDanger();
                    }}
                  />
                </Row>
              </Label>
            );
          })}
        </PopoverBody>
      </Popover>
    );
  };

  //this method call the update model
  loadUpdateModel = () => {
    return (
      <div>
        <Modal
          isOpen={this.state.success}
          toggle={this.toggleSuccess}
          className={"modal-success success"}
        >
          <ModalHeader toggle={this.toggleSuccess}>Update Profile</ModalHeader>
          <ModalBody>
            <Alert color={this.state.color}>{this.state.content}</Alert>
            <Input
              type="text"
              name="name"
              onChange={e => {
                this.handleEvent(e);
              }}
              placeholder="Your Email"
              value={this.state.name}
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.updateUserProfile}>
              Update Profile
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleSuccess}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };

  //this method call the delete Profile
  loadDeleteModel = () => {
    return (
      <Modal
        isOpen={this.state.danger}
        toggle={this.toggleDanger}
        className={"modal-danger "}
      >
        <ModalHeader toggle={this.toggleDanger}>Delete Profile</ModalHeader>
        <ModalBody>
          <Alert color={this.state.color}>{this.state.content}</Alert>
          This is the Delete Profile Permantly. Are Sure want to Delete the
          Profile if yes cilck Delete Profile.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteUserProfile}>
            Delete Profile
          </Button>
          <Button color="secondary" onClick={this.toggleDanger}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
}
export default Profiles;
