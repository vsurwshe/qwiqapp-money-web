import React, { Component } from 'react';
import { Card, FormGroup, Button, Alert, Col } from 'reactstrap';
import BillAttachmentsApi from '../../services/BillAttachmentsApi';
import { ShowServiceComponent } from '../utility/ShowServiceComponent';
import Bills from './Bills';

class AddBillAttachment extends Component {
  state = {
    file: '',
    profileId: this.props.profileId,
    billId: this.props.billId,
    addSuccess: false,
    color: '',
    content: '',
    cancelAddAttachment: false,
    doubleClick: false
  }

  handleInput = (e) => {
    if (e.target.files[0].size >= 5242880) {
      this.setState({ color: 'danger', content: "Uploaded file size must be below 5 MB" })
    } else {
      this.setState({ file: e.target.files[0], color: '', content: '' })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { profileId, billId, file } = this.state;
    let reader = new FormData()
    reader.append('file', file);
    if (profileId || billId) {
      this.setState({ doubleClick: false });
      new BillAttachmentsApi().createAttachment(this.successCall, this.errorCall, profileId, billId, reader)
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
      return <Bills />
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
          <center>
            <Col sm={6}><Alert color={this.state.color} >{this.state.content}</Alert></Col>
            <input type="file" onChange={e => this.handleInput(e)} /> <br /><br />
            <Button color="info" onClick={e => this.handleSubmit(e)} disabled={this.state.doubleClick} > Add </Button>&nbsp;&nbsp;
            <Button active color="light" aria-pressed="true" onClick={() => window.location.reload()}>Cancel</Button><br /><br />
          </center>
        </FormGroup>
      </Card>
    )
  }
}

export default AddBillAttachment;