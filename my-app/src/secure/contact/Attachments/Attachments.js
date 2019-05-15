import React, { Component } from 'react';
import { Card, CardBody, Button, Row, Col, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import { FaTrashAlt, FaCloudUploadAlt,FaEye } from 'react-icons/fa';
import DeleteAttachment from './DeleteAttachment';
import AttachmentApi from '../../../services/AttachmentApi';
import AddAttachment from './AddAttachment';
import DownloadAttachment from './DownloadAttachment';

class Attachments extends Component{
  constructor(props){
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
      deleteRequest: false,
      downloadAttachmentFile:false,
      viewLink:'',
      pic:'',
    }
  }

  componentDidMount = () => {
    new AttachmentApi().getAttachments (this.successCall, this.errorCall, this.state.profileId, this.state.contactId);
  }
  successCall = async (attachments) =>{
    await this.setState({ attachments : attachments, count : attachments.length });
}
   errorCall = (err) =>{ console.log("Error : ", err) }
  
  loadDropdown = () =>{
    this.state.attachment.map(attachment => {return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
    }))});
  }

  toggleDanger = (id) => {
    this.setState({ danger: !this.state.danger });
    if(id !== null || id !== ''){ this.setState({ attachmentId : id }) }
  }

  deleteAttachmentRequest = () =>{
    this.setState({ deleteRequest : true});
  }

  downloadLink = (downloadLink) =>{ 
    console.log("attachment File:",downloadLink );
    this.setState({downloadAttachmentFile:!this.state.downloadAttachmentFile,downloadLink})
  }

  handleAddFile = () => {
     this.setState({ addFile : !this.state.addFile });
  }

  render(){
    const { attachments, profileId, contactId, attachmentId, getCount, count, deleteRequest } = this.state;
      if(getCount){
        if( count === 0 ){
            return null;
        }else{
            return <span style={{color:'#000000'}}>&nbsp;( {count} Attachments )</span> 
        }
      } else if (count === 0 | this.state.addFile) {
          return <div><AddAttachment profileId={profileId} contactId={contactId} addFile={this.handleAddFile} /></div>
      } else if (deleteRequest) {
          return <div><DeleteAttachment profileId={profileId} contactId={contactId} attachId={attachmentId} /></div>
      }else if(this.state.downloadAttachmentFile){
        return <div><DownloadAttachment downloadLink={this.state.downloadLink} profileId={profileId} contactId={contactId} attachId={attachmentId} /></div>
      } else {
          return <div>{this.loadAttachments(attachments, profileId, contactId)}{this.deleteAttach()}</div>
      }
  }
  
  loadAttachments(attachments){
    return(
      <Card>
        <div style={{paddingTop:10, color:'#000000'}}><strong><center>ATTACHMENTS<FaCloudUploadAlt style={{marginRight:10}} className="float-right" color="#020b71" size={20} onClick={this.handleAddFile} /></center></strong>
         </div>
        <CardBody>
          {attachments.map((attach, key) => {return <div key={key}>{this.loadAttachment(attachments[key], key)}</div>})}
        </CardBody>
      </Card>)
  }

  loadAttachment = (attachment, key) => {
    // console.log(attachment.downloadLink,"\n", attachment.viewLink)
    const styles = { marginRight : 10 }
    return (
      <div className="list">
        <div className="list-item" key={key}>
          <Row>
            <Col><Button onClick={()=>{this.downloadLink(attachment.downloadLink)}} color="link" rel="noopener noreferrer" target="_blank">{attachment.filename}</Button> &nbsp;({this.sizeOf(attachment.sizeBytes)})</Col>
            <FaEye color="#1E90FF" size={20} className="float-right" style={{marginTop:-4, marginRight:10}} onClick={e=>this.downloadLink(attachment.viewLink)} />{"    "}<span className="float-right">{"  "}</span>
            <FaTrashAlt color="#ff0000" className="float-right" style={styles} onClick={()=>{this.toggleDanger(attachment.id, key)}} /><span className="float-right">{"  "}</span>
          </Row>
        </div>
      </div>)
  }  

  download = (link) => { window.open(link) }

  sizeOf = (bytes) => {
    if (bytes === 0) { return "0.00 B"; }
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes/Math.pow(1024, e)).toFixed(2)+' '+' KMGTPEZY'.charAt(e)+'B';
 }

  deleteAttach = ()=>{
    const { danger } = this.state
    return (
      <Modal isOpen = {danger} className = {'modal-danger'}>
          <ModalHeader toggle={()=>{this.toggleDanger()}}>Delete Attachment</ModalHeader>
          <ModalBody>Are you Sure you want to Delete This Attachment ?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={()=>this.deleteAttachmentRequest()}>Delete</Button>
            <Button color="secondary" onClick={()=>{this.toggleDanger()}}>Cancel</Button>
          </ModalFooter>
      </Modal>)
  }
}

export default Attachments;