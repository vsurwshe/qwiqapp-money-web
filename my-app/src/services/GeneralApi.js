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
    this.process(success, failure, "/general/countries", this.apiMethod.GET);
  };

  getCurrencyList(success, failure) {
    this.process(success, failure, "/general/currencies", this.apiMethod.GET);
  }

  settings(success, failure) {
    this.process(success, failure, "/general/settings", this.apiMethod.GET);
  }

async process(successCall, failureCall, requestUrl, requestMethod, reload) {

  const baseUrl= Config.settings().cloudBaseURL;
  let http = this.httpCall(requestUrl, requestMethod, baseUrl);
  let promise
  if (http) {
    try {
      promise = await http.request();
      this.validResponse(promise, successCall)
    } catch (error) {
      this.handleAccessTokenError(error, successCall, failureCall, requestUrl, requestMethod, reload);
    }
  }
}

 handleAccessTokenError(error, success, failure, requestUrl, requestMethod, reload) {
  const request = error && error.request ? error.request : '';
  const response = error && error.response ? error.response : '';
  if (request && request.status === 0) {
    this.errorResponse(error, failure)
  } else if (response && (response.status === 401 || response.status === 403)) {
    if (!reload) {
      this.loginApi.refresh(() => this.process(success, failure, requestUrl, requestMethod, true), this.errorResponse(error, failure))
    } else {
      this.errorResponse(error, failure);
    }
  } else {
    this.errorResponse(error, failure)
  }
}
}
export default GeneralApi;