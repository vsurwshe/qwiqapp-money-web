import React, { Component } from "react";
import { Container,Button,Label,Card,CardBody,Col,Row,CardTitle,Alert} from "reactstrap";
import ProfileApi from "../services/ProfileApi";
import UpdateProfile from "../secure/UpdateProfile";
import CreateProfile from "./CreateProfile";
import DeleteProfile from "./DeleteProfile";
import Avatar from 'react-avatar';
import ViewProfile from "./ViewProfile";
import { Icon } from '@opuscapita/react-icons';
import styled from 'styled-components';
import { FaBeer, FaPen, FaTrashAlt } from 'react-icons/fa';


class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      profiles: [] ,
      visible:false,
      addContainer:false,
      updateProfile:false,
      deleteProfile: false,
      createProfile: false,
      viewProfileRequest: false,
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
      this.setState({ profiles: [0], visible:true });
      this.callTimer()
    }
    else { 
      this.setState({profiles: json});
    }
  };

  successUpdate = json => { console.log("Updated Data ", json) };

  errorCall = err => { return <CardTitle>{err}</CardTitle>; };

  callTimer(){
    setTimeout(() => { this.setState({visible:false}) } ,1500)
  }
  // Update Profile
  updateProfile = (uid) => {
    this.setState({ updateProfile : true, id: uid })
  };

  //Delete profile 
  deleteProfile = dId => {
    let response = window.confirm("Are you sure you want to Delete this Profile ?");
    if (response) { this.setState({ deleteProfile : true, id: dId }) }
  };

  profileView = () => {
    this.setState({ viewProfileRequest: true });
  }

  callCreateProfile = () => {
    this.setState({createProfile: true})
   }
     
  render() {
    const {profiles, id, viewProfileRequest, createProfile, updateProfile, deleteProfile} =this.state
    if (profiles.length === 0 && !createProfile) {
      return (
        <Container className="App">
          <Card style={{border:0}}>
            <center>
              <CardBody>
                <b>You haven't created any Profiles yet... </b><br/>
              </CardBody>
              <CardBody>
                <Button color="info" onClick={this.callCreateProfile}> Create One </Button>
              </CardBody>
            </center>
          </Card>
        </Container>
      );
    } else if( createProfile ) {
      return ( <Container> <CreateProfile /> </Container> );
    } else if( updateProfile ) {
      return ( <Container> <UpdateProfile id={id} /> </Container> );
    }else if( deleteProfile ) {
      return ( <Container> <DeleteProfile id={id} /> </Container> );
    }
    else{
      return(
        <div className="Main-styles-module--main--2QNBf col-xl-8 col-md-9 col-12">
          <Container style={{ padding: 20}} className="App">
            <Card>
              <CardBody>
                <CardTitle>Your Profiles</CardTitle>
                <Alert isOpen={this.state.visible} color="success" >Profile deleted</Alert>
                <Col sm="6">
                  <Row>
                    <CardBody>
                      {profiles.map(profiles => {
                        return (
                            <Container>
                              <Avatar name={profiles.name} size="40" round={true} onClick={this.profileView} /> {profiles.name}
                              <FaTrashAlt onClick={()=>{this.deleteProfile(profiles.id)}} className="float-right" style={{marginLeft:"20px"}}/>
                              <FaPen size={20} className="float-right" style={{marginLeft:"20px"}} onClick={()=>{this.updateProfile(profiles.id)}} />
                              {/* <Icon type="indicator" name="remove" onClick={()=>{this.deleteProfile(profiles.id)}} className="float-right" style={{marginLeft:"20px", size:'6px'}} />
                              <Icon type="indicator" name="edit" onClick={()=>{this.updateProfile(profiles.id)}} className="float-right" style={{marginLeft:"20px"}}/> */}
                              <hr/>
                              <Container>                               
                                  {/* <Label key={profiles.id} style= {{marginLeft:"10px"}} > */}
                                    {viewProfileRequest ? <ViewProfile view={profiles}/> : " "}
                                  {/* </Label> */}
                              </Container>
                            </Container>
                        );
                      })}
                    </CardBody>
                  </Row>
                </Col>
              </CardBody>
            </Card>
          </Container>
          </div>
      );
    }
  }

  //this method when call if there is no any profile
  loadCreateProfile = () => {
    return (
      <Card>
        {/* <CardHeader>
          <strong>Profile Mangement</strong>
        </CardHeader> */}
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
  // loadProfile = () => {
  //   return (
  //     <div className="animated fadeIn">
  //       <Card>
  //         <CardHeader>
  //           <strong>Profile Mangement</strong>
  //         </CardHeader>
  //         <CardBody>
  //           {this.state.profiles.map(profiles => {
  //             return (
  //               <Label id="Popover1" onClick={this.toggle} key={profiles.id}>
  //                 <Avatar name={profiles.name} size="40" round={true} /> &nbsp;
  //                 {profiles.name}
  //                 {this.loadProvers(profiles)}
  //                 {this.loadUpdateModel()}
  //                 {this.loadDeleteModel()}
  //               </Label>
  //             );
  //           })}
  //         </CardBody>
  //       </Card>
  //     </div>
  //   );
  // };

  // //this method call the provers
  // loadProvers = profiles => {
  //   return (
  //     <Popover
  //       placement="right"
  //       isOpen={this.state.popoverOpen}
  //       target="Popover1"
  //       toggle={this.toggle}
  //     >
  //       <PopoverHeader>Profile Details</PopoverHeader>
  //       <PopoverBody>
  //         {this.state.profiles.map(profiles => {
  //           return (
  //             <Label key={profiles.id}>
  //               <b>Profile Id : </b>
  //               {profiles.id}
  //               <br />
  //               <b>Profile Creations : </b> {profiles.created}
  //               <br />
  //               <b>Profile Type : </b>
  //               {profiles.type}
  //               <br />
  //               <b>Profile Creation URL : </b>
  //               {profiles.url}
  //               <br />
  //               <Row>
  //                 <Col xs="2">
  //                   <i
  //                     className="cui-pencil icons font-2xl d-block mt-4"
  //                     onClick={() => {
  //                       this.setState({ uid: profiles.id });
  //                       this.toggle();
  //                       this.toggleSuccess();
  //                     }}
  //                   />
  //                 </Col>
  //                 <i
  //                   className="cui-delete icons font-2xl d-block mt-4"
  //                   onClick={() => {
  //                     this.setState({ uid: profiles.id });
  //                     this.toggle();
  //                     this.toggleDanger();
  //                   }}
  //                 />
  //               </Row>
  //             </Label>
  //           );
  //         })}
  //       </PopoverBody>
  //     </Popover>
  //   );
  // };

  // //this method call the update model
  // loadUpdateModel = () => {
  //   return (
  //     <div>
  //       <Modal
  //         isOpen={this.state.success}
  //         toggle={this.toggleSuccess}
  //         className={"modal-success success"}
  //       >
  //         <ModalHeader toggle={this.toggleSuccess}>Update Profile</ModalHeader>
  //         <ModalBody>
  //           <Alert color={this.state.color}>{this.state.content}</Alert>
  //           <Input
  //             type="text"
  //             name="name"
  //             onChange={e => {
  //               this.handleEvent(e);
  //             }}
  //             placeholder="Your Email"
  //             value={this.state.name}
  //             required
  //           />
  //         </ModalBody>
  //         <ModalFooter>
  //           <Button color="success" onClick={this.updateUserProfile}>
  //             Update Profile
  //           </Button>{" "}
  //           <Button color="secondary" onClick={this.toggleSuccess}>
  //             Cancel
  //           </Button>
  //         </ModalFooter>
  //       </Modal>
  //     </div>
  //   );
  // };

  // //this method call the delete Profile
  // loadDeleteModel = () => {
  //   return (
  //     <Modal
  //       isOpen={this.state.danger}
  //       toggle={this.toggleDanger}
  //       className={"modal-danger "}
  //     >
  //       <ModalHeader toggle={this.toggleDanger}>Delete Profile</ModalHeader>
  //       <ModalBody>
  //         <Alert color={this.state.color}>{this.state.content}</Alert>
  //         This is the Delete Profile Permantly. Are Sure want to Delete the
  //         Profile if yes cilck Delete Profile.
  //       </ModalBody>
  //       <ModalFooter>
  //         <Button color="danger" onClick={this.deleteUserProfile}>
  //           Delete Profile
  //         </Button>
  //         <Button color="secondary" onClick={this.toggleDanger}>
  //           Cancel
  //         </Button>
  //       </ModalFooter>
  //     </Modal>
  //   );
  // };
}
export default Profiles;