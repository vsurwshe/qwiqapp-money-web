import React, { Component } from "react";
import { Card, CardHeader,CardBody,Alert,Col } from "reactstrap";
import Contacts from "./Contacts";
import ContactApi from "../../services/ContactApi";
class DeleteContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactId: props.contactId,
      labelDeleted: false,
      color: "warning",
      content: "Deleting Label.....",
      profileId: props.profileId
    };
  }
  componentDidMount = () => {
    console.log("Delete didMount");
    new ContactApi().deleteContact(this.successCall, this.errorCall ,this.state.profileId, this.state.contactId);
   };
 
  successCall = () => {
    this.setState({ labelDeleted: true  });
    this.callAlertTimer("success","Contact Deleted Successfully....");
  };
 
  errorCall = () => {
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color : color, content : content});
  };

  render() {
    const { labelDeleted, content, color } = this.state;
    return <div>{labelDeleted ? <Contacts color={color} content={content}/> : this.loadDeleting(color,content)}</div>
  } 

  loadHeader=()=>{
    return <CardHeader><strong>Delete Contact</strong></CardHeader>;
  }

  loadDeleting = (color,content)=>{
    return(
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <CardBody>
           <Col sm="12" md={{ size: 5, offset: 4 }}>Deleting</Col>
          </CardBody>
        </Card>
      </div>)
  }
}

export default DeleteContact;
