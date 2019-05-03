import React,  { Component } from 'react';
import { Card, CardBody, FormGroup, Button } from 'reactstrap';
import AttachmentApi from '../../../services/AttachmentApi';
import Attachments from './Attachments';

class AddAttachment extends Component{
  state = {
    file : '',
<<<<<<< HEAD
    profileId : this.props.profileId,
=======
    pprofileId : this.props.profileId,
>>>>>>> Removed Unwanted Code and implemented better UI
    contactId : this.props.contactId,
    addSuccess:false,
    addFail: false,
    content: ''
  }

  handleInput = (e) => {
    this.setState({ file :e.target.files[0] })
  }

  handleSubmit = (e) =>{
    e.preventDefault()
    const {profileId, contactId, file} = this.state;
    let reader = new FormData()
    reader.append('file', file);
    if (profileId !== undefined || contactId !== undefined) {
      new AttachmentApi().createAttachment( this.successCall, this.errorCall, profileId, contactId, reader )  
    }
    
  }
  successCall = (json) => {
     this.setState({ addSuccess: true, content: "Successfully Added ", });
  } 
  
  errorCall = (err) => {
    this.setState({ content: "Unable to Process, please try Again", addFail: true });
  }

  render(){
    if (this.state.addSuccess) {
     return this.loadSuccess();
    } else if (this.state.addFail) {
      return this.loadFailure();
    } else {
     return this.loadAddAttachment();
    }
  }

  loadHeader = () => {
    return (
        <div style={{padding:10}}><center><strong>Add Attachment</strong></center></div>
      )
<<<<<<< HEAD
  }

  loadFailure = () => {
    return(  
      <Card>
        {this.loadHeader()}
        <CardBody><center>{this.state.content}</center></CardBody>
      </Card>)
  }

  loadSuccess = () =>{
    return (
      <div style={{color: "green"}}> Added Successfully !
               {window.location.reload()}
      </div>)
  }

  loadAddAttachment = () => {
    return(
      <Card>
        {this.loadHeader() }
        <FormGroup> <br></br>
          <center>
            <input type="file" onChange={e=>this.handleInput(e)}/> <br /><br/>
            <Button color="info" onClick={e=>this.handleSubmit(e)}> Add </Button>&nbsp;&nbsp;
            <a href="/contact/manageContact/" style={{textDecoration:'none'}} > <Button active  color="light" aria-pressed="true">Cancel</Button></a><br/><br/>
          </center>
        </FormGroup>
      </Card>
   )
  }
=======
   }
   loadFailure = () => {
    return  <Card>
         {this.loadHeader()}
          <CardBody><center>{this.state.content}</center></CardBody>
       </Card>
   }
   loadSuccess = () =>{
    return (<Card>
      <Attachments />
      {/* {this.loadHeader()} */}
       {/* <CardBody>
          <center>{this.state.content} <br /> <br />
          <a href="/contact/manageContact" ><Button color="success" > Goto Contacts </Button></a></center>
       </CardBody> */}
    </Card>)
   }
   loadAddAttachment = () => {
    return(
        <Card>
          {this.loadHeader() }
          <FormGroup> <br></br>
            <center>
              <input type="file" onChange={e=>this.handleInput(e)}/> <br />
              <Button color="info" onClick={e=>this.handleSubmit(e)}> Add </Button>&nbsp;&nbsp;
              <a href="/contact/manageContact/" style={{textDecoration:'none'}} > <Button active  color="light" aria-pressed="true">Cancel</Button></a><br/><br/>
            </center>
          </FormGroup>
        </Card>
    )
   }
>>>>>>> Removed Unwanted Code and implemented better UI
}

export default AddAttachment;