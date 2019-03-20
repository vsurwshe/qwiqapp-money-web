import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
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
  if (Umethod === "PUT" || Umethod === "POST") {
    let insta = createInstance(Uurl, Umethod);
    insta
      .request({ data })
      .then(resp => validResponse(resp, success))
      .catch(err => {
        console.log(err.response.status);
        if (err.response.status)
          errorResponse("Sorry can't create Profile!", failure);
      });
  } else {
    let insta = createInstance(Uurl, Umethod);
    insta
      .request()
      .then(resp => validResponse(resp, success))
      .catch(err => errorResponse(err, failure));
  }
}

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
