import Store from '../../data/Store';
import AttachmentApi from '../../services/AttachmentApi';
import BillAttachmentsApi from '../../services/BillAttachmentsApi';

const AttachmentUtils = {
    downloadAttachment: function (attachment) {
        const url = Store.getProfile().url + attachment.downloadLink;
        const filename = attachment.filename;
        return fetch(url, {
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + Store.getAppUserAccessToken()
            }
        }).then(function (response) {
            return response.blob();
        }).then(function (myBlob) {
            let objectURL = window.URL.createObjectURL(myBlob);
            let link = document.createElement("a");
            link.href = objectURL;
            link.setAttribute('download', filename);
            link.click();
            return "Download Successfully"
        }).catch(error => {
            return error.message;
        })
    },

     /*
     * Here itemId is dynamically change based on passing id like: billId/ contactId 
     * Only deletebill passiing boolean "value" is true.
     */

    deleteAttachment: function (success, error, profileId, itemId, attachmentId, value) {
        if(value){
         new BillAttachmentsApi().deleteBillAttachment(success,error,profileId, itemId, attachmentId) // itemId <- billId
        }else{
        new AttachmentApi().deleteAttachment(success, error, profileId, itemId, attachmentId); // itemId <- contactId
        }
    },

    viewAttachment: function (attachment) {
        const url = Store.getProfile().url + attachment.viewLink;
        return fetch(url, {
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + Store.getAppUserAccessToken()
            }
        }).then((response) => {
            return response.blob();
        }).then((myBlob) => {
            return URL.createObjectURL(myBlob);
        }).catch(error => {
            return error.message;
        })
    }
}

export default AttachmentUtils;