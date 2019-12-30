import Store from "../data/Store";
import Axios from "axios";

class AbstractApi {

  profileHttpCall(requestURL, requestMethod, baseUrl) {
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
}
export default AbstractApi;