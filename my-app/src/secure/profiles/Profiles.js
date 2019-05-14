import React, { Component } from "react";
import { Container, Button, Card, CardBody, Col, Row, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ProfileApi from "../../services/ProfileApi";
import UpdateProfile from "./UpdateProfile";
import CreateProfile from "./CreateProfile";
import DeleteProfile from "./DeleteProfile";
import Avatar from 'react-avatar';
import ViewProfile from "./ViewProfile";
import Loader from 'react-loader-spinner'
import { FaPen, FaTrashAlt } from 'react-icons/fa';

class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      updateProfile: false,
      deleteProfile: false,
      createProfile: false,
      danger: false,
      viewProfileRequest: false,
      id: 0,
      name: "",
      spinner:false
    };
  }

  componentDidMount() {
    new ProfileApi().getProfiles(this.successCall, this.errorCall);
  }

  successCall = async  json => {
    if (json === null) {
      this.setState({ profiles : [],spinner : true })
    }else {
       this.setState({ profiles : json, spinner : true})
    }
  };

  errorCall = err => { console.log("Internal Server Error") }

  // Update Profile
  updateProfile = (uid, uName) => {
    this.setState({ updateProfile: true, id: uid, name: uName })
  };

  //Delete profile 
  deleteProfile = () => {
    this.setState({ deleteProfile: true })
  };

  profileView = () => {
    this.setState({ viewProfileRequest : !this.state.viewProfileRequest })
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
    const { profiles, id, viewProfileRequest, createProfile, updateProfile, deleteProfile, name ,spinner} = this.state
    if (profiles.length === 0 && !createProfile) {
      return <div>{profiles.length === 0 && !createProfile && !spinner ? this.loadLoader() :this.loadNotCreateProfile()}</div>
    } else if (createProfile) {
      return (<Container> <CreateProfile /> </Container>)
    } else if (updateProfile) {
      return (<Container> <UpdateProfile id={id} name={name} /> </Container>)
    } else if (deleteProfile) {
      return (<Container> <DeleteProfile id={id} /> </Container>)
    }else {
      return <div>{this.loadShowProfile(viewProfileRequest, profiles)}{this.loadDeleteProfile()}</div>
    }
  }

  loadHeader = () =>{
    return(
      <CardHeader><strong>PROFILES</strong>
        <Button color="success" className="float-right" onClick={this.callCreateProfile}> + Create Profile </Button>
      </CardHeader>)
  }

   //this method loads the spinner
   loadLoader = () =>{
    return( 
      <div className="animated fadeIn">
        <Card>
          <center style={{paddingTop:'20px'}}>
            {this.loadHeader()}
            <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60}/></CardBody>
          </center>
        </Card>
      </div>)
   }

  //this method call when if any profile not created.
  loadNotCreateProfile = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center style={{paddingTop:'20px'}}>
            <CardBody><h5><b>You haven't created any Profiles yet... </b></h5><br/></CardBody>
          </center>
        </Card>
      </div>)
  }

  //if one or more profile is there then this method Call
  loadShowProfile = (viewProfileRequest, profiles) => {
    return (
      <div className="animated fadeIn">
        <Card>
         {this.loadHeader()}
          <CardBody>
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                {profiles.map(profiles => {
                  return this.loadSingleProfile(profiles, viewProfileRequest);
                })}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>)
  }

  //this method load the single profile
  loadSingleProfile = (profiles, viewProfileRequest)=>{
    return (
      <div key={profiles.id}>
        <Avatar name={profiles.name.charAt(0)} size="40" round={true} onClick={this.profileView} /> &nbsp;&nbsp;{profiles.name}
        <FaTrashAlt onClick={() => { this.setState({ id: profiles.id }); this.toggleDanger() }} className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px" }} />
        <FaPen size={15} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={() => { this.updateProfile(profiles.id, profiles.name) }} />
         <Container>{viewProfileRequest ? <ViewProfile view={profiles} /> : " "}</Container>
      </div>);
  }

  //this method call the delete model
  loadDeleteProfile = () => {
    return (
      <Modal isOpen={this.state.danger} toggle={this.toggleDanger} backdrop={false}>
        <ModalHeader toggle={this.toggleDanger}>Delete</ModalHeader>
        <ModalBody>Are you Sure want to Delete This Profile ?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteProfile}>Delete</Button>
          <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
        </ModalFooter>
      </Modal>)
  }
}
export default Profiles