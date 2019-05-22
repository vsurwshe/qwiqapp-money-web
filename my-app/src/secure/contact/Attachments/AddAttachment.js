import React,  { Component } from 'react';
import { Card, CardBody, FormGroup, Button } from 'reactstrap';
import AttachmentApi from '../../../services/AttachmentApi';
import { ReUseComponents } from '../../uitility/ReUseComponents';
import Contacts from '../Contacts';

class AddAttachment extends Component{
  state = {
    file : '',
    profileId : this.props.profileId,
    contactId : this.props.contactId,
    addSuccess:false,
    addFail: false,
    content: '',
    cancelAddAttachment: false,
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
  cancelAddAttachment=()=>{
    this.setState({cancelAddAttachment:true})
  }
  successCall = (json) => {
     this.setState({ addSuccess: true, content: "Successfully Added ", });
  } 
  
  errorCall = (err) => {
    this.setState({ content: "Unable to Process, please try Again", addFail: true });
  }

  render(){
  const {addSuccess,addFail,cancelAddAttachment}=this.state;
    if (addSuccess) {
     return this.loadSuccess();
    } else if (addFail) {
      return this.loadFailure();
    } else if (cancelAddAttachment){
      return <Contacts />
    }else{
      return this.loadAddAttachment();
    }

  }

  loadHeader = () => {
    return (
        <div style={{padding:10}}><center><strong>Add Attachment</strong></center></div>
      )
  }

  loadFailure = () => {
    // this.loadHeader()
    return(  
      <Card>
        {ReUseComponents.loadHeader("Add Attachment")}
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
            <Button active  color="light" aria-pressed="true"  onClick={this.cancelAddAttachment}>Cancel</Button><br/><br/>
          </center>
        </FormGroup>
      </Card>
   )
  }
}

export default AddAttachment;