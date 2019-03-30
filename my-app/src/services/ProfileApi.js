import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
class ProfileApi {
  createProfile(success, failure, data) {
    process(success, failure, "/profiles/", "POST", data);
  }
  getProfiles(success, failure) {
    process(success, failure, "/profiles/", "GET");
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

function process(success, failure, Uurl, Umethod, data) {
  let HTTP = httpCall(Uurl, Umethod);
  if (Umethod === "PUT" || Umethod === "POST") {
    HTTP.request({ data })
      .then(resp => validResponse(resp, success))
      .catch(err => {AccessTokenError(err,failure, Uurl, Umethod, data,success)});
  } else {
    HTTP.request()
      .then(resp => validResponse(resp, success))
      .catch(err => { AccessTokenError(err,failure, Uurl, Umethod, data,success)});
  }
}

//this method slove the Exprie Token Problem.
let AccessTokenError =function(err,failure,Uurl, Umethod, data,success){
  console.log(err.response.status);
  if (err.response.status===403 || err.response.status===401)
  {new LoginApi().refresh(()=>{process(success,failure,Uurl,Umethod,data)},(err)=>{console.log(err)})
  }else{errorResponse(err, failure)}
}

let validResponse = function(resp, successMethod) {
  // console.log("Response: ", resp.data);
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
