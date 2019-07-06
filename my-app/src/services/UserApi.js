import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class UserApi {
 
  getUser(success, failure) {
    process(success, failure, "/user", "GET")
  }
}

export default UserApi;

async function process(success, failure, requestUrl, requestMethod, data) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    Store.saveUser(promise.data)
    validResponse(promise, success)
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
