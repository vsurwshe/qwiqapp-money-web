import React, { Component } from 'react';
import { Card, CardBody, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaTrashAlt, FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import AttachmentApi from '../../../services/AttachmentApi';
import AddAttachment from './AddAttachment';
import Attachment from './Download_View_Delete_Attachment';
import { DeleteModel } from '../../uitility/deleteModel';

class Attachments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.profileId,
      contactId: props.contactId,
      getCount: props.getCount,
      count: 0,
      attachmentId: 0,
      attachments: [],
      dropdownOpen: [],
      addFile: false,
      downloadAttachmentFile: false,
      viewLink: '',
      pic: '',
      reattachment: '',
      display: false,
      viewData: ''
    }
  }

  componentDidMount = () => {
    new AttachmentApi().getAttachments(this.successCall, this.errorCall, this.state.profileId, this.state.contactId);
  }

  successCall = async (attachments) => {
    await this.setState({ attachments: attachments, count: attachments.length });
  }

  success = (message) => {
    window.location.reload();
  }

  errorCall = (err) => {  }

  loadDropdown = () => {
    this.state.attachment.map(attachment => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
      }))
    });
  }

  toggleDanger = (id) => {
    this.setState({ danger: !this.state.danger });
    if (id !== null || id !== '') { this.setState({ attachmentId: id }) }
  }

  toggleView = (viewData, reattachment) => {
    this.setState({ display: !this.state.display, viewData, reattachment });
  }

  deleteAttachmentRequest = async () => {
    this.setState({ danger:!this.state.danger  });
    await Attachment.DeleteAttachment(this.success, this.errorCall, this.state.profileId, this.state.contactId, this.state.attachmentId)
  }

  downloadLink = async (reattachment) => {
    Attachment.DownloadAttachment(reattachment).then(response => console.log(response));
  }
  viewLink = (reattachment) => {
    Attachment.viewAttachment(reattachment).then(response => this.toggleView(response, reattachment));
  }
  handleAddFile = () => {
    this.setState({ addFile: !this.state.addFile });
  }

  render() {
    const { attachments, profileId, contactId, getCount, count } = this.state;
    if (getCount) {
      if (count === 0) {
        return null;
      } else {
        return <span style={{ color: '#000000' }}>&nbsp;( {count} Attachments )</span>
      }
    } else if (count === 0 | this.state.addFile) {
      return <div><AddAttachment profileId={profileId} contactId={contactId} addFile={this.handleAddFile} /></div>
    }
    else {
      return <div>{this.loadAttachments(attachments, profileId, contactId)}
        {this.deleteAttachment()} {this.displayAttachment()}
      </div>
    }
  }

  loadAttachments(attachments) {
    return (
      <Card>
        <div style={{ paddingTop: 10, color: '#000000' }}><strong><center>ATTACHMENTS<FaCloudUploadAlt style={{ marginRight: 10 }} className="float-right" color="#020b71" size={20} onClick={this.handleAddFile} /></center></strong>
        </div>
        <CardBody>
          {attachments.map((attach, key) => { return <div key={key}>{this.loadAttachment(attachments[key], key)}</div> })}
        </CardBody>
      </Card>)
  }

  loadAttachment = (attachment, key) => {
    const styles = { marginRight: 10 }
    return (
      <div className="list">
        <div className="list-item" key={key}>
          <Row>
            <Col><Button onClick={() => { this.downloadLink(attachment) }} color="link">{attachment.filename}</Button> &nbsp;({this.attachmentFileSize(attachment.sizeBytes)})</Col>
            <FaEye color="#1E90FF" size={20} className="float-right" style={{ marginTop: -4, marginRight: 10 }} onClick={e => this.viewLink(attachment)} />{"    "}<span className="float-right">{"  "}</span>
            <FaTrashAlt color="#ff0000" className="float-right" style={styles} onClick={() => { this.toggleDanger(attachment.id, key) }} /><span className="float-right">{"  "}</span>
          </Row>
        </div>
      </div>)
  }
  
  attachmentFileSize = (bytes) => {
    if (bytes === 0) { return "0.00 B"; }
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(2) + ' ' + ' KMGTPEZY'.charAt(e) + 'B';
  }

  deleteAttachment = () => {
    const { danger } = this.state
    return(<DeleteModel danger={danger} headerMessage="Delete Attachment " bodyMessage="Are You Sure Want to Delete Attachment?" 
    toggleDanger={this.toggleDanger} delete={this.deleteAttachmentRequest} cancel={this.toggleDanger} />);
  }

  displayAttachment = () => {
    const { display, viewData, reattachment } = this.state
    return (
      <Modal isOpen={display} centered={true} className={this.props.className}>
        <ModalHeader toggle={() => { this.toggleView() }}>{reattachment === undefined ? '' : reattachment.filename}</ModalHeader>
        <ModalBody>
          <center>
            <embed src={viewData} style={{ height: 300 }}></embed>
          </center>
        </ModalBody>
      </Modal>)
  }
}

export default Attachments;