import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Row, Col, Modal, ModalHeader, Alert } from 'reactstrap';
import { FaTrashAlt, FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BillAttachmentsApi from '../../../services/BillAttachmentsApi';
import AttachmentUtils from '../../utility/AttachmentUtils';
import { DeleteModel } from '../../utility/DeleteModel';
import { ShowServiceComponent } from '../../utility/ShowServiceComponent';
import Config from '../../../data/Config';
import Store from '../../../data/Store';
import '../../../css/style.css';
import AddBillAttachment from './AddBillAttachment';

class BillAttachments extends Component {
    /*
      * After render completed in backgground call get attachment Api.
      * Avoid api call use this variabel _isMount.
    */
    _iMount = false;
    constructor(props) {
        super(props);
        this.state = {
            profileId:'',
            billId:'',
            attachments: [],
            dropdownOpen: [],
            reAttachment: ''
        }
    }
    // componentWillMount() {
    //     this._iMount = true;
    //     const { profileId, billId } = Store.getProfileIdAndBillId();
    //     this.setState({ profileId, billId })
    // }

    componentDidMount() {
        this._iMount = true;
        const { profileId, bill } = this.props
        // const { profileId, billId } = this.state
        if (profileId && bill && bill.id) {
            new BillAttachmentsApi().getBillAttachments(this.successCall, this.errorCall, profileId, bill.id);
        }
    }

    componentWillUnmount() {
        this._iMount = false;
    }

    componentDidUpdate = () => {
        if (this.state.color === "success" && this.props.profileId) {
            new BillAttachmentsApi().getBillAttachments(this.successCall, this.errorCall, this.state.profileId, this.state.billId);
        }
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

    addBillAttachment = () =>{
        console.log(this.props.bill);
        this.setState( { addAttachmentRequest: !this.state.addAttachmentRequest });
    }
    render() {
        const { attachments, danger, spinner, addAttachmentRequest } = this.state;
        if (this.props.bill) {
            if (!spinner) {
                return ShowServiceComponent.loadSpinner('ATTACHMENTS')
            } else if (addAttachmentRequest) {
                return <div> <AddBillAttachment profileId={this.props.profileId} bill={this.props.bill}/> </div>
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

    loadHeader = () => {
        return <CardHeader>
            <div className="black-color padding-top">
                <strong>ATTACHMENTS
                    {/* <Link to="/bills/attachments/add" > */}
                    {this.props.bill && <FaCloudUploadAlt style={{ marginRight: 10 }} onClick={()=>this.addBillAttachment()} className="float-right" color="#020b71" size={20} />}
                    {/* </Link> */}
                </strong>
            </div>
        </CardHeader>
    }

    showNoAttachments = () => {
        return <Card>
            {this.loadHeader()}
            <center className="column-text"> <CardBody>
            <h5><b>{this.props.bill && this.props.bill.id ? "You haven't added any attachments for this Bill. Please add now..." :  "For attchments you need bill id"}</b></h5><br /> </CardBody> </center>
        </Card>
    }

    loadAttachments() {
        const { attachments, color, content } = this.state
        return (
            <Card>
                {this.loadHeader()}
                <CardBody>
                    {color && <Alert color={color}>{content}</Alert>}
                    {attachments.map((attachment, key) => { return <div key={key}>{this.loadAttachment(attachment, key)}</div> })}
                </CardBody>
            </Card>)
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