import LoginApi from './LoginApi';
import AbstractApi from "./AbstractApi";
import Store from '../data/Store';

class BillAttachmentsApi extends AbstractApi{

  loginApi=null;
  init(){
    this.loginApi=new LoginApi();
  }
  createBillAttachment(success, failure, profileId, billId, data) {
    this.process(success, failure, profileId + "/bills/" + billId + "/attachments", "POST", data);
  }

  getBillAttachments(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/attachments", 'GET', profileId);
  }

  getBillAttachmentsById(success, failure, profileId, billId, attachmentId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/attachments/" + attachmentId, "GET");
  }

  deleteBillAttachment(success, failure, profileId, billId, attachmentId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/attachments/" + attachmentId, "DELETE", profileId);
  }

async process(success, failure, apiUrl, requestMethod, data, reload) {
  const profile =Store.getProfile();
  const baseUrl= profile.url + "/profile/";
  let HTTP = this.profileHttpCall(apiUrl, requestMethod, baseUrl);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data })
    this.validResponse(promise, success);
  } catch (error) {
      this.handleAccessTokenError(error, failure, apiUrl, requestMethod, data, success,reload)
  }
}
handleAccessTokenError (err, failure, apiUrl, requestMethod, data, success, reload) {
  if (err.request && err.request.status === 0) {
    this.errorResponse(err, failure)
  } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
    if (!reload) {
      this.loginApi.refresh(() => this.process(success, failure, apiUrl, requestMethod, data, "ristrict"), this.errorResponse(err, failure))  
    } else {
      this.errorResponse(err, failure)
    }
  } else {
    this.errorResponse(err, failure)
  }
}

}
export default BillAttachmentsApi;
