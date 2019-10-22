import React, { Component } from 'react';
import { Card, FormGroup, Button, Alert, Col, CardBody } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Redirect } from 'react-router';
import BillAttachmentsApi from '../../../services/BillAttachmentsApi';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import Config from '../../../data/Config';
import Store from '../../../data/Store';

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
    const { profileId, billId } = Store.getBillIdforAttechments("BILL_ID_ATTACH");
    const { file } = this.state;
    if (file) {
      let reader = new FormData();
      reader.append('file', file);
      if (profileId && billId) {
        this.setState({ doubleClick: false });
        new BillAttachmentsApi().createAttachment(this.successCall, this.errorCall, profileId, billId, reader);
      } 
    } else {
      this.callAlertTimer('danger', "Please select a file to upload");
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
    const { addSuccess, cancelAddAttachment } = this.state;
    const { profileId, billId } = this.props.location.query ? this.props.location.query : '';
    if (addSuccess || cancelAddAttachment) {
      return <Redirect to={{ pathname: "/bills/attachments", query: { profileId: profileId, billId: billId } }} />
    } else {
      return this.loadAddAttachment();
    }
  }

  loadAddAttachment = () => {
    const { color, content } = this.state
    return <Card>
      {ShowServiceComponent.loadHeader("ADD ATTACHMENT")}
      <CardBody>
        <Col sm="4" md={{ size: 8, offset: 3 }}>
          {color && <Alert color={color} >{content}</Alert>}
          <AvForm onSubmit={this.handlePostData}  >
            <AvField type="file" name="file" label="Select File to upload" onChange={e => this.handleInput(e)} />
            <FormGroup>
              <Button color="info" disabled={this.state.doubleClick} > Upload </Button> &nbsp;&nbsp;
              <Button active color="light" type="button" onClick={this.cancelAddAttachment} >Cancel</Button>
            </FormGroup>
          </AvForm>
        </Col>
      </CardBody>
    </Card>
  }
}

export default AddBillAttachment;