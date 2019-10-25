import React, { Component } from 'react';
import { Card, CardBody, Button, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { FaTrashAlt, FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import AttachmentApi from '../../../services/AttachmentApi';
import AddAttachment from './AddAttachment';
import AttachmentUtils from '../../utility/AttachmentUtils';
import { DeleteModel } from '../../utility/DeleteModel';

class Attachments extends Component {
  _isMount = false;
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.profileId,
      contactId: props.contactId,
      getCount: props.getCount,
      attachments: [],
      dropdownOpen: [],
      addFile: false,
      reAttachment: '',
      display: false,
      viewData: ''
    }
  }

  componentDidMount () {
    this._isMount = true;
    new AttachmentApi().getAttachments(this.successCall, this.errorCall, this.state.profileId, this.state.contactId);
  }

  componentWillUnmount(){
    this._isMount = false;
  }

  successCall =  (attachments) => {    
    if(this._isMount){
      this.setState({ attachments: attachments, count: attachments.length});
    }
  }

  loadDropdown = () => {
    this.state.attachment.map(attachment => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
      }))
    });
  }

  toggleDanger = (attachmentId, fileName) => {
    this.setState({ danger: !this.state.danger });
    if (attachmentId) {
      this.setState({ attachmentId, fileName })
    }
  }

  toggleView = (viewData, reAttachment) => {
    this.setState({ display: !this.state.display, viewData, reAttachment });
  }

  deleteAttachmentRequest = async () => {
    this.setState({ danger: !this.state.danger });
    const { profileId, contactId, attachmentId } = this.state;
    await AttachmentUtils.deleteAttachment(this.success, this.errorCall, profileId, contactId, attachmentId)
  }

  success = (message) => {
    window.location.reload();
  }

  errorCall = (err) => {
    console.log(err);
  }

  downloadLink = async (reAttachment) => {
    AttachmentUtils.downloadAttachment(reAttachment).then(response => console.log(response));
  }

  viewLink = (reAttachment) => {
    AttachmentUtils.viewAttachment(reAttachment).then(response => this.toggleView(response, reAttachment));
  }

  handleAddFile = () => {
    this.setState({ addFile: !this.state.addFile });
  }

  render() {
    const { attachments, profileId, contactId, getCount, count, danger } = this.state;
    if (getCount) {
      if (!count) {
        return null;
      }
      else { return <span style={{ color: '#000000' }}>&nbsp;( {count} Attachments )</span> }
    } else if (count === 0 || this.state.addFile) {
      return <div><AddAttachment profileId={profileId} contactId={contactId} addFile={this.handleAddFile} /></div>
    } else if (danger) {
      return <div>{this.deleteAttachment()} {this.loadAttachments(attachments)} </div>
    } else {
      return <div>{this.loadAttachments(attachments)}{this.displayAttachment()} </div>
    }
  }

  loadAttachments(attachments) {
    return (
      <Card>
        <div style={{ paddingTop: 10, color: '#000000' }}><strong><center>ATTACHMENTS<FaCloudUploadAlt style={{ marginRight: 10 }}
          className="float-right" color="#020b71" size={20} onClick={this.handleAddFile} /></center></strong>
        </div>
        <CardBody>
          {attachments.map((attachment, key) => { return <div key={key}>{this.loadAttachment(attachment, key)}</div> })}
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
            <FaTrashAlt color="#ff0000" className="float-right" style={styles} onClick={() => this.toggleDanger(attachment.id, attachment.filename)} /><span className="float-right">{"  "}</span>
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
    const { danger } = this.state;
    return <DeleteModel danger={danger} headerMessage="Delete Attachment" bodyMessage={this.state.fileName}
      toggleDanger={this.toggleDanger} delete={this.deleteAttachmentRequest} cancel={this.toggleDanger} >attachment </DeleteModel>
  }

  displayAttachment = () => {
    const { display, viewData, reAttachment } = this.state;
    return (<Modal isOpen={display} size="xl" style={{ height: window.screen.height }} className={this.props.className} >
      <ModalHeader toggle={() => { this.toggleView() }}>{reAttachment && reAttachment.filename}</ModalHeader>
      <object size="xl" style={{ height: window.screen.height }} data={viewData} >
        <embed src={viewData} />
      </object>
    </Modal>
    )
  }
}

export default Attachments;