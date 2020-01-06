import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class CategoryApi extends AbstractApi {

  loginApi = null;
  constructor() {
    super()
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  createCategory(success, failure, profileId, data) {
    this.process(success, failure, profileId + "/categories", "POST", profileId, data);
  }

  getCategories(success, failure, profileId, value) {
    !Store.getCategories() || value 
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
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/": '';
    let HTTP = this.httpCall(Uurl, Umethod, baseUrl);
    let promise;
    try {
      !data ? promise = await HTTP.request() : promise = await HTTP.request({ data })
      if (Umethod === 'GET') {
        Store.saveCategories(promise.data)
      } else {
        this.getCategories(success, failure, profileId, true)
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
        this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, Uurl, Umethod, profileId, data, true) }, this.errorResponse(err, failure))
      } else {
        this.errorResponse(err, failure);
      }
    } else {
      this.errorResponse(err, failure)
    }
  }
}
export default CategoryApi;
