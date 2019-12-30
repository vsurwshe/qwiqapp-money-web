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
  } catch (error) {
    handleAccessTokenError(error, failure, requestUrl, requestMethod, success, reload);
  }
}

let handleAccessTokenError = function (error, failure, requestUrl, requestMethod, success, reload) {
  const response = error && error.response;
  const {data, status} = response && response;
  if (status === 403 || status === 401) {
    if (data && data.error && data.error.debugMessage) {
      errorResponse(error, failure)
    } else {
      if (!reload) {
        new LoginApi().refresh(() => { process(success, failure, requestUrl, requestMethod, "ristrict") }, errorResponse(error, failure))
      } else {
        errorResponse(error, failure);
      }
    }
  } else {
    errorResponse(error, failure);
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
