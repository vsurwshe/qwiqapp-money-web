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
    this.process(success, failure, profileId + "/contacts", "POST", profileId, data);
  }

  getContacts(success, failure, profileId, value) {
    Store.getContacts() === null || value ? this.process(success, failure, profileId + "/contacts?withlabels=true", "GET") : success(Store.getContacts());
  }

  getContactById(success, failure, profileId, contactId) {
    const store = true;
    this.process(success, failure, profileId + "/contacts/" + contactId, "GET", profileId, store);
  }

  updateContact(success, failure, data, profileId, contactId) {
    this.process(success, failure, profileId + "/contacts/" + contactId, "PUT", profileId, data);
  }

  deleteContact(success, failure, profileId, contactId) {
    this.process(success, failure, profileId + "/contacts/" + contactId, "DELETE", profileId);
  }

async process(success, failure, Uurl, Umethod, profileId, data, reload) {
  const profile =Store.getProfile();
  const baseUrl= (profile && profile.url) ? profile.url + "/profile/" : '';
  let HTTP = this.httpCall(Uurl, Umethod, baseUrl);
  let promise;
  try {
    if (HTTP !== null) {
      !data ? promise = await HTTP.request() : promise = await HTTP.request({ data });
      if (Umethod === "GET" && !data) {
        Store.saveContacts(promise.data);
        this.validResponse(promise, success)
      } else if (Umethod === "GET" && data === true) {
        this.validResponse(promise, success)
      } else {
        this.getContacts(success, failure, profileId, true);
        this.validResponse(promise, success)
      }
    }
  } catch (err) {
    this.handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, reload);
  }
}
//this method slove the Exprie Token Problem.
 handleAccessTokenError (profileId, err, failure, Uurl, Umethod, data, success, reload) {
  if (err.request.status === 0) {
    this.getContacts(success, failure, profileId, true);
  } else if (err.response.status === 403 || err.response.status === 401) {
    if (!reload) {
      this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, Uurl, Umethod, data, true) }, this.errorResponse(err, failure));
    } else {
      this.errorResponse(err, failure);
    }
  } else { 
    this.errorResponse(err, failure);
   }
}
}

export default ContactApi;


