import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class ProfileApi {
  createProfile(success, failure, data) {
     process(success, failure, "/profiles/", "POST", data);
  }

  getProfiles(success, failure, value) {
     Store.getUserProfiles()===null || value==="True" ? process(success, failure, "/profiles/", "GET"): success(Store.getUserProfiles());
  }

  getProfilesById(success, failure, uid) {
    process(success, failure, "/profiles/" + uid, "GET");
  }

  updateProfile(success, failure, data, uid) {
    process(success, failure, "/profiles/" + uid, "PUT", data);
  }

  deleteProfile(success, failure, uid) {
    process(success, failure, "/profiles/" + uid, "DELETE");
  }
}

export default ProfileApi;

async function process(success, failure, Uurl, Umethod, data) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
    try {
      data===null? promise=await HTTP.request(): promise=await HTTP.request({ data });
      if (Umethod === "GET") {
        Store.saveUserProfiles(promise.data);
      } else {
          await new ProfileApi().getProfiles(success, failure, "True");
      }
      validResponse(promise, success)
    } catch(err){ 
      AccessTokenError(err,failure,Uurl, Umethod, data,success);
    }
}

//this method solve the Expire Token Problem.
let AccessTokenError = function(err,failure,Uurl, Umethod, data,success){
  if(err.request.status === 0){
    errorResponse(err, failure)
  } else if (err.response.status===403 || err.response.status===401){
    new LoginApi().refresh(()=>{process(success,failure,Uurl,Umethod,data)},errorResponse(err, failure))
  } else{errorResponse(err, failure)}
}

let validResponse = function(resp, successMethod,Umethod) {
  if (successMethod != null) {
    if(Umethod==="DELETE" ){
      Store.clearLocalStorage() ;
    }
    successMethod(resp.data);
  }
};

let errorResponse = function(error, failure) {
  if (failure != null) {
    failure(error);
  }
};

function httpCall(Uurl, Umethod) {
  let instance = Axios.create({
    baseURL: Config.cloudBaseURL,
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
