import React, { Component } from "react";
import { Container, Button, Card, CardBody, Col, Row, Alert, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ProfileApi from "../services/ProfileApi";
import UpdateProfile from "../secure/UpdateProfile";
import CreateProfile from "./CreateProfile";
import DeleteProfile from "./DeleteProfile";
import Avatar from 'react-avatar';
import ViewProfile from "./ViewProfile";
import { FaPen, FaTrashAlt } from 'react-icons/fa';
class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      addContainer: false,
      updateProfile: false,
      deleteProfile: false,
      createProfile: false,
      danger: false,
      viewProfileRequest: false,
      visible: false,
      id: 0,
      name: ""
    };
  }

  componentDidMount() {
    new ProfileApi().getProfiles(this.successCall, this.errorCall);
  }

  successCall = json => {
    console.log(json);
    if (json === "Deleted Successfully") {
      this.setState({ profiles: [0] })
    }
    else {
      this.setState({ profiles: json })
    }
  };

  errorCall = err => { this.setState({ visible: true }) }


  // Update Profile
  updateProfile = (uid, uName) => {
    this.setState({ updateProfile: true, id: uid, name: uName })
  };

  //Delete profile 
  deleteProfile = () => {
       this.setState({ deleteProfile: true })
  };

  profileView = () => {
    this.setState({ viewProfileRequest: true })
  }

  callCreateProfile = () => {
    this.setState({ createProfile: true })
  }

  toggleDanger = () => {

    this.setState({
      danger: !this.state.danger,
    });
  }

  render() {
    const { profiles, id, viewProfileRequest, createProfile, updateProfile, deleteProfile, visible, name } = this.state
    if (profiles.length === 0 && !createProfile) {
      return <div>{this.loadNotCreateProfile()}</div>
    } else if (createProfile) {
      return (<Container> <CreateProfile /> </Container>)
    } else if (updateProfile) {
      return (<Container> <UpdateProfile id={id} name={name} /> </Container>)
    } else if (deleteProfile) {
      return (<Container> <DeleteProfile id={id} /> </Container>)
    }else {
      return <div>{this.loadShowProfile(viewProfileRequest, visible, profiles)}{this.loadDeleteProfile()}</div>
    }
  }
  //this method call when if any profile not created.
  loadNotCreateProfile = () => {
    return (<div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Profile</strong>
        </CardHeader>
        <center style={{paddingTop:'20px'}}>
          <CardBody>
            <h5><b>You haven't created any Profiles yet... </b></h5><br/>
            <Button color="info" onClick={this.callCreateProfile}> Create Profile </Button>
          </CardBody>
        </center>
      </Card>
    </div>)
  }
  //if one or more profile is there then this method Call
  loadShowProfile = (viewProfileRequest, visible, profiles) => {
    return (
    <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Profile</strong>
        </CardHeader>
        <CardBody>
          <h6>
            <Alert isOpen={visible} color="danger">Internal Server Error</Alert>
          </h6>
          <Col sm="6">
            <Row>
              <CardBody>
                {profiles.map(profiles => {
                  return (
                    <Container>
                      <Avatar name={profiles.name.charAt(0)} size="40" round={true} onClick={this.profileView} /> {profiles.name}
                      <FaTrashAlt onClick={() => { this.setState({ id: profiles.id }); this.toggleDanger() }} className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px"}} />
                      <FaPen size={20} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={() => { this.updateProfile(profiles.id, profiles.name) }} />
                      <hr />
                      <Container>
                        {viewProfileRequest ? <ViewProfile view={profiles} /> : " "}
                      </Container>
                    </Container>
                  );
                })}
                 <Button color="info" onClick={this.callCreateProfile}> Create Profile </Button>
              </CardBody>
            </Row>
          </Col>
        </CardBody>
      </Card>
    </div>)
  }

  //this method call the delete model
  loadDeleteProfile = () => {
    return (
    <Modal isOpen={this.state.danger} toggle={this.toggleDanger} backdrop={false}>
      <ModalHeader toggle={this.toggleDanger}>Delete Profile</ModalHeader>
      <ModalBody>
        Are you Sure want to Delete This Profile ?
        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.deleteProfile}>Delete</Button>
        <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
      </ModalFooter>
    </Modal>)
  }

}
export default Profiles