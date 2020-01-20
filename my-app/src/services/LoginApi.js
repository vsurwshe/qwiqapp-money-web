import axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import { DUMMY_EMAIL, grantType } from "../data/GlobalKeys";

class LoginApi {

  login(username, password, success, failure) {
    let params = {
      grant_type: grantType.PASSWORD,
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
      grant_type: grantType.REFRESH_TOKEN,
      refresh_token: Store.getAppUserRefreshToken()
    };
    this.process(params, success, failure);
  }

  process(params, success, failure) {
    let promise = this.http.request({ params: params })
      .then(resp => this.successesponse(resp, success, params))
      .catch(error => { this.errorResponse(error, failure); });
    console.log(promise)
  };

  http = axios.create({
    baseURL: Config.settings().authBaseURL,
    method: "post",
    url: "/oauth/token",
    headers: { accept: "application/json", "content-type": "application/json" },
    auth: {
      username: Config.settings().clientId,
      password: Config.settings().clientSecret
    },
    withCredentials: true
  });

  successesponse (resp, successMethod, params) {
    if (params.username === DUMMY_EMAIL) {
      Store.saveDummyUserAccessToken(resp.data.access_token, resp.data.refresh_token);
    } else {
      Store.saveAppUserAccessToken(resp.data.access_token, resp.data.refresh_token, resp.data.expires_in);
    }
    if (successMethod != null) {
      successMethod();
    }
  };

  errorResponse (error, failure) {
    if (failure != null) {
      failure(error)
    }
  };
}
export default LoginApi;

