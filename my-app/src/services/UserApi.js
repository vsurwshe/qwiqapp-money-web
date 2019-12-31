import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class UserApi {
  getUser(success, failure) {
    process(success, failure, "/user", "GET")
  }

  updateUser(success, failure, data) {
    process(success, failure, "/user", "PUT", data)
  }

  changePassword(success, failure, data) {
    process(success, failure, "/user/passwd?new=" + data.new + "&old=" + data.old, "PUT")
  }
}
export default UserApi;

async function process(success, failure, requestUrl, requestMethod, data, reload) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    Store.saveUser(promise.data)
    validResponse(promise, success)
  } catch (error) {
    handleAccessTokenError(error, failure, requestUrl, requestMethod, data, success, reload);
  }
}

//this method solve the Expire Token Problem.
let handleAccessTokenError = function (err, failure, requestUrl, requestMethod, data, success, reload) {
  const request = err && err.request;
  const response = err && err.response;
  if (request && request.status === 0) {
    errorResponse(err, failure)
  } else if (response && (response.status === 403 || response.status === 401)) {
    if (response.data && response.data.error && response.data.error.debugMessage) {
      errorResponse(err, failure)
    } else {
      if (!reload) {
        new LoginApi().refresh(() => { process(success, failure, requestUrl, requestMethod, data, "reload") }, errorResponse(err, failure))
      } else {
        errorResponse(err, failure)
      }
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
