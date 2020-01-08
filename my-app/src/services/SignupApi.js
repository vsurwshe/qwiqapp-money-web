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
    process(success, failure, "/user/register", "POST", data);
  }

  //user forgot password 
  forgotPassword(success, failure, email) {
    process(success, failure, "/user/passwd/forgot?email=" + email, "GET")
  }

  // User Reset Password
  resetPassword(success, failure, email, otp, newpwd) {
    process(success, failure, "/user/passwd/reset?email=" + email + "&otp=" + otp + "&newpwd=" + newpwd, "PUT");
  }

  //Checks Whether user already exists or not
  async existsUser(success, failure, userData) {
    this.getToken();
    setTimeout(() => {
      let HTTP = httpCall( "/user/exists?email=" + userData.email, "GET", Store.getDummyUserAccessToken());
      HTTP.request().then(response => {
        if (response && response.data) {
          validResponse(response, success)
        }
      })
      .catch(error => {
        if (error && error.response && error.response.status === "404"){  
          console.log("Internal Error")
        } else {
          errorResponse(error, failure);
        }
      }) 
    }, Config.apiTimeoutMillis);
  }

  //Verify the User Credentials
  async verifySignup(success, failure, code) {
    await this.getToken()
    setTimeout(() => {
      process(success, failure, "/user/verify?code=" + code + "&type=EMAIL", "GET", "verify");
    }, Config.apiTimeoutMillis);
  }

  resendVerifyCode(success,failure) {
    process(success, failure, "/user/verify/resend?type=EMAIL", "GET","verify");
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
  if (data) {
    HTTP.request({ data })
      .then(resp => validResponse(resp, success))
      .catch(error => errorResponse(error, failure));
  } else {
    HTTP.request()
      .then(resp => validResponse(resp, success))
      .catch(error => errorResponse(error, failure));
  }
};

let validResponse = function (resp, successMethod) {
  if (successMethod != null) {
    successMethod(resp.data);
  }
};

let errorResponse = function (error, failure) {
  if (failure != null) {
    failure(error)
  }
};

function httpCall(customUrl, Umethod, value) {
  let HTTP = Axios.create({
    method: Umethod,
    url: Config.settings().cloudBaseURL + customUrl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + value
    }
  });
  return HTTP;
}