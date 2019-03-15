import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
class SignupApi {
  //This is Step to Register The User
  getToken = () => {
    new LoginApi().login("dummy@email.com","dummyPwd",() => {
      console.log("Your Token is", Store.getAppUserAccessToken());}, () => {console.log("Cantnot Fetch the Admin Token");});
  };
  //Registers User
  registerUser(success, failure, data) {
    process(success, failure, Config.cloudBaseURL + "/register/","POST", data);
  }
  //Checks Whether user already exists or not
  async existsUser(success, failure, data) {
    this.getToken();
    setTimeout(()=>{
      let instance = createInstance(Config.cloudBaseURL + "/register/exists?email=" + data.email,"GET");
      instance.request().then(resp => { if (resp.data) { 
          validResponse(resp,success) 
      } })
      .catch(err => { if (err.response.status === "404") console.log("Internal Error")});
    },2000);
    
  }
  //Verify the User Credentials
  async verifySignup(success, failure, uid, code) {
    this.getToken()
    setTimeout(()=>{
      process( success, failure, Config.cloudBaseURL + "/register/" + uid + "/verify?code=" + code, "GET" );
    },2000);
  }
}

export default SignupApi;

let process = function(success, failure, Uurl, Umethod, data) {
  let instance = createInstance(Uurl, Umethod);
  if ([data].length > 0) {
    instance.request({ data }).then(resp => validResponse(resp, success)).catch(err => errorResponse(err, failure));
  } else {
    instance.request().then(resp => validResponse(resp, success)).catch(err => errorResponse(err, failure));
  }
};
let validResponse = function(resp, successMethod) { if (successMethod != null) {successMethod(resp.data);}};
let errorResponse = function(error, failure) {
 if(error.response.status === 404 && failure != null){failure(error)}
};

function createInstance(Uurl, Umethod) {
  console.log("Dummy Token",Store.getDummyUserAccessToken())
  let instance = Axios.create({
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getDummyUserAccessToken()
    }
  });
  return instance;
}