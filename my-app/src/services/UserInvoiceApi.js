import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
import Config from "../data/Config";

export class UserInvoiceApi {
  showInvoice(success, failure, invoceId) {
    process(success, failure, "/invoices/" + invoceId, "GET")
  }
}

function process(success, failure, requestUrl, requestMethod, reload) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise;
  try {
    promise = HTTP.request();
    validResponse(promise, success)
  } catch (err) {
    handleAccessTokenError(err, failure, requestUrl, requestMethod, success, reload);
  }
}

let handleAccessTokenError = function (err, failure, requestUrl, requestMethod, success, reload) {
  if (err.response.status === 403 || err.response.status === 401) {
    if (err.response["data"].error.debugMessage) {
      errorResponse(err, failure)
    } else {
      if (!reload) {
        new LoginApi().refresh(() => { process(success, failure, requestUrl, requestMethod, "ristrict") }, errorResponse(err, failure))
      } else {
        errorResponse(err, failure);
      }
    }
  } else {
    errorResponse(err, failure);
  }
}

let validResponse = function (responseData, success) {
  success(responseData);
}
let errorResponse = function (error, failure) {
  failure(error);
}

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
