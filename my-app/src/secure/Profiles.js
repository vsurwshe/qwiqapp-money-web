import React, { Component } from "react";
import ReactDom from "react-dom";
import { Container,Button,Label,Card,CardBody,Col,Row,CardTitle,Alert} from "reactstrap";
import ReactTable from "react-table";
import ProfileApi from "../services/ProfileApi";
import UpdateProfile from "../secure/UpdateProfile";
import CreateProfile from "./CreateProfile";

class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      profiles: [] ,
      visible:false,
      addContainer:false,
      updateContainer:false,
      id: 0
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
    else this.setState({profiles: json});
  };

  successupdate = json => {
    console.log("Updated Data ", json);
  };

  errorCall = err => {
    return <CardTitle>{err}</CardTitle>;
  };

  callTimer(){
    setTimeout(() => {
      window.location.reload()
      this.setState({visible:false})
    } ,1500)
  }

  // Update Profile
  updateProfile = (uid) => {
    alert("before id:" +this.state.id)
    this.setState({ id : uid})
    alert("profile id= " +uid)
    this.setState({ updateContainer : true })
    //alert("profile id= " + this.state.updateContainer)
    // ReactDom.render(
    //   <UpdateProfile id={uid} name={uname} />,
    //   document.getElementById("root")
    // );
  };

  //Delete profile 
  deleteProfile = id => {
    new ProfileApi().deleteProfile(this.successCall, this.errorCall, id);
  };

  callCreateProfile= e=>{
    e.preventDefault();    
    this.setState({addContainer: !this.state.addContainer})
   }
 
  render() {
    const columns = [
      { Header: "Id", accessor: "id" },
      { Header: "Profile Name", accessor: "name" },
      {
        Header: "Profile Create Time",
        accessor: "created",
        sortable: false,
        filterable: false
      },
      {
        Header: "Profile Type",
        accessor: "type"
      },
      {
        Header: "Profile URL",
        accessor: "url",
        sortable: false,
        filterable: false
      },
      {
        Header: "",
        Cell: props => {
          return (
            //update button
            <Button
              color="primary"
              onClick={() => {this.updateProfile(props.original.id);}}>
              Update</Button>
          );
        },
        sortable: false,
        filterable: false
      },
      {
        Header: "",
        Cell: props => {
          return (
            //delete button
            <Button
              color="danger"
              onClick={() => {this.deleteProfile(props.original.id);}}>
              Delete
            </Button>
          );},
        sortable: false,
        filterable: false
      }
    ];
    if (this.state.profiles.length === 0 ) {
      return (
          <Container style={{ padding: 20 }} className="App">
            <Card style={{border:0}}>
              <CardBody>
                <b>You haven't created any Profiles yet... </b><br/>
              </CardBody>
              <CardBody>
               {this.state.addContainer ?<CreateProfile/>:
                  <center>
                    <Button color="info" onClick={this.callCreateProfile}> Create One </Button>
                  </center>}
              </CardBody>
            </Card>
          </Container>
      );
    } else if(this.state.updateContainer){
      return (
      <UpdateProfile id={this.props.id} /> 
      );
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
                      {this.state.profiles.map(profiles => {
                        return (
                          <Label key={profiles.id}>
                            <b>Profile Id : </b>{profiles.id}<br />
                            <b>Profile Name : </b>{profiles.name}<br />
                            <b>Profile Creations : </b> {profiles.created}<br />
                            <b>Profile Type : </b>{profiles.type}<br />
                            <b>Profile Creation URL : </b>{profiles.url}
                          </Label>
                        );
                      })}
                    </CardBody>
                  </Row>
                </Col>
                <ReactTable
                  columns={columns}
                  data={this.state.profiles}
                  filterable
                  defaultPageSize={5}
                  showFilters/>
              </CardBody>
            </Card>
          </Container>
          </div>
      );
    }
  }
}
export default Profiles;
