import Avatar from 'react-avatar';
import React, { Component } from "react";
import Loader from 'react-loader-spinner'
import UpdateProfile from "./UpdateProfile";
import CreateProfile from "./CreateProfile";
import DeleteProfile from "./DeleteProfile";
import {Redirect} from 'react-router';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import ProfileApi from "../../services/ProfileApi";
import { DeleteModel } from "../utility/DeleteModel";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { Container, Button, Card, CardBody, Col, Row, CardHeader, Alert } from "reactstrap";

/**
 * Display list of profiles,Manage profile like (update, delete)
 * Call Add,Update, delete Componets.
 * TODO: handel Error Message
 */
class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      id: 0,
      name: "",
      updateProfile: false,
      deleteProfile: false,
      createProfile: false,
      danger: false,
      spinner: false,
      visible: false,
      selectProfile: false
    };
  }

  componentDidMount() {
    new ProfileApi().getProfiles(this.successCall, this.errorCall);
  }

  successCall = async  json => {
    if (json === null) {
      this.setState({ profiles: [], spinner: true })
    } else {
      this.setState({ profiles: json, spinner: true })
    }
  };

  errorCall = err => { this.setState({ visible: true }); console.log("Internal Server Error") }

  updateProfile = (uid, uName) => {
    this.setState({ updateProfile: true, id: uid, name: uName })
  };

  deleteProfile = () => {
    this.setState({ deleteProfile: true })
  };

  callCreateProfile = () => {
    this.setState({ createProfile: true })
  }

  toggleDanger = () => {
    this.setState({
      danger: !this.state.danger,
    });
  }

  render() {
    const { profiles, id, createProfile, updateProfile, deleteProfile, selectProfile, name, spinner } = this.state
    if (profiles.length === 0 && !createProfile) {
      return <div>{profiles.length === 0 && !createProfile && !spinner ? this.loadSpinner() : <ProfileEmptyMessage />}</div>
    } else if (selectProfile) {
      let url = "/profiles/" + this.state.id
      return (<Container> <Redirect push to={url} /></Container>)
    } else if (createProfile) {
      return (<Container> <CreateProfile /> </Container>)
    } else if (updateProfile) {
      return (<Container> <UpdateProfile id={id} name={name} /> </Container>)
    } else if (deleteProfile) {
      return (<Container> <DeleteProfile id={id} /> </Container>)
    } else {
      return <div>{this.showProfile(profiles)}{this.loadDeleteProfile()}</div>
    }
  }

  loadHeader = () => {
    return (
      <CardHeader><strong>PROFILES</strong>
        <Button color="success" className="float-right" onClick={this.callCreateProfile}> + Create Profile </Button>
      </CardHeader>)
  }

  loadSpinner = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          <center style={{ paddingTop: '20px' }}>
            {this.loadHeader()}
            <CardBody>
              {this.state.visible && <Alert color="danger">Unable to Process your Request, please try Again...</Alert>}
              <Loader type="TailSpin" color="#2E86C1" height={60} width={60} /></CardBody>
          </center>
        </Card>
      </div>)
  }

  //if one or more profile is there then this method Call
  showProfile = (profiles) => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <CardBody>
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                {profiles.map((profile,key) => {
                  return this.loadSingleProfile(profile, key);
                })}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>)
  }

  selectProfile = (selectedId) => {
    this.setState({ id: selectedId, selectProfile: true })
  }

  //this method load the single profile
  loadSingleProfile = (profile, key) => {
    return (
      <div key={key} style={{ padding: 10 }} >
        <b onClick={() => { this.selectProfile(profile.id) }} ><Avatar name={profile.name.charAt(0)} size="40" round={true} /> &nbsp;&nbsp;{profile.name}</b>
        <FaTrashAlt onClick={() => { this.setState({ id: profile.id }); this.toggleDanger() }} className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px" }} />
        <FaPen size={14} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={() => { this.updateProfile(profile.id, profile.name) }} />
      </div>);
  }

  //this method call the delete model
  loadDeleteProfile = () => {
    return (
      <DeleteModel danger={this.state.danger} headerMessage="Delete Profile" bodyMessage="Are You Sure Want to Delete Profile?"
        toggleDanger={this.toggleDanger} delete={this.deleteProfile} cancel={this.toggleDanger} />)
  }
}
export default Profiles