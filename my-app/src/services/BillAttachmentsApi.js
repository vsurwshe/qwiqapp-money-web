import Axios from "axios";
import Store from "../data/Store";
import LoginApi from './LoginApi';

class BillAttachmentsApi {

  createAttachment(success, failure, profileId, billId, data) {
    process(success, failure, profileId + "/bills/" + billId + "/attachments", "POST", data);
  }

  getAttachments(success, failure, profileId, billId) {
    process(success, failure, profileId + "/bills/" + billId + "/attachments", 'GET', profileId)
  }

  getAttachmentsById(success, failure, profileId, billId, aid) {
    process(success, failure, profileId + "/bills/" + billId + "/attachments/" + aid, "GET");
  }

  viewAttachments(success, failure, profileId, billId, aid) {
    process(success, failure, profileId + "/bills/" + billId + "/attachments/" + aid + "/view", "GET");
  }

  downloadAttachments(success, failure, profileId, billId, aid) {
    process(success, failure, profileId + "/bills/" + billId + "/attachments/" + aid + "/download", "GET");
  }
  deleteAttachment(success, failure, profileId, billId, aId) {
    process(success, failure, profileId + "/bills/" + billId + "/attachments/" + aId, "DELETE", profileId);
  }
}

export default BillAttachmentsApi;

async function process(success, failure, apiUrl, requestMethod, data, reload) {
  let HTTP = httpCall(apiUrl, requestMethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data })
    validResponse(promise, success);
  } catch (error) {
      handleAccessTokenError(error, failure, apiUrl, requestMethod, data, success,reload)
  }
}

let handleAccessTokenError = (err, failure, apiUrl, requestMethod, data, success, reload) => {
  if (err.request.status === 0) {
    errorResponse(err, failure)
  } else if (err.response.status === 401 || err.response.status === 403) {
    if (!reload) {
      new LoginApi().refresh(() => process(success, failure, apiUrl, requestMethod, data, "ristrict"), errorResponse(err, failure))  
    } else {
      errorResponse(err, failure)
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

function httpCall(apiUrl, requestMethod) {
  let baseURL = Store.getProfile();
  let instance = Axios.create({
    baseURL: baseURL.url + "/profile",
    method: requestMethod,
    url: apiUrl,
    headers: {
      "Content-Type": "form-data",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
