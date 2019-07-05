import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class SignupApi {

  //This is Step to Register The User
  getToken = () => {
    new LoginApi().login("dummy@email.com", "dummyPwd", () => {
    }, () => { console.log("Cantnot Fetch the Admin Token"); });
  };

  //Registers User
  registerUser(success, failure, data) {
    process(success, failure, Config.cloudBaseURL + "/user/register", "POST", data);
  }

  //Checks Whether user already exists or not
  async existsUser(success, failure, data) {
    this.getToken();
    setTimeout(() => {
      let HTTP = httpCall(Config.cloudBaseURL + "/user/exists?email=" + data.email, "GET", Store.getDummyUserAccessToken());
      HTTP.request().then(resp => {
        if (resp.data) {
          validResponse(resp, success)
        }
      })
        .catch(err => { if (err.response.status === "404") console.log("Internal Error") });
    }, 1500);
  }

  //Verify the User Credentials
  async verifySignup(success, failure, code) {
    await this.getToken()
    setTimeout(() => {
      process(success, failure, Config.cloudBaseURL + "/user/verify?code=" + code + "&type=EMAIL", "GET", "verify");
    }, Config.notificationMillis);
  }
}

export default SignupApi;

let process = function (success, failure, Uurl, Umethod, data) {
  let HTTP;
  if (data === "verify") {
    HTTP = httpCall(Uurl, Umethod, Store.getAppUserAccessToken());
  } else {
    HTTP = httpCall(Uurl, Umethod, Store.getDummyUserAccessToken());
  }
  if ([data].length > 0) {
    HTTP.request({ data }).then(resp => validResponse(resp, success)).catch(err => errorResponse(err, failure));
  } else {
    HTTP.request().then(resp => validResponse(resp, success)).catch(err => errorResponse(err, failure));
  }
};

let validResponse = function (resp, successMethod) { if (successMethod != null) { successMethod(resp.data); } };

let errorResponse = function (error, failure) {
  if (failure != null) { failure(error) }
};

function httpCall(Uurl, Umethod, value) {
  let HTTP = Axios.create({
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + value
    }
  });
  return HTTP;
}