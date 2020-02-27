import Config from "../data/Config";
import AbstractApi from "./AbstractApi";

class UserInvoiceApi extends AbstractApi {

  loginApi = null;
  constructor() {
    super();
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  showInvoice(success, failure, invoceId) {
    this.process(success, failure, "/invoices/" + invoceId, this.apiMethod.GET)
  }

  process(success, failure, requestUrl, requestMethod, reload) {
    const baseURL = Config.settings().cloudBaseURL;
    let http = this.httpCall(requestUrl, requestMethod, baseURL);
    let promise;
    if (http) {
      try {
        promise = http.request();
        this.validResponse(promise, success)
      } catch (error) {
        this.handleAccessTokenError(error, failure, requestUrl, requestMethod, success, reload);
      }
    }
  }
  handleAccessTokenError(error, failure, requestUrl, requestMethod, success, reload) {
    const response = error && error.response ? error.response : '';
    const { data, status } = response ? response : '';
    if (status === 403 || status === 401) {
      if (data && data.error && data.error.debugMessage) {
        this.errorResponse(error, failure)
      } else {
        if (!reload) {
          this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, true) }, this.errorResponse(error, failure))
        } else {
          this.errorResponse(error, failure);
        }
      }
    } else {
      this.errorResponse(error, failure);
    }
  }
}
export default UserInvoiceApi;