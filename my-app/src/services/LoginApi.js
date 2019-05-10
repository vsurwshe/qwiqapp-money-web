import axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";

class LoginApi {
  login(username, password, success, failure) {
    let params = {
      grant_type: "password",
      username: username,
      password: password
    };
    process(params, success, failure);
  }

  refresh(success, failure) {
    if (!Store.isAppUserLoggedIn) {
      failure();return;
    }
    let params = {
      grant_type: "refresh_token",
      refresh_token: Store.getAppUserRefreshToken()
    };
    process(params, success, failure);
  }
}

export default LoginApi;

let process = function(params, success, failure) {
  let promise = HTTP.request({ params: params })
    .then(resp => validResponse(resp, success,params))
    .catch(error => {errorResponse(error, failure);});
};

let validResponse = function(resp, successMethod,params) {
  if(params.username === "dummy@email.com")
    {Store.saveDummyUserAccessToken(resp.data.access_token, resp.data.refresh_token);}
  else
    {Store.saveAppUserAccessToken(resp.data.access_token, resp.data.refresh_token,resp.data.expires_in);}
    if (successMethod != null) {successMethod();}
};

let errorResponse = function(error, failure) {
  if (failure != null) {
    failure();
  }
};

let HTTP = axios.create({
  baseURL: Config.authBaseURL,
  method: "post",
  url: "/oauth/token",
  headers: { accept: "application/json", "content-type": "application/json" },
  auth: { username: Config.clientId, password: Config.clientSecret },
  withCredentials: true
});
