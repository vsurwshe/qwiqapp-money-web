import Axios from "axios";
import Store from "../data/Store";
import LoginApi from './LoginApi';

class AttachmentApi {

  createAttachment(success, failure, pid, cid, data) {
    process(success, failure, pid + "/contacts/" + cid + "/attachments", "POST", data);
  }

  getAttachments(success, failure, pid, cid) {
    process(success, failure, pid + "/contacts/" + cid + "/attachments", 'GET', pid)
  }

  getAttachmentsById(success, failure, pid, cid, aid) {
    process(success, failure, pid + "/contacts/" + cid + "/attachments/" + aid, "GET");
  }

  viewAttachments(success, failure, pid, cid, aid) {
    process(success, failure, pid + "/contacts/" + cid + "/attachments/" + aid + "/view", "GET");
  }

  downloadAttachments(success, failure, pid, cid, aid) {
    process(success, failure, pid + "/contacts/" + cid + "/attachments/" + aid + "/download", "GET");
  }
  deleteAttachment(success, failure, pid, cid, aId) {
    process(success, failure, pid + "/contacts/" + cid + "/attachments/" + aId, "DELETE", pid);
  }
}

export default AttachmentApi;

async function process(success, failure, Uurl, Umethod, data, reload) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data })
    validResponse(promise, success);
  } catch (error) {
    if (error.request.status === 0) {
      errorResponse(error.response, failure)
    } else {
      handleAccessTokenError(error, failure, Uurl, Umethod, data, success,reload)
    }
  }
}

let handleAccessTokenError = (err, failure, Uurl, Umethod, data, success, reload) => {
  if (err.request.status === 0) {
    errorResponse(err, failure)
  } else if (err.response.status === 401 || err.response.status === 403) {
    if (!reload) {
      new LoginApi().refresh(() => process(success, failure, Uurl, Umethod, data, "ristrict"), errorResponse(err, failure))  
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

function httpCall(Uurl, Umethod) {
  let baseURL = Store.getProfile();
  let instance = Axios.create({
    baseURL: baseURL.url + "/profile",
    method: Umethod,
    url: Uurl,
    headers: {
      "Content-Type": "form-data",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
