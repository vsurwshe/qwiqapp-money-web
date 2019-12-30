import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
import AbstractApi from "./AbstractApi";

class ProfileTypesApi extends AbstractApi {

  loginApi = null;
  init() {
    this.loginApi = new LoginApi();
  }
  getProfileTypes(success, failure) {
    const profileTypes = Store.getProfileTypes();
    if (profileTypes) {
      success(profileTypes)
    } else {
      this.process(success, failure, "/profile/types", "GET")
    }
  }
  async process(success, failure, requestUrl, requestMethod, data, reload) {
    const baseUrl = Config.settings().cloudBaseURL;
    let HTTP = this.httpCall(requestUrl, requestMethod, baseUrl);
    let promise;
    if(HTTP){
    try {
      promise = await HTTP.request();
      this.validResponse(promise, success, requestMethod)
    } catch (err) {
      this.handleAccessTokenError(err, failure, requestUrl, requestMethod, data, success, reload);
    }
  }
  }

  //this method solve the Expire Token Problem.
  handleAccessTokenError(err, failure, requestUrl, requestMethod, data, success, reload) {
    if (err.request.status === 0) {
      this.errorResponse(err, failure)
    } else if (err.response.status === 403 || err.response.status === 401) {
      if (!reload) {
        this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, data, "reload") }, this.errorResponse(err, failure))
      } else {
        this.errorResponse(err, failure)
      }
    } else { this.errorResponse(err, failure) }
  }
}
export default ProfileTypesApi;