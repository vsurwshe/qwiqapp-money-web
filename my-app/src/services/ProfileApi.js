import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class ProfileApi {
  createProfile(success, failure, data) {
    process(success, failure, "/profiles/", "POST", data);
  }

  getProfiles(success, failure, value) {
    Store.getUserProfiles() === null || value === "True" ? process(success, failure, "/profiles/", "GET") : success(Store.getUserProfiles());
  }

  getProfilesById(success, failure, uid) {
    process(success, failure, "/profiles/" + uid, "GET");
  }

  updateProfile(success, failure, data, uid) {
    process(success, failure, "/profiles/" + uid, "PUT", data);
  }

  deleteProfile(success, failure, uid) {
    process(success, failure, "/profiles/" + uid, "DELETE", null, uid);
  }
}

export default ProfileApi;

async function process(success, failure, requestUrl, requestMethod, data, deleteId, reload) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    if (requestMethod === "GET") {
      Store.saveUserProfiles(promise.data);
    } else {
      await new ProfileApi().getProfiles(success, failure, "True");
    }
    validResponse(promise, success, requestMethod, deleteId)
  } catch (err) {
    handleAccessTokenError(err, failure, requestUrl, requestMethod, data, success, reload);
  }
}

//this method solve the Expire Token Problem.
let handleAccessTokenError = function (err, failure, requestUrl, requestMethod, data, success, reload) {
  if (err.request.status === 0) {
    errorResponse(err, failure)
  } else if (err.response.status === 403 || err.response.status === 401) {
    if (!reload) {
      new LoginApi().refresh(() => { process(success, failure, requestUrl, requestMethod, data, "reload") }, errorResponse(err, failure))
    } else {
      errorResponse(err, failure)
    }
  } else { errorResponse(err, failure) }
}

let validResponse = async function (resp, successMethod, requestMethod, deleteId) {
  if (successMethod != null) {
    if (requestMethod === "DELETE") {
      if (Store.getProfile().id === deleteId) {
        await Store.saveProfile(null);
        Store.setSelectedValue(false);
        await Store.userDataClear();
      }
    } else if (requestMethod === "POST") {
      Store.setSelectedValue(true);
      await Store.userDataClear();
      await Store.saveProfile(resp.data)
    }
    successMethod(resp.data);
  }
};

let errorResponse = function (error, failure) {
  if (failure != null) {
    failure(error);
  }
};

function httpCall(requestUrl, requestMethod) {
  let instance = Axios.create({
    baseURL:Config.customSetting().cloudBaseURL,
    method: requestMethod,
    url: requestUrl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
