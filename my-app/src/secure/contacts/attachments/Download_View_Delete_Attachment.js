import Store from '../../../data/Store';
import AttachmentApi from '../../../services/AttachmentApi';

const Attachment = {
  DownloadAttachment: function (attachment) {
    const url = Store.getProfile()[0].url + "" + attachment.downloadLink;
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

  DeleteAttachment: function (success, error, proId, contId, attachId) {
    new AttachmentApi().deleteAttachment(success, error, proId, contId, attachId);
  },

  viewAttachment: function (attachment) {
    const url = Store.getProfile()[0].url + "" + attachment.viewLink;
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

export default Attachment;