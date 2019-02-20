import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class SignupApi {
  constructor() {
    console.log("Constructor called");
    //this.getToken();
  }
  //This is Step to Register The User
  getToken = () => {
    new LoginApi().login(
      "dummy@email.com",
      "dummyPwd",
      () => {
        console.log("Your Token is", Store.getAccessToken());
      },
      () => {
        console.log("Cantnot Fetch the Admin Token");
      }
    );
  };

  //This Method Work On Creation User
  registerUser(success, failure, data) {
      process(
        success,
        failure,
        Config.cloudBaseURL + "/register/",
        "POST",
        data
      );
  }
  //This Method Check Wheter user alredy availbale or not
  existsUser(success, failure, data) {
    this.getToken();
    let instance = createInstance(
      Config.cloudBaseURL + "/register/exists?email=" + data.email,
      "GET"
    );
    
    instance.request()
      .then(resp => {
        if(resp.data)
          alert("User already exists")
        else
          this.registerUser(success,failure,data)
        return resp.data;
      })
      .catch(err => {
        console.log(err.response.status);
        if (err.response.status === "404") 
         alert("Internal Error")
      });
  }
  //This Method Verify the User Creadtional
  verifySignup(success, failure, uid, code) {
    process(
      success,
      failure,
      Config.cloudBaseURL + "/register/" + uid + "/verify?code=" + code,
      "GET"
    );
  }
}

export default SignupApi;

let process = function(success, failure, Uurl, Umethod, data) {
  let instance = createInstance(Uurl, Umethod);
  console.log("Data length ", [data]);
  if ([data].length > 0) {
    instance
      .request({ data })
      .then(resp => validResponse(resp, success))
      .catch(err => errorResponse(err, failure));
  } else {
    instance
      .request()
      .then(resp => validResponse(resp, success))
      .catch(err => errorResponse(err, failure));
  }
};

let validResponse = function(resp, successMethod) {
  console.log("Response: ", resp.data);
  if (successMethod != null) {
    successMethod(resp.data);
  }
};

let errorResponse = function(error, failure) {
  console.log("Error: ", error);
  if (failure != null) {
    failure(error);
  }
};

function createInstance(Uurl, Umethod) {
  let instance = Axios.create({
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAccessToken()
    }
  });
  return instance;
}