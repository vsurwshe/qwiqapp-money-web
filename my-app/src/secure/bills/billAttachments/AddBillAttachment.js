import React, { Component } from 'react';
import { FormGroup, Button, Alert, Col, CardBody, Label, Row } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import BillAttachmentsApi from '../../../services/BillAttachmentsApi';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import Config from '../../../data/Config';
import Files from 'react-files';
import { FaFile } from "react-icons/fa";;

class AddBillAttachment extends Component {
   constructor(props){
     super(props);
     this.state = {
      file: '',
      color: '',
      content: ''
     }
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
        {ShowServiceComponent.loadHeader("ADD ATTACHMENT")}
        <CardBody>
          {color && <Alert color={color} >{content}</Alert>}
          <Col md={{ size: 12, offset: 3 }} className="files">
            <AvForm onSubmit={this.handlePostData}>
              
              <Files
              className='files-dropzone-active'
              onChange={this.handleInput}
              accepts={['image/*', 'audio/*', 'video/mp4', 'text/*', '.pdf', '.xlsx', '.docx', '.doc']}
              multiple={false}
              clickable ><u>click here</u> to upload </Files><br />

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
    const {file} = this.state
    return (<div>
      {
          this.state.file 
          ? <div className='files-list'>
            {/* <ul>
              <li className='files-list-item' key={file.id}> */}
                <div className='files-list-item-preview'>
                  {/* {  file.type === 'image' ||   file.type === 'png' */}
                  <Row>
                  { file.preview && file.preview.type === 'image'
                  ? <object size="xl" data={file.preview.url} >
                  <embed src={file.preview.url} />
              </object>
                  // ? <img className='files-list-item-preview-image' src={file.preview.url} >I AM IMAGE </img>
                  : <div className='files-list-item-preview-extension'><FaFile /></div>}
                  {/* : <div className='files-list-item-preview-extension'>{file.extension}</div>} */}
                  
                  &nbsp; &nbsp;<div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div> &nbsp; &nbsp;
                  <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                  </Row>
                </div>
                {/* <div className='files-list-item-content'>
                  <Row>
                  <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div> &nbsp; &nbsp;
                  <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                  </Row>
                </div> */}
                <div
                  id={file.id}
                  className='files-list-item-remove'
                  // onClick={this.filesRemoveOne.bind(this, file)} // eslint-disable-line
                />
              {/* </li>
            </ul> */}
          </div>
          : null
        }
    </div>);
  }
}

export default AddBillAttachment;