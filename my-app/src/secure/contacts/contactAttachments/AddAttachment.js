import React, { Component } from 'react';
import { Card, FormGroup, Button, Alert, Col } from 'reactstrap';
import ContactAttachmentApi from '../../../services/ContactAttachmentApi';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import Contacts from '../Contacts';
import { FileUploadForm, FilePreview } from '../../utility/FileUploadAction';

class AddAttachment extends Component {
  state = {
    profileId: this.props.profileId,
    contactId: this.props.contactId
  }

  handleInput = (files) => {
    if (files[0].size >= 5242880) {
      this.setState({ color: 'danger', content: "Uploaded file size must be below 5 MB" });
    } else {
      this.setState({ file: files[0], color: '', content: '' });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { profileId, contactId, file } = this.state;
    let reader = new FormData();
    reader.append('file', file);
    if (profileId || contactId) {
      this.setState({ doubleClick: false });
      new ContactAttachmentApi().createAttachment(this.successCall, this.errorCall, profileId, contactId, reader)
    }
  }

  cancelAddAttachment = () => {
    this.setState({ cancelAddAttachment: true })
  }

  successCall = (json) => {
    this.setState({ addSuccess: true, content: "Successfully Added !!", });
  }

  errorCall = (err) => {
    if (err.response.status === 500) {
      this.setState({ color: 'danger', content: "Sorry, you can not add attachments, please upgrade your profile" });
    } else {
      this.setState({ color: 'danger', content: "Unable to process request, please try Again" });
    }

  }

  render() {
    const { addSuccess, cancelAddAttachment } = this.state;
    if (addSuccess) {
      return this.loadSuccess();
    } else if (cancelAddAttachment) {
      return <Contacts />
    } else {
      return this.loadAddAttachment();
    }
  }

  loadSuccess = () => <div style={{ color: "green" }}> {this.state.content} {window.location.reload()}</div>

  loadAddAttachment = () => {
    return (
      <Card>
        {ShowServiceComponent.loadHeader("Add Attachment")}
        <FormGroup>
            <Col md={{ size: 12, offset: 3 }}>
            {this.state.content && <Col sm={6}><Alert color={this.state.color} >{this.state.content}</Alert></Col>}
            <FileUploadForm handleInput={this.handleInput}/>
            <br />
            <Button color="info" onClick={e => this.handleSubmit(e)} disabled={this.state.doubleClick} > Add </Button>&nbsp;&nbsp;
            <Button active color="light" aria-pressed="true" onClick={() => window.location.reload()}>Cancel</Button><br /><br />
            {this.state.file && this.displayFile()}
            </Col>
        </FormGroup>
      </Card>
    )
  }
  displayFile = () => {
    const {file} = this.state
    return <center><FilePreview file={file} /></center>
  }
}

export default AddAttachment;