import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Row, Col, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import { FaTrashAlt, FaDownload, FaEye, FaCloudUploadAlt } from 'react-icons/fa';
import DeleteAttachment from './DeleteAttachment';
import AttachmentApi from '../../../services/AttachmentApi';
import AddAttachment from './AddAttachment';


class Attachments extends Component{
    constructor(props){
        super(props);
        this.state = {
            pid:this.props.profileId,
            cid:this.props.contactId,
            // key:this.props.key,
            aid:0,
            attachment: [],
            dropdownOpen:[],
            addFile: false,
            deleteRequest: false,
        }
    }

    componentDidMount = () => {
        // new AttachmentApi().getAttachmentsById (this.successCall,this.errorCall,this.state.pid,this.state.cid, this.state.aid)
        // console.log(this.props.profileId, this.props.contactId);
        new AttachmentApi().getAttachments (this.successCall, this.errorCall, this.state.pid, this.state.cid);
    }

    successCall = (attachment) =>{
        console.log("Data Type : ", typeof attachment);
        this.setState({ attachment: attachment});
    }
    errorCall = (err) =>{ console.log("Error : ", err) }
    loadDropdown = () =>{
        this.state.attachment.map(lables=>{return this.setState(prevState => ({
            accordion: [...prevState.accordion, false],
            dropdownOpen: [...prevState.dropdownOpen, false]
        }))});
    }
    toggleDanger = (id) => {
        this.setState({ danger: !this.state.danger });
        if(id !== null || id !== ''){ this.setState({ aid: id }) }
    }
    deleteAttachmentRequest = () =>{
        this.setState({ deleteRequest: true});
    }
    view = (id)=>{
        console.log(id)
    }
    render(){
        const {attachment, pid, cid, aid,deleteRequest } = this.state;
            if (attachment.length === 0 | this.state.addFile) {
                return (<div><AddAttachment profileId={pid} contactId={cid} /></div>)
             } else if (deleteRequest) {
                 return <div><DeleteAttachment profileId={pid} contactId={cid} attachId={aid} /></div>
             } else {
                 return <div>{this.loadAttachments(attachment, pid, cid )}{this.deleteAttach()}</div>
             }
    }
    
    loadAttachments(attachment ){
        return(
           <Card>
               <CardHeader><strong>Attachments</strong> 
                <FaCloudUploadAlt color="#0000FF" size={20} className="float-right" onClick={()=>{this.setState({ addFile: !this.state.addFile });}} />
               </CardHeader>
               <CardBody >
                    {attachment.map((attach, key)=>{return (<div key={key}>{this.loadAttachment(attachment[key], key)}</div>)})}
                </CardBody>
           </Card>
        )
    }
    loadAttachment = (attachment, key) => {
        const styles = { marginRight:10 }
        return (
            <div className="list">
                <div className="list-item" key= {key}>
                    <Row>
                        <Col>{attachment.filename} &nbsp;({this.sizeOf(attachment.sizeBytes)})</Col>
                            <FaDownload color="#008000" className="float-right" style={styles} onClick={e=>this.download(attachment.downloadLink)} /><span ></span>
                            <FaEye  color="#1E90FF" size={20} className="float-right" style={{marginTop:-4, marginRight:10}} onClick={e=>this.view()} />{"    "}<span className="float-right">{"  "}</span>
                            <FaTrashAlt color="#ff0000" className="float-right" style={styles} onClick={()=>{this.toggleDanger(attachment.id, key)}} /><span className="float-right">{"  "}</span>
                    </Row>
                </div>
            </div>
        )
    }   
    download =(link)=>{ window.open(link) }
    sizeOf =(bytes) => {
        if (bytes === 0) { return "0.00 B"; }
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes/Math.pow(1024, e)).toFixed(2)+' '+' KMGTPEZY'.charAt(e)+'B';
      }
    deleteAttach = ()=>{
        const {danger} = this.state
        return (
        <Modal isOpen = {danger} className = {'modal-danger'}>
            <ModalHeader toggle={()=>{this.toggleDanger()}}>Delete Attachment</ModalHeader>
            <ModalBody>Are you Sure you want to Delete This Attachment ?</ModalBody>
            <ModalFooter>
          <Button color="danger" onClick={()=>this.deleteAttachmentRequest()}>Delete</Button>
          <Button color="secondary" onClick={()=>{this.toggleDanger()}}>Cancel</Button>
        </ModalFooter>
      </Modal>
        )
    }
}

export default Attachments;