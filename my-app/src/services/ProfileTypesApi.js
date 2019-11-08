import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class ProfileTypesApi {
  getProfileTypes(success, failure) {
    const profileTypes = Store.getProfileTypes();
    if (profileTypes) {
      success(profileTypes)
    } else {
      process(success, failure, "/profile/types", "GET")
    }
  }
}

export default ProfileTypesApi;

async function process(success, failure, requestUrl, requestMethod, data, reload) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    promise = await HTTP.request();
    validResponse(promise, success, requestMethod)
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

let validResponse = async function (resp, successMethod) {
  successMethod(resp.data);
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
