import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
import BillApi from "./BillApi";

class RecurringBillsApi {
  //This Method Create Bill
  createRecurringBill(success, failure, profileId, data, updateBill, billId) {
    process(success, failure, profileId + "/recurbills", "POST", profileId, data, updateBill, null, billId);
  }

  //This Method Get All Bills
  getRecurringBills(success, failure, profileId, value) {
    Store.getRecurringBills() === null || value === "True" ? process(success, failure, profileId + "/recurbills", "GET") : success(Store.getRecurringBills());
  }

  //This Method Get Bill By ID
  getRecurringBillById(success, failure, profileId, recurbillId) {
    process(success, failure, profileId + "/recurbills/" + recurbillId, "GET");
  }

  //This Method Update Bill 
  updateRecurringBill(success, failure, data, profileId, recurbillId, createNewBill, billId) {
    process(success, failure, profileId + "/recurbills/" + recurbillId, "PUT", profileId, data, null, createNewBill, billId);
  }

  //This Method Delete Bill
  deleteRecurringBill(success, failure, profileId, recurbillId, recurDependencies) {
    process(success, failure, profileId + "/recurbills/" + recurbillId + "?removeDependents=" +recurDependencies, "DELETE", profileId);
  }
}

export default RecurringBillsApi;

async function process(success, failure, Uurl, Umethod, profileId, data, updateBill, createNewBill, billId, reload) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
    if (Umethod === "GET") {
      validResponse(promise, success)
    } else if (Umethod === "POST") {
      const newPostData = { ...data, "recurId": promise.data.id }
      if (updateBill) { // normal Bill updated with recurring configuration
         await new BillApi().updateBill(BillSuccessData(success, failure, profileId), failure, profileId, billId, newPostData);
      } else { // create new Recurring config and new Bills
        await new BillApi().createBill(BillSuccessData(success, failure, profileId), failure, profileId, newPostData);
      }
    } else if (Umethod === "PUT") {
      const newPostData = { ...data, "recurId": promise.data.id, "version": data.billVersion }
      if (createNewBill) { // recur configuration updated and create New bill 
        await new BillApi().createBill(BillSuccessData(success, failure, profileId), failure, profileId, newPostData);
      } else { // recur configuration updated and bill updated 
        new BillApi().updateBill(BillSuccessData(success, failure, profileId), failure, profileId, billId, newPostData );
      }
    } else {
      await new RecurringBillsApi().getRecurringBills(success, failure, profileId, "True");
    }
  }
  //TODO: handle user error   
  catch (err) {
    handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, updateBill, createNewBill, billId, reload);
  }
}

let BillSuccessData = function (success, failure, profileId) {
  // new RecurringBillsApi().getRecurringBills(success, failure, profileId, "True");
  new BillApi().getBills(success, failure, profileId, "True")
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (profileId, err, failure, Uurl, Umethod, data, success, updateBill, createNewBill, billId, reload) {
  if (err.request && err.request.status === 0) {
    new RecurringBillsApi().getRecurringBills(success, failure, profileId, "True");
  } else if (err.response && (err.response.status === 403 || err.response.status === 401)) {
    if (!reload) {
      new LoginApi().refresh(() => { process(success, failure, Uurl, Umethod, profileId, data, updateBill, createNewBill, billId, "ristrict") }, errorResponse(err, failure));
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