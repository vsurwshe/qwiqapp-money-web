import React, { Component } from 'react';
import { Card, FormGroup, Button, Alert, Col } from 'reactstrap';
import BillAttachmentsApi from '../../services/BillAttachmentsApi';
import { ShowServiceComponent } from '../utility/ShowServiceComponent';
import BillAttachments from './BillAttachments';
import Config from '../../data/Config';

class AddBillAttachment extends Component {
  state = {
    profileId: this.props.profileId,
    billId: this.props.billId,
    file: '',
    color: '',
    content: '',
    doubleClick: false,
    addSuccess: false,
    cancelAddAttachment: false
  }

  handleInput = (e) => {
    if (e.target.files[0].size >= 5242880) {
      this.setState({ color: 'danger', content: "Uploaded file size must be below 5 MB" });
    } else {
      this.state.color && this.setState({ file: e.target.files[0], color: '', content: '' });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { profileId, billId, file } = this.state;
    if (file) {
      let reader = new FormData();
      reader.append('file', file);
      if (profileId && billId) {
        this.setState({ doubleClick: false });
        new BillAttachmentsApi().createAttachment(this.successCall, this.errorCall, 0, billId, reader);
      }
    } else {
      this.callAlertTimer('warning', "Please, select a file to continue...");
    }

  }

  cancelAddAttachment = () => {
    this.setState({ cancelAddAttachment: true });
  }

  successCall = (json) => {
    this.callAlertTimer("success", "Attachment added Successfully !!");
  }

  errorCall = (err) => {
    if (err.response.status === 500) {
      this.callAlertTimer('danger', "Sorry, you can not add attachments, please upgrade your profile");
    } else {
      this.callAlertTimer('danger', "Unable to process request, please try later");
    }
  }

  callAlertTimer = (color, content) => {
    this.setState({ color, content })
    if (color === 'success') {
      setTimeout(() => {
        this.setState({ color: '', content: '', addSuccess: true });
      }, Config.apiTimeoutMillis)
    }
  }

  render() {
    const { addSuccess, cancelAddAttachment, profileId, billId } = this.state;
    if (addSuccess || cancelAddAttachment) {
      return <BillAttachments profileId={profileId} billId={billId} />
    } else {
      return this.loadAddAttachment();
    }
  }

  loadAddAttachment = () => {
    return (
      <Card>
        {ShowServiceComponent.loadHeader("ADD ATTACHMENT")}
        <FormGroup>
          <center>
            <Col sm={6}><Alert color={this.state.color} >{this.state.content}</Alert></Col>
            <input type="file" onChange={e => this.handleInput(e)} /> <br /><br />
            <Button color="info" onClick={e => this.handleSubmit(e)} disabled={this.state.doubleClick} > Add </Button>&nbsp;&nbsp;
            <Button active color="light" aria-pressed="true" onClick={this.cancelAddAttachment}>Cancel</Button><br /><br />
          </center>
        </FormGroup>
      </Card>
    )
  }
}

export default AddBillAttachment;