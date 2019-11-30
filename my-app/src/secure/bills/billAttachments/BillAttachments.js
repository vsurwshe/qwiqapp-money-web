import React, { Component } from 'react';
import { Button, Row, Col, Modal, ModalHeader, Alert } from 'reactstrap';
import { FaTrashAlt, FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import BillAttachmentsApi from '../../../services/BillAttachmentsApi';
import AttachmentUtils from '../../utility/AttachmentUtils';
import { DeleteModel } from '../../utility/DeleteModel';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import Config from '../../../data/Config';
import AddBillAttachment from './AddBillAttachment';
import '../../../css/style.css';


class BillAttachments extends Component {
    /*
      * After render completed in backgground call get attachment Api.
      * Avoid api call use this variabel _isMount.
    */
    _iMount = false;
    constructor(props) {
        super(props);
        this.state = {
            profileId: props.profileId,
            billId: props.bill && props.bill.id,
            attachments: [],
            dropdownOpen: [],
            reAttachment: ''
        }
    }

    componentDidMount() {
        this._iMount = true;
        const { profileId, bill } = this.props
        if (profileId && bill && bill.id) {
            new BillAttachmentsApi().getBillAttachments(this.successCall, this.errorCall, profileId, bill.id);
        }
    }

    // while deleted attachment then call the attachment API for updated result.
    componentWillUpdate() {
        const { profileId, bill } = this.props
        if (this.state.color === 'success') {
            new BillAttachmentsApi().getBillAttachments(this.successCall, this.errorCall, profileId, bill.id);
        }
    }

    componentWillUnmount() {
        this._iMount = false;
    }

    /* while add attachment then call the attachment API for updated result.
       we can use one method(componentDidUpdate/ componentWillUpdate) for updated result of add/delete, 
       but in addaing attachment we are using another component(AddBillAttachment). Here only our Success message showing */
    componentDidUpdate = () => {
        if (this.state.attachementAdded && this.props.profileId) {
            new BillAttachmentsApi().getBillAttachments(this.successCall, this.errorCall, this.state.profileId, this.state.billId);
            this.attachementAdded();
        }
    }

    attachementAdded = () => {
        this.setState({ attachementAdded: !this.state.attachementAdded });
    }

    successCall = async (attachments) => {
        if (this._iMount) {
            await this.setState({ attachments: attachments, spinner: true });
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

    toggleDanger = (id, fileName) => {
        this.setState({ danger: !this.state.danger });
        if (id) {
            this.setState({ attachmentId: id, fileName, })
        }
    }

    toggleView = (viewData, reAttachment) => {
        this.setState({ display: !this.state.display, viewData, reAttachment });
    }

    deleteAttachmentRequest = async () => {
        this.setState({ danger: !this.state.danger });
        const { profileId, billId, attachmentId } = this.state;
        await AttachmentUtils.deleteAttachment(this.success, this.errorCall, profileId, billId, attachmentId, true);
    }

    success = () => { this.callAlertTimer("success", 'Attachment Deleted !!') }

    errorCall = () => {
        this.callAlertTimer("danger", 'Unable to process request, please try later !!');
        this.setState({ spinner: true });
    }

    callAlertTimer = (color, content) => {
        this.setState({ color, content });
        if (color === 'success') {
            setTimeout(() => {
                this.setState({ color: '', content: '' });
            }, Config.apiTimeoutMillis);
        }
    }

    downloadLink = async (reAttachment) => { AttachmentUtils.downloadAttachment(reAttachment).then(response => console.log(response)) }

    viewLink = (reAttachment) => { AttachmentUtils.viewAttachment(reAttachment).then(response => this.toggleView(response, reAttachment)) }

    addBillAttachment = () => {
        this.setState({ addAttachmentRequest: !this.state.addAttachmentRequest });
    }

    addAttachmentSuccess = (color, content) => {
        this.callAlertTimer(color, content)
        this.addBillAttachment();
    }
    addAttachmentFail = (err) => {
        this.addBillAttachment();
    }

    render() {
        const { attachments, danger, spinner, addAttachmentRequest } = this.state;
        const { bill, profileId } = this.props
        if (bill) {
            if (!spinner) {
                return ShowServiceComponent.loadSpinner('ATTACHMENTS')
            } else if (addAttachmentRequest) {
                return <div> <AddBillAttachment profileId={profileId} bill={bill} addAttachmentSuccess={this.addAttachmentSuccess} attachementAdded={this.attachementAdded} cancel={this.addBillAttachment} /> </div>
            } else if (!attachments.length) {
                return this.showNoAttachments()
            } else if (danger) {
                return <div>{danger && this.deleteAttachment()} {this.loadAttachments()} </div>
            } else {
                return <div>{this.loadAttachments()}{this.displayAttachment()} </div>
            }
        } else {
            return this.showNoAttachments()
        }
    }

    showNoAttachments = () => {
        const { bill } = this.props
        return <>
            <Row style={{ float: 'right' }}>
                <div >{bill && <FaCloudUploadAlt style={{ marginRight: 10, }} onClick={() => this.addBillAttachment()} color="#020b71" size={35} />}</div>
            </Row> <br /><br />
            <center className="column-text">
                <h5><b>{bill && bill.id ? "You haven't added any attachments for this Bill. Please add now..." : "For attchments you need bill id"}</b></h5><br />
            </center>
        </>
    }

    loadAttachments() {
        const { attachments, color, content } = this.state
        const { bill } = this.props
        return <>
            <Row style={{ float: 'right' }}>
                <div >{bill && <FaCloudUploadAlt style={{ marginRight: 10, }} onClick={() => this.addBillAttachment()} color="#020b71" size={35} />}</div>
            </Row> <br /><br /><br />
            {content && <Alert color={color}>{content}</Alert>}
            <Row><Col>
                {attachments.map((attachment, key) => { return <div key={key}>{this.loadAttachment(attachment, key)}</div> })}</Col>
            </Row>
        </>
    }

    loadAttachment = (attachment, key) => {
        const styles = { marginRight: 10 };
        return <div className="list">
            <div className="list-item" key={key}>
                <Row>
                    <Col><Button onClick={() => { this.downloadLink(attachment) }} color="link">{attachment.filename}</Button> &nbsp;({this.attachmentFileSize(attachment.sizeBytes)})</Col>
                    <FaEye color="#1E90FF" size={20} className="float-right" style={{ marginTop: -4, marginRight: 10 }} onClick={e => this.viewLink(attachment)} /><span className="float-right"></span>
                    <FaTrashAlt color="#ff0000" className="float-right" style={styles} onClick={() => this.toggleDanger(attachment.id, attachment.filename)} /><span className="float-right"></span>
                </Row>
            </div>
        </div>
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
        return <Modal isOpen={display} size="xl" style={{ height: window.screen.height }} className={this.props.className} >
            <ModalHeader toggle={() => { this.toggleView() }}>{reAttachment && reAttachment.filename}</ModalHeader>
            <object size="xl" style={{ height: window.screen.height }} data={viewData} >
                <embed src={viewData} />
            </object>
        </Modal>
    }
}

export default BillAttachments;