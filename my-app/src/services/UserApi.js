import Config from "../data/Config";
import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class UserApi extends AbstractApi{
  
  loginApi= null;
  constructor() {
    super()
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  getUser(success, failure) {
    this.process(success, failure, "/user", "GET")
  }

  updateUser(success, failure, data) {
    this.process(success, failure, "/user", "PUT", data)
  }

  changePassword(success, failure, data) {
    this.process(success, failure, "/user/passwd?new=" + data.new + "&old=" + data.old, "PUT")
  }

async process(success, failure, requestUrl, requestMethod, data, reload) {
  const baseURL=Config.settings().cloudBaseURL;
  let HTTP = this.httpCall(requestUrl, requestMethod, baseURL);
  let promise;
  if(HTTP){
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    Store.saveUser(promise.data)
    this.validResponse(promise, success)
  } catch (err) {
    this.handleAccessTokenError(err, failure, requestUrl, requestMethod, data, success, reload);
  }
}
}

//this method solve the Expire Token Problem.
 handleAccessTokenError (err, failure, requestUrl, requestMethod, data, success, reload) {
  const request = err && err.request ? err.request : '';
  const response = err && err.response ? err.response : '';
  if (request && request.status === 0) {
    this.errorResponse(err, failure)
  } else if (response && (response.status === 403 || response.status === 401)) {
    if (response.data && response.data.error && response.data.error.debugMessage) {
      this.errorResponse(err, failure)
    } else {
      if (!reload) {
        this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, data, true) }, this.errorResponse(err, failure))
      } else {
        this.errorResponse(err, failure)
      }
    }
  } else { this.errorResponse(err, failure) }
}
}
export default UserApi;
