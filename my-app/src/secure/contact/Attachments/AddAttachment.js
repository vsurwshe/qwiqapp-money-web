import React,  { Component } from 'react';
import { Card, CardHeader, CardBody, FormGroup, Button } from 'reactstrap';
import AttachmentApi from '../../../services/AttachmentApi';

class AddAttachment extends Component{
  state = {
    file : '',
    pid : this.props.profileId,
    cid : this.props.contactId,
    addSuccess:false,
    addFail: false,
    content: ''
  }

  handleInput = (e) => {
    this.setState({ file :e.target.files[0] })
  }

  handleSubmit = (e) =>{
    e.preventDefault()
    let reader = new FormData()
    reader.append('file', this.state.file);
    // console.log("File data=",this.state.file, "   reader : ", reader, "  contact id : ", this.state.cid);
    new AttachmentApi().createAttachment( this.successCall, this.errorCall, this.state.pid, this.state.cid, reader )
  }
  successCall = (json) => {
    console.log(json)
    this.setState({ addSuccess: true, content: "Successfully added ", });
  } 
  errorCall = (err) => {
    this.setState({ content: "Something went wrong", addFail: true });
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
        <CardHeader ><strong>Add Attachment</strong></CardHeader>
      )
   }
   loadFailure = () => {
    return  <Card>
         {this.loadHeader()}
          <CardBody><center>{this.state.content}</center></CardBody>
       </Card>
   }
   loadSuccess = () =>{
    return (<Card>
      {this.loadHeader()}
       <CardBody>
          <center>{this.state.content} <br /> <br />
          <a href="/contact/manageContact" ><Button color="success" > Goto Contacts </Button></a></center>
       </CardBody>
    </Card>)
   }
   loadAddAttachment = () => {
    return(
        <Card>
          {this.loadHeader() }
          <FormGroup>
            <br></br>
            <center>
              <input type="file" onChange={e=>this.handleInput(e)}/>
            </center>
            <br />
            <center>
              <Button color="info" onClick={e=>this.handleSubmit(e)}> Add </Button>&nbsp;&nbsp;
              <a href="/contact/manageContact/" style={{textDecoration:'none'}} > <Button active  color="light" aria-pressed="true">Cancel</Button></a><br/><br/>
            </center>
          </FormGroup>
        </Card>
    )
   }
}

export default AddAttachment;