import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class ProfileApi {
  createProfile(success, failure, data) {
    process(success, failure, "/profiles/", "POST", data);
  }

  getProfiles(success, failure, newGetRequest) {
    !Store.getUserProfiles() || newGetRequest ? process(success, failure, "/profiles/", "GET") : success(Store.getUserProfiles());
  }

  getProfileById(success, failure, profileId) {
    process(success, failure, "/profiles/" + profileId, "GET", null, null, profileId);
  }

  updateProfile(success, failure, data, profileId) {
    process(success, failure, "/profiles/" + profileId, "PUT", data);
  }

  deleteProfile(success, failure, profileId) {
    process(success, failure, "/profiles/" + profileId, "DELETE", null, profileId);
  }

  upgradeProfile(success, failure, profileId, type) {
    process(success, failure, "/profiles/" + profileId + "/upgrade?type="+ type, "PUT", null, profileId);
  }
}

export default ProfileApi;

async function process(success, failure, requestUrl, requestMethod, data, deleteId, profileId, reload) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    if (requestMethod === "GET") {
      // This condtions decide to store profile when getProfiles Method call only
      if(!profileId){
        Store.saveUserProfiles(promise.data);
      }
      validResponse(promise, success, requestMethod, deleteId)
    } else {
      requestMethod === "POST" ? 
       new LoginApi().refresh(async() => { await new ProfileApi().getProfiles(success, failure, true); }, (err)=>errorResponse(err, failure)) 
       : await new ProfileApi().getProfiles(success, failure, true);
    }
  } catch (err) {
    handleAccessTokenError(err, failure, requestUrl, requestMethod, data, deleteId, success, profileId, reload);
  }
}

//this method solve the Expire Token Problem.
let handleAccessTokenError = function (err, failure, requestUrl, requestMethod, data, deleteId, success, profileId, reload) {
  if (err.request && err.request.status === 0) {
    errorResponse(err, failure)
  } else if (err.response.status === 403 || err.response.status === 401) {
    if (!reload) {
      new LoginApi().refresh(() => { process(success, failure, requestUrl, requestMethod, data, deleteId, profileId, "reload") }, errorResponse(err, failure))
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
    baseURL: Config.settings().cloudBaseURL,
    method: requestMethod,
    url: requestUrl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
