import Store from "../data/Store";
import Axios from "axios";
import LoginApi from "./LoginApi";
import BillApi from "./BillApi";

class AbstractApi {
  constructor(){
    this.loginApi = null;
    this.billApi= null;
  }

  requestType = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
  }

  httpCall(requestURL, requestMethod, baseUrl) {
    let instance = null;
    if (baseUrl !== null) {
      instance = Axios.create({
        baseURL: baseUrl,
        method: requestMethod,
        url: requestURL,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + Store.getAppUserAccessToken()
        }
      });
    }
    return instance;
  }

  validResponse(resp, successMethod) {
    if (successMethod != null) {
      successMethod(resp.data);
    }
  };

  errorResponse(error, failure) {
    if (failure != null) {
      failure(error);
    }
  };

  // only once creating instance of login service call
  loginInstance() {
    if (this.logniApi) {
      return this.logniApi;
    } else {
      this.logniApi = new LoginApi();
      return this.logniApi;
    }
  }

  billApiInstance() {
    if (this.billApi) {
      return this.billApi;
    } else {
      this.billApi = new BillApi();
      return this.billApi;
    }
  }
}
export default AbstractApi;