import Store from "../data/Store";
import AbstractApi from "./AbstractApi";
import LoginApi from "./LoginApi";
import Axios from "axios";

class CategoryApi extends AbstractApi {

  loginApi = null;
  constructor() {
    super()
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  createCategory(success, failure, profileId, data) {
    this.process(success, failure, profileId + "/categories", this.apiMethod.POST, profileId, data);
  }

  getCategories(success, failure, profileId, value) {
    !Store.getCategories() || value 
      ? process(success, failure, profileId + "/categories?subcategories=true", 'GET', profileId)
      : success(Store.getCategories())
  }

  getCategoriesById(success, failure, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, this.apiMethod.GET, profileId);
  }

  updateCategory(success, failure, data, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, this.apiMethod.PUT, profileId, data);
  }

  deleteCategory(success, failure, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, this.apiMethod.DELETE, profileId);
  }

  async process(success, failure, requestUrl, requestMethod, profileId, data, reload) {
    const profile = Store.getProfile();
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/" : '';
    let http = this.httpCall(requestUrl, requestMethod, baseUrl);
    let promise;
    if (http) {
      try {
        !data ? promise = await http.request() : promise = await http.request({ data })
        if (requestMethod === this.apiMethod.GET) {
          Store.saveCategories(promise.data)
        } else {
          this.getCategories(success, failure, profileId, true)
        }
        this.validResponse(promise, success);
      } catch (error) {
        this.handleAccessTokenError(error, failure, requestUrl, requestMethod, profileId, data, success, reload)
      }
    }
  }
  handleAccessTokenError(err, failure, requestUrl, requestMethod, profileId, data, success, reload) {
    if (err.request.status === 0) {
      this.errorResponse(err, failure)
    } else if (err.response.status === 401 || err.response.status === 403) {
      if (!reload) {
        this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, profileId, data, true) }, this.errorResponse(err, failure))
      } else {
        this.errorResponse(err, failure);
      }
    } else {
      this.errorResponse(err, failure)
    }
  }
}
export default CategoryApi;

async function process(success, failure, Uurl, Umethod, profileId, data, reload) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  if (HTTP) {
    try {
      !data ? promise = await HTTP.request() : promise = await HTTP.request({ data })
      if (Umethod === 'GET') {
        Store.saveCategories(promise.data)
      } else {
        new CategoryApi().getCategories(success, failure, profileId, true)
      }
      validResponse(promise, success);
    } catch (error) {
      handleAccessTokenError(error, failure, Uurl, Umethod, profileId, data, success, reload)
    }
  }
}

let handleAccessTokenError = (error, failure, Uurl, Umethod, profileId, data, success, reload) => {
  const response = error && error.response ? error.response : '';
  const request = error && error.request ? error.request : '';
  if (response && (request && request.status === 0)) { // Handling infinite api calls(if user dont have network) -> response parameter
    errorResponse(error, failure)
  } else if (response && (response.status === 401 || response.status === 403)) {
    if (!reload) {
      new LoginApi().refresh(() => process(success, failure, Uurl, Umethod, profileId, data, true), errorResponse(error, failure));
    } else {
      errorResponse(error, failure);
    }
  } else {
    errorResponse(error, failure)
  }
}

let validResponse = function (resp, successMethod) {
  if (successMethod != null) {
    successMethod(resp.data);
  }
};

let errorResponse = function (error, failure) {
  if (failure != null) {
    failure(error);
  }
};

function httpCall(Uurl, Umethod) {
  let profile = Store.getProfile()
  let instance = null;
  if (profile) {
    instance = Axios.create({
      baseURL: profile.url + "/profile/",
      method: Umethod,
      url: Uurl,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + Store.getAppUserAccessToken()
      }
    });
  }
  return instance;
}
