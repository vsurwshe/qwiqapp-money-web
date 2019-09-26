import Axios from "axios";
import Store from "../data/Store";
import LoginApi from './LoginApi';

class CategoryApi {
  createCategory(success, failure, profileId, data) {
    process(success, failure, profileId + "/categories", "POST", profileId, data);
  }

  getCategories(success, failure, profileId, value) {
    !Store.getCategories() || value === 'true'
      ? process(success, failure, profileId + "/categories?subcategories=true", 'GET', profileId)
      : success(Store.getCategories())
  }

  getCategoriesById(success, failure, profileId, categoryId) {
    process(success, failure, profileId + "/categories/" + categoryId, "GET", profileId);
  }

  updateCategory(success, failure, data, profileId, categoryId) {
    process(success, failure, profileId + "/categories/" + categoryId, "PUT", profileId, data);
  }

  deleteCategory(success, failure, profileId, categoryId) {
    process(success, failure, profileId + "/categories/" + categoryId, "DELETE", profileId);
  }
}

export default CategoryApi;

async function process(success, failure, Uurl, Umethod, profileId, data, reload) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try {
    !data ? promise = await HTTP.request() : promise = await HTTP.request({ data })
    if (Umethod === 'GET') {
      Store.saveCategories(promise.data)
    } else {
      new CategoryApi().getCategories(success, failure, profileId, 'true')
    }
    validResponse(promise, success);
  } catch (error) {
    handleAccessTokenError(error, failure, Uurl, Umethod, profileId, data, success, reload)
  }
}

let handleAccessTokenError = (err, failure, Uurl, Umethod, profileId, data, success, reload) => {
  if (err.request.status === 0) {
    errorResponse(err, failure)
  } else if (err.response.status === 401 || err.response.status === 403) {
      if (!reload) {
      new LoginApi().refresh(() => process(success, failure, Uurl, Umethod, profileId, data, "restrict"), errorResponse(err, failure));
    } else {
      errorResponse(err, failure);
    }
  } else {
    errorResponse(err, failure)
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
  let baseURL = Store.getProfile()
  let instance = Axios.create({
    baseURL: baseURL.url + "/profile/",
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
