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
    process(success, failure, "/profiles/" + profileId, "DELETE", null, null, profileId);
  }

  upgradeProfile(success, failure, profileId, type) {
    process(success, failure, "/profiles/" + profileId + "/upgrade?type=" + type, "PUT", null, null, profileId);
  }
}

export default ProfileApi;

async function process(success, failure, requestUrl, requestMethod, data, deleteId, profileId, reload) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    if (requestMethod === "GET") {
      let selectedProfile = Store.getProfile();
      // This condition decides to save profiles in Store for getProfiles Method call only
      if (!profileId) {
        Store.saveUserProfiles(promise.data);
      } else if (selectedProfile && selectedProfile.id === profileId) { // Checks if the ProfileId in Store and passing profileId is the same, then saves API response to Store 
        Store.saveProfile(promise.data);
      }
      validResponse(promise, success, requestMethod, deleteId)
    } else {
      if(requestMethod === "POST" || requestMethod === "PUT"){
        new LoginApi().refresh(async () => { // Calls Refresh Token 
          if (profileId) { //If profileId is there, calls getProfileById for updated data 
            await new ProfileApi().getProfileById(async () => {
              await new ProfileApi().getProfiles(success, failure, true); // Calling getprofiles for updated changes to show
            }, failure, profileId)
          } else { // Calling getprofiles for updated changes to show
            await new ProfileApi().getProfiles(success, failure, true);
          }
        }, (error) => errorResponse(error, failure))
      }else{
        await new ProfileApi().getProfiles(success, failure, true);
      }
    }
  } catch (error) {
    handleAccessTokenError(error, failure, requestUrl, requestMethod, data, deleteId, success, profileId, reload);
  }
}

//this method solve the Expire Token Problem.
let handleAccessTokenError = function (error, failure, requestUrl, requestMethod, data, deleteId, success, profileId, reload) {
  const request = error && error.request;
  const response = error && error.response;
  const {status} = response ? response.status : '';
  if (request && request.status === 0) {
    errorResponse(error, failure)
  } else if (status === 403 || status === 401) {
    if (!reload) {
      new LoginApi().refresh(() => { process(success, failure, requestUrl, requestMethod, data, deleteId, profileId, "reload") }, errorResponse(error, failure))
    } else {
      errorResponse(error, failure)
    }
  } else { errorResponse(error, failure) }
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
