import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class BillApi {
  //This Method Create Bill
  createBill(success, failure, profileId, data) {
    process(success, failure, profileId + "/bills", "POST", profileId, data);
  }

  //This Method Get All Bills
  getBills(success, failure, profileId, value) {
    Store.getBills() === null || value === "True" ? process(success, failure, profileId + "/bills", "GET") : success(Store.getBills());
  }

  //This Method Get Bill By ID
  getBillById(success, failure, profileId, billId) {
    process(success, failure, profileId + "/bills/" + billId, "GET");
  }

  //This Method Update Bill 
  updateBill(success, failure, profileId, billId,  data) {
    process(success, failure, profileId + "/bills/" + billId, "PUT", profileId, data);
  }

  //This Method Delete Bill
  deleteBill(success, failure, profileId, billId) {
    process(success, failure, profileId + "/bills/" + billId+"?removeDependency=true", "DELETE", profileId);
  }
}

export default BillApi;

async function process(success, failure, Uurl, Umethod, profileId, data, reload) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try {
      data === null ? promise = await HTTP.request() : promise = await HTTP.request({data});
      if (Umethod === "GET") {
        Store.saveBills(promise.data);
        validResponse(promise, success)
      } else {
        await new BillApi().getBills(success, failure, profileId, "True");
      }
    }
  //TODO: handle user error   
  catch (err) {
    handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, reload);
  }
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (profileId, err, failure, Uurl, Umethod, data, success, reload) {
  if (err.request && err.request.status === 0) {
    new BillApi().getBills(success, failure, profileId, "True");
  } else if (err.response&& (err.response.status === 403 || err.response.status === 401)) {
    if (!reload) {
      new LoginApi().refresh(() => {
        process(success, failure, Uurl, Umethod, profileId, data, "restrict")
      }, errorResponse(err, failure))
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