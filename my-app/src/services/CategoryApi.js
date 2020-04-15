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
    this.process(success, failure, profileId + "/categories", this.requestType.POST, profileId, data);
  }

  getCategories(success, failure, profileId, value) {
    !Store.getCategories() || value 
      ? this.process(success, failure, profileId + "/categories?subcategories=true", this.requestType.GET, profileId)
      : success(Store.getCategories())
  }

  getCategoriesById(success, failure, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, this.requestType.GET, profileId);
  }

  updateCategory(success, failure, data, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, this.requestType.PUT, profileId, data);
  }

  deleteCategory(success, failure, profileId, categoryId) {
    this.process(success, failure, profileId + "/categories/" + categoryId, this.requestType.DELETE, profileId);
  }

  async process(success, failure, requestUrl, requestMethod, profileId, data, reload) {
    const profile = Store.getProfile();
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/" : '';
    let http = this.httpCall(requestUrl, requestMethod, baseUrl);
    let promise;
    if (http) {
      try {
        !data ? promise = await http.request() : promise = await http.request({ data })
        if (requestMethod === this.requestType.GET) {
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
  handleAccessTokenError(error, failure, requestUrl, requestMethod, profileId, data, success, reload) {
    const response = error && error.response ? error.response : '';
    // Here we are handling refresh token error.
    if (response && (response.status === 401 || response.status === 403)) {
      if (!reload) { // Solving the unlimited refresh API calls(calling once because of reload parameter) 
        this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, profileId, data, true) }, this.errorResponse(error, failure))
      } else { // other then any error with status 401/403 for more then 1, Else block will executes
        this.errorResponse(error, failure);
      }
    } else {
      this.errorResponse(error, failure)
    }
  }
}
export default CategoryApi;