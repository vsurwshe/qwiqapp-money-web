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
    process(success, failure, "/profiles/" + uid, "DELETE");
  }
  getCountrylist(success, failure) {
    process(success, failure, "/countries/", "GET");
  }
}

export default ProfileApi;

async function process(success, failure, requestUrl, requestMethod, data) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    if (requestMethod === "GET") {
      Store.saveUserProfiles(promise.data);
    } else {
      await new ProfileApi().getProfiles(success, failure, "True");
    }
    validResponse(promise, success, requestMethod)
  } catch (err) {
    AccessTokenError(err, failure, requestUrl, requestMethod, data, success);
  }
}

//this method solve the Expire Token Problem.
let AccessTokenError = function (err, failure, requestUrl, requestMethod, data, success) {
  if (err.request.status === 0) {
    errorResponse(err, failure)
  } else if (err.response.status === 403 || err.response.status === 401) {
    new LoginApi().refresh(() => { process(success, failure, requestUrl, requestMethod, data) }, errorResponse(err, failure))
  } else { errorResponse(err, failure) }
}

let validResponse = function (resp, successMethod, requestMethod) {
  if (successMethod != null) {
    if (requestMethod === "DELETE") {
      Store.clearLocalStorage();
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
    baseURL: Config.cloudBaseURL,
    method: requestMethod,
    url: requestUrl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
