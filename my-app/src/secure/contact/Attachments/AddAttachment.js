import React, { Component } from 'react';
import { Card, CardBody, FormGroup, Button } from 'reactstrap';
import AttachmentApi from '../../../services/AttachmentApi';
import { ReUseComponents } from '../../utility/ReUseComponents';
import Contacts from '../Contacts';

class AddAttachment extends Component {
  state = {
    file: '',
    profileId: this.props.profileId,
    contactId: this.props.contactId,
    addSuccess: false,
    addFail: false,
    content: '',
    cancelAddAttachment: false,
    doubleClick: false
  }

  handleInput = (e) => {
    this.setState({ file: e.target.files[0] })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { profileId, contactId, file } = this.state;
    let reader = new FormData()
    reader.append('file', file);
    if (profileId !== undefined || contactId !== undefined) {
      this.setState({ doubleClick: false });
      new AttachmentApi().createAttachment(this.successCall, this.errorCall, profileId, contactId, reader)
    }

  }
  cancelAddAttachment = () => {
    this.setState({ cancelAddAttachment: true })
  }
  successCall = (json) => {
    this.setState({ addSuccess: true, content: "Successfully Added ", });
  }

  errorCall = (err) => {
    this.setState({ content: "Unable to Process, please try Again", addFail: true });
  }

  render() {
    const { addSuccess, addFail, cancelAddAttachment } = this.state;
    if (addSuccess) {
      return this.loadSuccess();
    } else if (addFail) {
      return this.loadFailure();
    } else if (cancelAddAttachment) {
      return <Contacts />
    } else {
      return this.loadAddAttachment();
    }
  }

  loadFailure = () => {
    return (
      <Card>
        {ReUseComponents.loadHeader("Add Attachment")}
        <CardBody><center>{this.state.content}</center></CardBody>
        {this.setState({ addFail: false })}
      </Card>)
  }

  loadSuccess = () => <div style={{ color: "green" }}> Added Successfully !{window.location.reload()}</div>

  loadAddAttachment = () => {
    return (
      <Card>
        {ReUseComponents.loadHeader("Add Attachment")}
        <FormGroup> <br></br>
          <center>
            <input type="file" onChange={e => this.handleInput(e)} /> <br /><br />
            <Button color="info" onClick={e => this.handleSubmit(e)} disabled={this.state.doubleClick} > Add </Button>&nbsp;&nbsp;
            <Button active color="light" aria-pressed="true" onClick={() => window.location.reload()}>Cancel</Button><br /><br />
          </center>
        </FormGroup>
      </Card>
    )
  }
}

export default AddAttachment;