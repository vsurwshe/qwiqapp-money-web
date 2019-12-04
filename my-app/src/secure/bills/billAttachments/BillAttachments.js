import React, { Component } from 'react';
import { Button, Row, Modal, ModalHeader, Alert, Table } from 'reactstrap';
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
            reAttachment: ''
        }
    }

    //Calling BillAttachments api to get attachments
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
        const { attachmentAdded, profileId, billId } = this.state
        if (attachmentAdded && profileId) {
            new BillAttachmentsApi().getBillAttachments(this.successCall, this.errorCall, profileId, billId);
            this.attachmentAdded();
        }
    }

    // This method is called when user clicks on Add Attachment
    attachmentAdded = () => {
        this.setState({ attachmentAdded: !this.state.attachmentAdded });
    }

    successCall = async (attachments) => {
        if (this._iMount) {
            await this.setState({ attachments, spinner: true });
        }
    }

    // This method is called when user clicks on Delete attachment
    toggleDanger = (id, fileName) => {
        this.setState({ danger: !this.state.danger });
        if (id) {
            this.setState({ attachmentId: id, fileName, })
        }
    }

    // This method displays the attachment in view mode
    toggleView = (viewData, reAttachment) => {
        this.setState({ display: !this.state.display, viewData, reAttachment });
    }

    // This method calls the AttachmentUtils api to delete an attachment
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

    // This method calls the api to download the attachment
    downloadLink = async (reAttachment) => { AttachmentUtils.downloadAttachment(reAttachment).then(response => console.log(response)) }

    // This method calls the api to view the attachment
    viewLink = (reAttachment) => { AttachmentUtils.viewAttachment(reAttachment).then(response => this.toggleView(response, reAttachment)) }

    // This method is called when user clicks on Upload File
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
                return <div> <AddBillAttachment profileId={profileId} bill={bill} addAttachmentSuccess={this.addAttachmentSuccess} attachmentAdded={this.attachmentAdded} cancel={this.addBillAttachment} /> </div>
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

    // This loads the header 
    loadHeader = (bill) => <><Row style={{ float: 'right' }}>
        <div >{bill && <Button className="rounded" style={{ backgroundColor: "transparent", marginRight: 20 }} onClick={() => this.addBillAttachment()}><FaCloudUploadAlt color="#020b71" size={22} />&nbsp;&nbsp;Upload File </Button>} </div>
    </Row> <br /><br />
    </>

    // This will be called when there are no attachments for a bill
    showNoAttachments = () => {
        const { bill } = this.props
        return <> {this.loadHeader(bill)}
            <center className="column-text">
                <h5><b>{bill && bill.id ? "You haven't added any attachments for this Bill. Please add now..." : "For attchments you need bill id"}</b></h5><br />
            </center>
        </>
    }

    // This will show all the attachments of a bill
    loadAttachments() {
        const { attachments, color, content } = this.state
        const { bill } = this.props
        return <>{this.loadHeader(bill)}
            {content && <Alert color={color}>{content}</Alert>}
            <Table frame="box" style={{ borderColor: "#DEE9F2", marginTop: 15 }}>
                <tbody>
                    {attachments.map((attachment, key) => { return this.loadAttachment(attachment, key) })}
                </tbody>
            </Table>
        </>
    }

    // This will load attachment one by one in a row
    loadAttachment = (attachment, key) => <tr key={key}>
        <td colSpan="1"><Button onClick={() => { this.downloadLink(attachment) }} color="link">{attachment.filename}</Button> &nbsp;({this.attachmentFileSize(attachment.sizeBytes)})</td>
        <td colSpan="3">
            <Button className="rounded float-right" style={{ backgroundColor: "transparent", marginRight: 10 }} onClick={() => this.toggleDanger(attachment.id, attachment.filename)}><FaTrashAlt color="#ff0000" />&nbsp;Delete</Button> &nbsp;&nbsp;
            <Button className="rounded float-right" style={{ backgroundColor: "transparent", marginRight: 20 }} onClick={e => this.viewLink(attachment)}><FaEye color="#1E90FF" size={20} /> &nbsp;View </Button>
        </td>
    </tr>

    // This method calculates the file size of an attachment
    attachmentFileSize = (bytes) => {
        if (bytes === 0) { return "0.00 B"; }
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, e)).toFixed(2) + ' ' + ' KMGTPEZY'.charAt(e) + 'B';
    }

    // This method calls the delete modal when user clicks on delete
    deleteAttachment = () => {
        const { danger } = this.state;
        return <DeleteModel danger={danger} headerMessage="Delete Attachment" bodyMessage={this.state.fileName}
            toggleDanger={this.toggleDanger} delete={this.deleteAttachmentRequest} cancel={this.toggleDanger} >attachment </DeleteModel>
    }

    // Displays the attachment in Modal 
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