import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";

class PaymentApi {
  //This Method Create Bill
  addBillPayment(success, failure, profileId, billId, data) {
    process(success, failure, profileId + "/bills/" + billId + "/payments", "POST", profileId, data, null, billId);
  }

  //This Method Get All Bills
  getBillPayments(success, failure, profileId, billId) {
    process(success, failure, profileId + "/bills/" + billId + "/payments", "GET");
  }

  //This Method Update Bill 
  updateBillPayment(success, failure, profileId, billId, billPaymentId, data) {
    process(success, failure, profileId + "/bills/" + billId + "/payments/" + billPaymentId, "PUT", profileId, data, null, billId);
  }

  //This Method Delete Bill
  deleteBillPayment(success, failure, profileId, billId, billPaymentId) {
    process(success, failure, profileId + "/bills/" + billId + "/payments/" + billPaymentId, "DELETE", profileId, null, null, billId);
  }
}

export default PaymentApi;

async function process(success, failure, Uurl, Umethod, profileId, data, reload, billId) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    if (Umethod === "GET") {
      validResponse(promise, success)
    } else {
      await new PaymentApi().getBillPayments(success, failure, profileId, billId);
    }
  }
  //TODO: handle user error   
  catch (err) {
    handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, reload);
  }
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (profileId, err, failure, Uurl, Umethod, data, success, reload) {
  if (err.request.status === 0) {
    new PaymentApi().getBillPayments(success, failure, profileId, "True");
  } else if (err.response.status === 403 || err.response.status === 401) {
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