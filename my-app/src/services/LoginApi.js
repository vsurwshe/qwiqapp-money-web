import axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import '../css/react-table.css'
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
      failure();
      return;
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
    .catch(error => {
      errorResponse(error, failure);
    });
};

let validResponse = function(resp, successMethod,params) {
  console.log(params);
  console.log(resp.data)
  if(params.username === "dummy@email.com")
    Store.saveDummyUserAccessToken(resp.data.access_token, resp.data.refresh_token);
  else
    Store.saveAppUserAccessToken(resp.data.access_token, resp.data.refresh_token,resp.data.expires_in);
    // TODO: refresh token when actual token expire occurs. 
    const expiry = resp.data.expires_in * 1000
    setTimeout(() =>
      { new LoginApi().refresh(()=>console.log("Refresh Token generated"),()=>console.log("Token Generation failed"),resp.data.expires_in)},expiry
    )

    if (successMethod != null) {
    successMethod();
  }
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
