import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class SignupApi extends AbstractApi{

  loginApi= null;
  constructor() {
    super();
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  //This is Step to Register The User
  getToken = () => {
    this.loginApi.login("dummy@email.com", "dummyPwd", () => {
    }, () => { console.log("Cantnot Fetch the Admin Token"); });
  };

  //Registers User
  registerUser(success, failure, data) {
    this.process(success, failure, "/user/register", "POST", data);
  }

  //user forgot password 
  forgotPassword(success, failure, email) {
    this.process(success, failure, "/user/passwd/forgot?email=" + email, "GET")
  }

  // User Reset Password
  resetPassword(success, failure, email, otp, newpwd) {
    this.process(success, failure, "/user/passwd/reset?email=" + email + "&otp=" + otp + "&newpwd=" + newpwd, "PUT");
  }

  //Checks Whether user already exists or not
  async existsUser(success, failure, userData) {
    this.getToken();
    setTimeout(() => {
      let HTTP = httpCall( "/user/exists?email=" + userData.email, "GET", Store.getDummyUserAccessToken());
      HTTP.request().then(response => {
        if (response && response.data) {
          this.validResponse(response, success)
        }
      })
      .catch(error => {
        if (error && error.response && error.response.status === "404"){  
          console.log("Internal Error")
        } else {
          this.errorResponse(error, failure);
        }
      }) 
    }, Config.apiTimeoutMillis);
  }

  //Verify the User Credentials
  async verifySignup(success, failure, code) {
    await this.getToken()
    setTimeout(() => {
      this.process(success, failure, "/user/verify?code=" + code + "&type=EMAIL", "GET", "verify");
    }, Config.apiTimeoutMillis);
  }

  resendVerifyCode(success,failure) {
    this.process(success, failure, "/user/verify/resend?type=EMAIL", "GET","verify");
  }

 process (success, failure, Uurl, Umethod, data) {
  let HTTP;
  if (data === "verify") {
    HTTP = httpCall(Uurl, Umethod, Store.getAppUserAccessToken());
  } else {
    HTTP = httpCall(Uurl, Umethod, Store.getDummyUserAccessToken());
  }
  if (data) {
    HTTP.request({ data })
      .then(resp => this.validResponse(resp, success))
      .catch(error => this.errorResponse(error, failure));
  } else {
    HTTP.request()
      .then(resp => this.validResponse(resp, success))
      .catch(error => this.errorResponse(error, failure));
  }
};

}
export default SignupApi;


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