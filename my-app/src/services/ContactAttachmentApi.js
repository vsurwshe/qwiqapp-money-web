import LoginApi from './LoginApi';
import AbstractApi from "./AbstractApi";
import Store from '../data/Store';

class ContactAttachmentApi extends AbstractApi{
  
  loginApi=null;
  init(){
    this.loginApi=new LoginApi();
  }

  createAttachment(success, failure, profileId, contactId, data) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments", "POST", data);
  }

  getAttachments(success, failure, profileId, contactId) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments", 'GET', profileId)
  }

  getAttachmentsById(success, failure, profileId, contactId, attachmentId) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments/" + attachmentId, "GET");
  }
  deleteAttachment(success, failure, profileId, contactId, attachmentId) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments/" + attachmentId, "DELETE", profileId);
  }

async  process(success, failure, Uurl, Umethod, data, reload) {
  const profile =Store.getProfile();
  const baseUrl= profile.url + "/profile/";
  let HTTP = this.httpCall(Uurl, Umethod, baseUrl);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data })
    this.validResponse(promise, success);
  } catch (error) {
    if (error.request.status === 0) {
      this.errorResponse(error.response, failure)
    } else {
      this.handleAccessTokenError(error, failure, Uurl, Umethod, data, success,reload)
    }
  }
}
handleAccessTokenError (err, failure, Uurl, Umethod, data, success, reload){
  if (err.request.status === 0) {
    this.errorResponse(err, failure)
  } else if (err.response.status === 401 || err.response.status === 403) {
    if (!reload) {
      this.loginApi.refresh(() => this.process(success, failure, Uurl, Umethod, data, "ristrict"), this.errorResponse(err, failure))  
    } else {
     this.errorResponse(err, failure)
    }
  } else {
    this.errorResponse(err, failure)
  }
}
}

export default ContactAttachmentApi;


