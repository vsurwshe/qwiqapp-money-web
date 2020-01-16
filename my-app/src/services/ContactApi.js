import Store from "../data/Store";
import AbstractApi from "./AbstractApi";
class ContactApi extends AbstractApi {

  loginApi=null;
  constructor() {
    super()
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }
  createContact(success, failure, profileId, data) {
    this.process(success, failure, profileId + "/contacts", this.apiMethod.POST, profileId, data);
  }

  getContacts(success, failure, profileId, value) {
    Store.getContacts() === null || value ? this.process(success, failure, profileId + "/contacts?withlabels=true", this.apiMethod.GET) : success(Store.getContacts());
  }

  getContactById(success, failure, profileId, contactId) {
    const store = true;
    this.process(success, failure, profileId + "/contacts/" + contactId, this.apiMethod.GET, profileId, store);
  }

  updateContact(success, failure, data, profileId, contactId) {
    this.process(success, failure, profileId + "/contacts/" + contactId, this.apiMethod.PUT, profileId, data);
  }

  deleteContact(success, failure, profileId, contactId) {
    this.process(success, failure, profileId + "/contacts/" + contactId, this.apiMethod.DELETE, profileId);
  }

async process(success, failure, requestUrl, requestMethod, profileId, data, reload) {
  const profile =Store.getProfile();
  const baseUrl= (profile && profile.url) ? profile.url + "/profile/" : '';
  let http = this.httpCall(requestUrl, requestMethod, baseUrl);
  let promise;
  if(http){
  try {
      !data ? promise = await http.request() : promise = await http.request({ data });
      if (requestMethod === this.apiMethod.GET && !data) {
        Store.saveContacts(promise.data);
        this.validResponse(promise, success)
      } else if (requestMethod === this.apiMethod.GET && data === true) {
        this.validResponse(promise, success)
      } else {
        this.getContacts(success, failure, profileId, true);
        this.validResponse(promise, success)
      }
  } catch (err) {
    this.handleAccessTokenError(profileId, err, failure, requestUrl, requestMethod, data, success, reload);
  }
}
}
//this method slove the Exprie Token Problem.
 handleAccessTokenError (profileId, err, failure, requestUrl, requestMethod, data, success, reload) {
  if (err.request.status === 0) {
    this.getContacts(success, failure, profileId, true);
  } else if (err.response.status === 403 || err.response.status === 401) {
    if (!reload) {
      this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, data, true) }, this.errorResponse(err, failure));
    } else {
      this.errorResponse(err, failure);
    }
  } else { 
    this.errorResponse(err, failure);
   }
}
}

export default ContactApi;


