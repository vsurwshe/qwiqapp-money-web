import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class LabelApi extends AbstractApi {

  loginApi = null;
  constructor() {
    super();
    this.loginApi = this.loginInstance();
  }

  //This Method Create label 
  createLabel(success, failure, profileId, data) {
    this.process(success, failure, profileId + "/labels", "POST", profileId, data);
  }

  //This Method Get All labels
  getlabels(success, failure, profileId) {
    Store.getLabels() === null ? this.process(success, failure, profileId + "/labels?sublabels=true", "GET", profileId) : success(Store.getLabels());
  }

  //This Method Get All labels
  getlabelsById(success, failure, profileId, lid) {
    this.process(success, failure, profileId + "/labels/" + lid, "GET", profileId);
  }

  //This Method Get All Sub-labels
  getSublabels(success, failure, profileId, value) {
    Store.getLabels() === null || value ? this.process(success, failure, profileId + "/labels?sublabels=true", "GET", profileId) : success(Store.getLabels());
  }

  //This Method Update labels 
  updateLabel(success, failure, data, profileId, lid) {
    this.process(success, failure, profileId + "/labels/" + lid, "PUT", profileId, data);
  }

  //This Method Delete the lables
  deleteLabel(success, failure, profileId, lid) {
    this.process(success, failure, profileId + "/labels/" + lid, "DELETE", profileId);
  }

  async process(success, failure, Uurl, Umethod, profileId, data, reload) {
    const profile = Store.getProfile();
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/" : '';
    let HTTP = this.httpCall(Uurl, Umethod, baseUrl);
    let promise;
    if (HTTP !== null) {
      try {
        data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
        if (Umethod === "GET") {
          Store.storeLabels(promise.data);
        } else {
          this.getSublabels(success, failure, profileId, true);
        }
        this.validResponse(promise, success)
      } catch (err) {
        this.handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, reload);
      }
    }
  }

  //this method slove the Exprie Token Problem.
  handleAccessTokenError(profileId, error, failure, Uurl, Umethod, data, success, reload) {
    const response = error && error.response ? error.response : '';
    const request = error && error.request ? error.request : '';
    if (response) { // Handleing network error
      const { status } = response; // directly assigning value, because we already checked that response is not a falsy(null, '', undefined, 0) value, then only come here.
      if (request && request.status === 0) {
        this.getSublabels(success, failure, profileId, true);
      } else if (status === 403 || status === 401) { // if response is falsy(null, undefined, ''...) value, then status is ''
        if (!reload) {
          this.loginApi.refresh(() => { this.process(success, failure, Uurl, Umethod, profileId, data, true) }, this.errorResponse(error, failure))
        } else {
          this.errorResponse(error, failure);
        }
      } else {
        this.errorResponse(error, failure);
      }
    } else {
      this.errorResponse(error, failure);
    }
  }
}

export default LabelApi;