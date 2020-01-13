import AbstractApi from "./AbstractApi";
import Store from '../data/Store';

class ContactAttachmentApi extends AbstractApi{
  
  loginApi=null;
  init(){
    this.loginApi= this.loginInstance();
  }

  createAttachment(success, failure, profileId, contactId, data) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments", this.apiMethod.POST, data);
  }

  getAttachments(success, failure, profileId, contactId) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments", this.apiMethod.GET, profileId)
  }

  getAttachmentsById(success, failure, profileId, contactId, attachmentId) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments/" + attachmentId, this.apiMethod.GET);
  }
  deleteAttachment(success, failure, profileId, contactId, attachmentId) {
    this.process(success, failure, profileId + "/contacts/" + contactId + "/attachments/" + attachmentId, this.apiMethod.DELETE, profileId);
  }

async  process(success, failure, requestUrl, requestMethod, data, reload) {
  const profile =Store.getProfile();
  const baseUrl= (profile && profile.url) ? profile.url + "/profile/" : '';
  let http = this.httpCall(requestUrl, requestMethod, baseUrl);
  let promise;
  try {
    data === null ? promise = await http.request() : promise = await http.request({ data })
    this.validResponse(promise, success);
  } catch (error) {
    if (error.request.status === 0) {
      this.errorResponse(error.response, failure)
    } else {
      this.handleAccessTokenError(error, failure, requestUrl, requestMethod, data, success,reload)
    }
  }
}
handleAccessTokenError (err, failure, requestUrl, requestMethod, data, success, reload){
  if (err.request.status === 0) {
    this.errorResponse(err, failure)
  } else if (err.response.status === 401 || err.response.status === 403) {
    if (!reload) {
      this.loginApi && this.loginApi.refresh(() => this.process(success, failure, requestUrl, requestMethod, data, true), this.errorResponse(err, failure))  
    } else {
     this.errorResponse(err, failure)
    }
  } else {
    this.errorResponse(err, failure)
  }
}
}

export default ContactAttachmentApi;


