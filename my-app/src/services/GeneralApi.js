import LoginApi from "./LoginApi";
import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";

class GeneralApi {
  getCountrylist(success, failure) {
    process(success, failure, "/general/countries", "GET");
  };

  getCurrencyList(success, failure) {
    process(success, failure, "/general/currencies", "GET");
  }

  settings(success, failure) {
    process(success, failure, "/general/settings", "GET");
  }
}

export default GeneralApi;

async function process(successCall, failureCall, requestUrl, requestMethod, reload) {
  let HTTP = httpCall(requestUrl, requestMethod);
  let promise
  if (HTTP) {
    try {
      promise = await HTTP.request();
      successResponse(promise, successCall)
    } catch (error) {
      handleAccessTokenError(error, successCall, failureCall, requestUrl, requestMethod, reload);
    }
  }
}

function handleAccessTokenError(error, success, failure, Uurl, Umethod, reload) {
  const request = error && error.request ? error.request : '';
  const response = error && error.response ? error.response : '';
  if (request && request.status === 0) {
    errorResponse(error, failure)
  } else if (response && (response.status === 401 || response.status === 403)) {
    if (!reload) {
      new LoginApi().refresh(() => process(success, failure, Uurl, Umethod, "reload"), errorResponse(error, failure))
    } else {
      errorResponse(error, failure);
    }
  } else {
    errorResponse(error, failure)
  }
}

let errorResponse = function (error, failure) {
  if (failure != null) {
    failure(error);
  }
};

let successResponse = function (response, successCall) {
  if (successCall != null) {
    successCall(response.data);
  }
};

function httpCall(url, method) {
  let configUrl = Config.settings();
  let instance = null;
  if (configUrl) {
    instance = Axios.create({
      baseURL: configUrl.cloudBaseURL,
      method: method,
      url: url,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + Store.getAppUserAccessToken()
      }
    });
  }
  return instance;
}