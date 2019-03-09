import React, { Component } from "react";
import { Container,Button,Label,Card,CardBody,Col,Row,CardTitle,Alert} from "reactstrap";
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
      profiles: [] ,
      addContainer:false,
      updateProfile:false,
      deleteProfile: false,
      createProfile: false,
      viewProfileRequest: false,
      visible:false,
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
      this.setState({profiles: json})
    }
  };

  errorCall = err => { this.setState({visible: true}) }

  
  // Update Profile
  updateProfile = (uid) => {
    this.setState({ updateProfile : true, id: uid })
  };

  //Delete profile 
  deleteProfile = dId => {
    let response = window.confirm("Are you sure you want to Delete this Profile ?")
    if (response) { this.setState({ deleteProfile : true, id: dId }) }
  };

  profileView = () => {
    this.setState({ viewProfileRequest: true })
  }

  callCreateProfile = () => {
    this.setState({createProfile: true})
   }
     
  render() {
    const {profiles, id, viewProfileRequest, createProfile, updateProfile, deleteProfile,visible} =this.state
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
      return ( <Container> <CreateProfile /> </Container> )
    } else if( updateProfile ) {
      return ( <Container> <UpdateProfile id={id} /> </Container> )
    }else if( deleteProfile ) {
      return ( <Container> <DeleteProfile id={id} /> </Container> )
    }
    else{
      return(
          <Container style={{ padding: 20}} className="App">
            <Card>
              <CardBody>
                <h6><b>YOUR PROFILES</b>
                    <Alert isOpen={visible} color="danger">Internal Server Error</Alert>
                </h6>
                <Col sm="6">
                  <Row>
                    <CardBody>
                      {profiles.map(profiles => {
                        return (
                            <Container>
                              <Avatar name={profiles.name.charAt(0)} size="40" round={true} onClick={this.profileView} /> {profiles.name}
                              <FaTrashAlt onClick={()=>{this.deleteProfile(profiles.id)}} className="float-right" style={{marginLeft:"20px",color:'red'}}/>
                              <FaPen size={20} className="float-right" style={{marginLeft:"20px",color:'#4385ef'}} onClick={()=>{this.updateProfile(profiles.id)}} />
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
      );
    }
  }

  
}
export default Profiles