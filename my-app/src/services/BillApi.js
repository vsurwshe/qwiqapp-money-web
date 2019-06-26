import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
class BillApi {
  //This Method Create Bill
  createBill(success, failure, pid, data) {
    process(success, failure, pid + "/bills", "POST", pid, data);
  }
  //This Method Get All Bills
  getBills(success, failure, pid, value) {
    Store.getBills() === null || value === "True" ? process(success, failure, pid + "/bills", "GET") : success(Store.getBills());
  }
  //This Method Get Bill By ID
  getBillById(success, failure, pid, billId) {
    process(success, failure, pid + "/bills/" + billId, "GET");
  }

  //This Method Update Bill 
  updateBill(success, failure, data, pid, billId) {
    process(success, failure, pid + "/bills/" + billId, "PUT", pid, data);
  }
  //This Method Delete Bill
  deleteBill(success, failure, pid, billId) {
    process(success, failure, pid + "/bills/" + billId, "DELETE", pid);
  }
}

export default BillApi;

async function process(success, failure, Uurl, Umethod, profileId, data) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({
      data
    });
    if (Umethod === "GET") {
      Store.saveBills(promise.data);
      validResponse(promise, success)
    } else {
      new BillApi().getBills(success, failure, profileId, "True");
      validResponse(promise, success)
    }
  } catch (err) {
    console.log(err);
    AccessTokenError(profileId, err, failure, Uurl, Umethod, data, success);
  }
}

//this method slove the Exprie Token Problem.
let AccessTokenError = function (profileId, err, failure, Uurl, Umethod, data, success) {
  if (err.request.status === 0) {
    new BillApi().getBills(success, failure, profileId, "True");
  } else if (err.response.status === 403 || err.response.status === 401) {
    new LoginApi().refresh(() => {
      process(success, failure, Uurl, Umethod, profileId, data)
    }, errorResponse(err, failure))
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
    baseURL: baseURL[0].url + "/profile/",
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}