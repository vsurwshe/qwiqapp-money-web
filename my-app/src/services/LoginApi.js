import axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class LoginApi extends AbstractApi{

  loginApi= null;
  constructor() {
    super()
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  login(username, password, success, failure) {
    let params = {
      grant_type: "password",
      username: username,
      password: password
    };
    this.process(params, success, failure);
  }

  refresh(success, failure) {
    if (!Store.isAppUserLoggedIn) {
      failure(); return;
    }
    let params = {
      grant_type: "refresh_token",
      refresh_token: Store.getAppUserRefreshToken()
    };
    this.process(params, success, failure);
  }

 process (params, success, failure) {
  let promise = HTTP.request({ params: params })
    .then(resp => validResponse(resp, success, params))
    .catch(error => { this.errorResponse(error, failure); });
  console.log(promise)
};
}
export default LoginApi;

let validResponse = function (resp, successMethod, params) {
  if (params.username === "dummy@email.com") { Store.saveDummyUserAccessToken(resp.data.access_token, resp.data.refresh_token); }
  else { Store.saveAppUserAccessToken(resp.data.access_token, resp.data.refresh_token, resp.data.expires_in); }
  if (successMethod != null) { successMethod(); }
};

let HTTP = axios.create({
  baseURL: Config.settings().authBaseURL,
  method: "post",
  url: "/oauth/token",
  headers: { accept: "application/json", "content-type": "application/json" },
  auth: { username: Config.settings().clientId, password: Config.settings().clientSecret },
  withCredentials: true
});
