import Store from "../data/Store";
import Axios from "axios";
import LoginApi from "./LoginApi";
import BillApi from "./BillApi";

let logniApi = null;
let billApi = null;

class AbstractApi {

  apiMethod = {
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

  validResponse (resp, successMethod) {
    if (successMethod != null) {
      successMethod(resp.data);
    }
  };

  errorResponse (error, failure) {
    if (failure != null) {
      failure(error);
    }
  };

  // only once creating instance of login service call
  loginInstance () {
    if (logniApi) {
      return logniApi;
    } else {
      logniApi = new LoginApi();
      return logniApi;
    }
  }

  billApiInstance () {
    if (billApi) {
      return billApi;
    } else {
      billApi = new BillApi();
      return billApi;
    }
  }
}
export default AbstractApi;