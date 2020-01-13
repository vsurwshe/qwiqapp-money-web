import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class LabelApi {
  //This Method Create label 
  createLabel(success, failure, profileId, data) {
    process(success, failure, profileId + "/labels", "POST", profileId, data);
  }

  //This Method Get All labels
  getlabels(success, failure, profileId) {
    Store.getLabels() === null ? process(success, failure, profileId + "/labels?sublabels=true", "GET", profileId) : success(Store.getLabels());
  }

  //This Method Get All labels
  getlabelsById(success, failure, profileId, lid) {
    process(success, failure, profileId + "/labels/" + lid, "GET", profileId);
  }

  //This Method Get All Sub-labels
  getSublabels(success, failure, profileId, value) {
    Store.getLabels() === null || value ? process(success, failure, profileId + "/labels?sublabels=true", "GET", profileId) : success(Store.getLabels());
  }

  //This Method Update labels 
  updateLabel(success, failure, data, profileId, lid) {
    process(success, failure, profileId + "/labels/" + lid, "PUT", profileId, data);
  }

  //This Method Delete the lables
  deleteLabel(success, failure, profileId, lid) {
    process(success, failure, profileId + "/labels/" + lid, "DELETE", profileId);
  }
}

export default LabelApi;

async function process(success, failure, Uurl, Umethod, profileId, data, reload) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  if (HTTP) {
    try {
      data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
      if (Umethod === "GET") {
        Store.storeLabels(promise.data);
      } else {
        new LabelApi().getSublabels(success, failure, profileId, true);
      }
      validResponse(promise, success)
    } catch (error) {
      handleAccessTokenError(profileId, error, failure, Uurl, Umethod, data, success, reload);
    }
  }
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (profileId, error, failure, Uurl, Umethod, data, success, reload) {
  const response = error && error.response ? error.response : '';
  const request = error && error.request ? error.request : '';
  if (response) { // Handleing network error
    const {status} = response; // directly assigning value, because we already checked that response is not a falsy(null, '', undefined, 0) value, then only come here.
    if (request && request.status === 0) {
      new LabelApi().getSublabels(success, failure, profileId, true);
    } else if (status === 403 || status === 401) { // if response is falsy(null, undefined, ''...) value, then status is ''
      if (!reload) {
        new LoginApi().refresh(() => { process(success, failure, Uurl, Umethod, profileId, data, true) }, errorResponse(error, failure))
      } else {
        errorResponse(error, failure);
      }
    } else { 
      errorResponse(error, failure);
    }
  } else {
    errorResponse(error, failure);
  }
}

let validResponse = function (resp, successMethod) {
  if (successMethod != null) {
    successMethod(resp.data);
  }
};

let errorResponse = function (error, failure) {
  if (failure != null) {
    failure(error);
  }
};

function httpCall(Uurl, Umethod) {
  let profile = Store.getProfile();
  let instance = null;
  if (profile) {
    instance = Axios.create({
      baseURL: profile.url + "/profile/",
      method: Umethod,
      url: Uurl,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + Store.getAppUserAccessToken()
      }
    });
  }
  return instance;
}
