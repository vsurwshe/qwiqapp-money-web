import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class LabelApi {
  //This Method Create label 
  createLabel(success, failure, pid, data) {
    process(success, failure, pid + "/labels", "POST", pid, data);
  }

  //This Method Get All labels
  getlabels(success, failure, pid) {
    Store.getLabels() === null ? process(success, failure, pid + "/labels?sublabels=true", "GET") : success(Store.getLabels());
  }

  //This Method Get All labels
  getlabelsById(success, failure, pid, lid) {
    process(success, failure, pid + "/labels/" + lid, "GET");
  }

  //This Method Get All Sub-labels
  getSublabels(success, failure, pid, value) {
    Store.getLabels() === null || value === "True" ? process(success, failure, pid + "/labels?sublabels=true", "GET") : success(Store.getLabels());
  }

  //This Method Update labels 
  updateLabel(success, failure, data, pid, lid) {
    process(success, failure, pid + "/labels/" + lid, "PUT", pid, data);
  }

  //This Method Delete the lables
  deleteLabel(success, failure, pid, lid) {
    process(success, failure, pid + "/labels/" + lid, "DELETE", pid);
  }
}

export default LabelApi;

async function process(success, failure, Uurl, Umethod, profileId, data, reload) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  if (HTTP !== null) {
    try {
      data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
      if (Umethod === "GET") {
        Store.storeLabels(promise.data);
      } else {
        new LabelApi().getSublabels(success, failure, profileId, "True");
      }
      validResponse(promise, success)
    } catch (err) {
      handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, reload);
    }
  }
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (profileId, err, failure, Uurl, Umethod, data, success, reload) {
  if (err.request.status === 0) {
    new LabelApi().getSublabels(success, failure, profileId, "True");
  } else if (err.response.status === 403 || err.response.status === 401) {
    if (!reload) {
      new LoginApi().refresh(() => { process(success, failure, Uurl, Umethod, data, "reload") }, errorResponse(err, failure))
    } else {
      errorResponse(err, failure)
    }
  } else { errorResponse(err, failure) }
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
  let baseURL = Store.getProfile();
  let instance = null;
  if (baseURL) {
    instance = Axios.create({
      baseURL: baseURL.url + "/profile/",
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
