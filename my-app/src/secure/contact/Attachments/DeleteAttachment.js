import React,  { Component } from 'react';
import { Card, CardHeader,CardBody, Button } from 'reactstrap'
import AttachmentApi from '../../../services/AttachmentApi';

class DeleteAttachment extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            proId: props.profileId,
            contId: props.contactId,
            attachId: props.attachId,
            successDelete: false,
            content: ""
         }
    }
    componentDidMount = () => {
        const {proId, contId, attachId} = this.state
        new AttachmentApi().deleteAttachment(this.successCall, this.errorCall, proId, contId, attachId);
    }
    successCall =(successData) =>{
        this.setState({ successDelete: true});
    }
    errorCall = (err) =>{
        console.log(err)
        this.setState({ content: "somthing went wrong in delete, try Again" });
    }
    render() { 
        const {successDelete, content} = this.state;
        return <div>{successDelete ? this.loadSuccessDelelte() : this.deleteProcess(content)}</div>
    }
    loadSuccessDelelte = ()=>{
        return ( 
            <div> Deleted Successfully 
                {window.location.reload()}
            </div>
         );
    }
    deleteProcess = (content) => {
        return ( 
            <Card>
                <CardHeader>Delete Attachment </CardHeader>
                <CardBody>
                    <center>
                        {content === '' ? <p>Deleting...</p> : <p>{content} <br/><br/><a href="/attachments"><Button color="info">Goto Attachments</Button></a></p>}
                    </center>
                </CardBody>
            </Card>
         );
    }
}
 
export default DeleteAttachment;