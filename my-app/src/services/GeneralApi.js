import Config from "../data/Config";
import AbstractApi from "./AbstractApi";

class GeneralApi extends AbstractApi{
  
  loginApi= null;
  constructor() {
    super();
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  getCountrylist(success, failure) {
    this.process(success, failure, "/general/countries", "GET");
  };

  getCurrencyList(success, failure) {
    this.process(success, failure, "/general/currencies", "GET");
  }

  settings(success, failure) {
    this.process(success, failure, "/general/settings", "GET");
  }

async process(successCall, failureCall, requestUrl, requestMethod, reload) {
  const baseUrl=Config.settings().cloudBaseURL;
  let HTTP = this.httpCall(requestUrl, requestMethod, baseUrl);
  let promise
  if (HTTP) {
    try {
      promise = await HTTP.request();
      this.validResponse(promise, successCall)
    } catch (error) {
      this.handleAccessTokenError(error, successCall, failureCall, requestUrl, requestMethod, reload);
    }
  }
}

 handleAccessTokenError(error, success, failure, Uurl, Umethod, reload) {
  const request = error && error.request ? error.request : '';
  const response = error && error.response ? error.response : '';
  if (request && request.status === 0) {
    this.errorResponse(error, failure)
  } else if (response && (response.status === 401 || response.status === 403)) {
    if (!reload) {
      this.loginApi.refresh(() => this.process(success, failure, Uurl, Umethod, true), this.errorResponse(error, failure))
    } else {
      this.errorResponse(error, failure);
    }
  } else {
    this.errorResponse(error, failure)
  }
}
}
export default GeneralApi;