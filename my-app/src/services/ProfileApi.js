import Config from "../data/Config";
import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class ProfileApi extends AbstractApi {

  constructor() {
    super();
    this.loginApi = null;
    
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  createProfile(success, failure, data) {
    this.process(success, failure, "/profiles/", this.apiMethod.POST, data);
  }

  getProfiles(success, failure, newGetRequest) {
    !Store.getUserProfiles() || newGetRequest ? this.process(success, failure, "/profiles/", this.apiMethod.GET) : success(Store.getUserProfiles());
  }

  getProfileById(success, failure, profileId) {
    this.process(success, failure, "/profiles/" + profileId, this.apiMethod.GET, null, null, profileId);
  }

  updateProfile(success, failure, data, profileId) {
    this.process(success, failure, "/profiles/" + profileId, this.apiMethod.PUT, data);
  }

  deleteProfile(success, failure, profileId) {
    this.process(success, failure, "/profiles/" + profileId, this.apiMethod.DELETE, null, null, profileId);
  }

  upgradeProfile(success, failure, profileId, type) {
    this.process(success, failure, "/profiles/" + profileId + "/upgrade?type=" + type, this.apiMethod.PUT, null, null, profileId);
  }


  async process(success, failure, requestUrl, requestMethod, data, deleteId, profileId, reload) {
    const baseUrl = Config.settings().cloudBaseURL;
    let http = this.httpCall(requestUrl, requestMethod, baseUrl);
    let promise;
    if(http){
    try {
      data === null ? promise = await http.request() : promise = await http.request({ data });
      if (requestMethod === this.apiMethod.GET) {
        let selectedProfile = Store.getProfile();
        // This condition decides to save profiles in Store for getProfiles Method call only
        if (!profileId) {
          Store.saveUserProfiles(promise.data);
        } else if (selectedProfile && selectedProfile.id === profileId) { // Checks if the ProfileId in Store and passing profileId is the same, then saves API response to Store 
          Store.saveProfile(promise.data);
        }
        this.successResponse(promise, success, requestMethod, deleteId)
      } else {
        if (requestMethod === this.apiMethod.POST || requestMethod === this.apiMethod.PUT) {
          this.loginApi.refresh(async () => { // Calls Refresh Token 
            if (profileId) { //If profileId is there, calls getProfileById for updated data 
              this.getProfileById(async () => {
                this.getProfiles(success, failure, true); // Calling getprofiles for updated changes to show
              }, failure, profileId)
            } else { // Calling getprofiles for updated changes to show
              this.getProfiles(success, failure, true);
            }
          }, (error) => this.errorResponse(error, failure))
        } else {
          this.getProfiles(success, failure, true);
        }
      }
    } catch (error) {
      this.handleAccessTokenError(error, failure, requestUrl, requestMethod, data, deleteId, success, profileId, reload);
    }
  }
}
  //this method solve the Expire Token Problem.
  handleAccessTokenError(error, failure, requestUrl, requestMethod, data, deleteId, success, profileId, reload) {
    if (error.request && error.request.status === 0) {
      this.errorResponse(error, failure)
    } else if (error.response.status === 403 || error.response.status === 401) {
      if (!reload) {
        this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, data, deleteId, profileId, true) }, this.errorResponse(error, failure))
      } else {
        this.errorResponse(error, failure)
      }
    } else { this.errorResponse(error, failure) }
  }
  async successResponse (resp, successMethod, requestMethod, deleteId) {

  if (successMethod != null) {
    if (requestMethod === this.apiMethod.DELETE) {
      if (Store.getProfile().id === deleteId) {
        Store.saveProfile(null);
        Store.setSelectedValue(false);
        Store.userDataClear();
      }
    } else if (requestMethod === this.apiMethod.POST) {
      Store.setSelectedValue(true);
      Store.userDataClear();
      Store.saveProfile(resp.data)
    }
    successMethod(resp.data);
  }
}
}

export default ProfileApi;
