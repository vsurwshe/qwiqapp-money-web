import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { FaTrashAlt, FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import BillAttachmentsApi from '../../services/BillAttachmentsApi';
import AddBillAttachment from './AddBillAttachment';
import Attachment from '../utility/Download_View_Delete_Attachment';
import { DeleteModel } from '../utility/DeleteModel';

class BillAttachments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileId: props.profileId,
            billId: props.billId,
            getCount: props.getCount,
            count: 0,
            attachmentId: 0,
            attachments: [],
            dropdownOpen: [],
            addFile: false,
            viewLink: '',
            reattachment: '',
            display: false,
            viewData: '',
        }
    }

    componentDidMount = () => {
        new BillAttachmentsApi().getAttachments(this.successCall, this.errorCall, this.state.profileId, this.state.billId);
    }

    successCall = async (attachments) => {
        await this.setState({ attachments: attachments, count: attachments.length });
    }

    loadDropdown = () => {
        this.state.attachment.map(attachment => {
            return this.setState(prevState => ({
                accordion: [...prevState.accordion, false],
                dropdownOpen: [...prevState.dropdownOpen, false]
            }))
        });
    }

    toggleDanger = (id, fileName) => {
        this.setState({ danger: !this.state.danger });
        if (id) {
            this.setState({ attachmentId: id, fileName, })
        }
    }

    toggleView = (viewData, reattachment) => {
        this.setState({ display: !this.state.display, viewData, reattachment });
    }

    deleteAttachmentRequest = async () => {
        this.setState({ danger: !this.state.danger });
        const { profileId, billId, attachmentId } = this.state;
        await Attachment.deleteAttachment(this.success, this.errorCall, profileId, billId, attachmentId,true)
    }

    success = (message) => {
        window.location.reload();
    }

    errorCall = (err) => {
        console.log(err);
    }

    downloadLink = async (reattachment) => {
        Attachment.downloadAttachment(reattachment).then(response => console.log(response));
    }

    viewLink = (reattachment) => {
        Attachment.viewAttachment(reattachment).then(response => this.toggleView(response, reattachment));
    }

    handleAddFile = () => {
        this.setState({ addFile: !this.state.addFile });
    }

    render() {
        const { attachments, profileId, billId, getCount, count, danger } = this.state;
        if (getCount) {
            if (!count) {
                return null;
            }
            else { return <span style={{ color: '#000000' }}>&nbsp;( {count} Attachments )</span> }
        } else if (count === 0 | this.state.addFile) {
            return <div><AddBillAttachment profileId={profileId} billId={billId} addFile={this.handleAddFile} /></div>
        } else if (danger) {
            return <div>{this.deleteAttachment()} {this.loadAttachments(attachments, profileId, billId)} </div>
        } else {
            return <div>{this.loadAttachments(attachments, profileId, billId)}{this.displayAttachment()} </div>
        }
    }

    loadAttachments(attachments) {
        return (
            <Card>
                <CardHeader>
                <div style={{ paddingTop: 10, color: '#000000' }}><strong><center>ATTACHMENTS<FaCloudUploadAlt style={{ marginRight: 10 }}
                    className="float-right" color="#020b71" size={20} onClick={this.handleAddFile} /></center></strong>
                </div>
                </CardHeader>
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
        const { display, viewData, reattachment } = this.state
        return (<Modal isOpen={display} size="xl" style={{ height: window.screen.height }} className={this.props.className} >
            <ModalHeader toggle={() => { this.toggleView() }}>{reattachment && reattachment.filename}</ModalHeader>
            <object size="xl" style={{ height: window.screen.height }} data={viewData} >
                <embed src={viewData} />
            </object>
        </Modal>
        )
    }
}

export default BillAttachments;