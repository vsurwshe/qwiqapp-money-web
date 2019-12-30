import Store from "../data/Store";
import LoginApi from './LoginApi';
import AbstractApi from "./AbstractApi";

class CategoryApi extends AbstractApi {

  loginApi = null;
  init() {
    this.loginApi = new LoginApi();
  }

  createCategory(success, failure, profileId, data) {
    this.process(success, failure, profileId + "/categories", "POST", profileId, data);
  }

  getCategories(success, failure, profileId, value) {
    !Store.getCategories() || value === 'true'
      ? this.process(success, failure, profileId + "/categories?subcategories=true", 'GET', profileId)
      : success(Store.getCategories())
  }

  getCategoriesById(success, failure, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, "GET", profileId);
  }

  updateCategory(success, failure, data, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, "PUT", profileId, data);
  }

  deleteCategory(success, failure, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, "DELETE", profileId);
  }

  async process(success, failure, Uurl, Umethod, profileId, data, reload) {
    const profile = Store.getProfile();
    const baseUrl = profile.url + "/profile/";
    let HTTP = this.profileHttpCall(Uurl, Umethod, baseUrl);
    let promise;
    try {
      !data ? promise = await HTTP.request() : promise = await HTTP.request({ data })
      if (Umethod === 'GET') {
        Store.saveCategories(promise.data)
      } else {
        this.getCategories(success, failure, profileId, 'true')
      }
      this.validResponse(promise, success);
    } catch (error) {
      this.handleAccessTokenError(error, failure, Uurl, Umethod, profileId, data, success, reload)
    }
  }
  handleAccessTokenError (err, failure, Uurl, Umethod, profileId, data, success, reload) {
    if (err.request.status === 0) {
      this.errorResponse(err, failure)
    } else if (err.response.status === 401 || err.response.status === 403) {
      if (!reload) {
        this.loginApi.refresh(() => { this.process(success, failure, Uurl, Umethod, profileId, data, "restrict") }, this.errorResponse(err, failure))
      } else {
        this.errorResponse(err, failure);
      }
    } else {
      this.errorResponse(err, failure)
    }
  }
}
export default CategoryApi;
