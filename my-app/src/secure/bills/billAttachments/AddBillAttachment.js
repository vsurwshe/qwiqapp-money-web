import React, { Component } from 'react';
import { FormGroup, Button, Alert, Col, CardBody } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import BillAttachmentsApi from '../../../services/BillAttachmentsApi';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import Config from '../../../data/Config';
import { FileUploadForm, FilePreview } from '../../utility/FileUploadAction';
;

class AddBillAttachment extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleInput = (files) => {
    if (files[0].size >= 5242880) {
      this.setState({ color: 'danger', content: "Uploaded file size must be below 5 MB" });
    } else {
      this.setState({ file: files[0], color: '', content: '' });
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
    if (err.response && err.response.status === 500) {
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
        this.setState({ color: '', content: '' });
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
      {ShowServiceComponent.loadHeader("ADD ATTACHMENT")}
      <CardBody>
        {color && <Alert color={color} >{content}</Alert>}
        <Col md={{ size: 12, offset: 2 }} className="files">
          <AvForm onSubmit={this.handlePostData}>
            <FileUploadForm handleInput={this.handleInput} />
            <br />
            <FormGroup>
              <Button color="info" disabled={this.state.doubleClick} > Upload </Button> &nbsp;&nbsp;
                <Button active color="light" type="button" onClick={this.props.cancel} >Cancel</Button>
            </FormGroup>
          </AvForm>
          {this.state.file && this.displayFile()}
        </Col>
      </CardBody>
    </>
  }

  displayFile = () => {
    const { file } = this.state
    return <FilePreview file={file} />
  }
}

export default AddBillAttachment;