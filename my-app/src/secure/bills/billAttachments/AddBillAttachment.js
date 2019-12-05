import React, { Component } from 'react';
import { Card, FormGroup, Button, Alert, Col, CardBody, Label } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import BillAttachmentsApi from '../../../services/BillAttachmentsApi';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import Config from '../../../data/Config';

class AddBillAttachment extends Component {
   constructor(props){
     super(props);
     this.state = {
      file: '',
      color: '',
      content: ''
     }
   }

  handleInput = (e) => {
    if (e.target.files[0].size >= 5242880) {
      this.setState({ color: 'danger', content: "Uploaded file size must be below 5 MB" });
    } else {
      this.setState({ file: e.target.files[0], color: '', content: '' });
    }
  }

  handlePostData = () => {
    const { profileId, bill } = this.props
    const { file } = this.state;
    if (file) {
      let reader = new FormData();
      reader.append('file', file);
      if (profileId && bill && bill.id) {
        this.setState({ doubleClick: false });
        new BillAttachmentsApi().createBillAttachment(this.successCall, this.errorCall, profileId, bill.id, reader);
      } 
    } else {
      this.callAlertTimer('danger', "Please select a file to upload");
    }
  }

  cancelAddAttachment = () => {
    this.setState({ cancelAddAttachment: true });
  }

  successCall = () => {
    this.props.attachmentAdded();
    this.callAlertTimer("success", "Attachment added Successfully !!");
  }

  errorCall = (err) => {
    if ( err.response && err.response.status === 500) {
      if (err.response.data && err.response.data.error.debugMessage) {
        this.callAlertTimer('danger', "You can not add this file, please try another file");
      } else {
        this.callAlertTimer('danger', "Sorry, you can not add attachments, please upgrade your profile");
      }
    } else {
      this.callAlertTimer('danger', "Unable to process request, please try later");
    }
  }

  callAlertTimer = (color, content) => {
    this.setState({ color, content })
    if (color === 'success') {
      setTimeout(() => {
        this.setState({ color: '', content: ''});
        this.props.cancel()
      }, Config.apiTimeoutMillis)
    }
  }

  render() {
      return this.loadAddAttachment();
  }

  loadAddAttachment = () => {
    const { color, content } = this.state
    return <>
      {/* <Card> */}
        {ShowServiceComponent.loadHeader("ADD ATTACHMENT")}
        <CardBody>
          {color && <Alert color={color} >{content}</Alert>}
          <Col md={{ size: 12, offset: 5 }}>
            <AvForm onSubmit={this.handlePostData}>
              <Label>Select a file to upload</Label><br/><br/>
              <AvField type="file" name="file" onChange={e => this.handleInput(e)} />
              <FormGroup>
                <Button color="info" disabled={this.state.doubleClick} > Upload </Button> &nbsp;&nbsp;
                <Button active color="light" type="button" onClick={this.props.cancel} >Cancel</Button>
              </FormGroup>
            </AvForm>
          </Col>
        </CardBody>
      {/* </Card> */}
    </>
  }
}

export default AddBillAttachment;