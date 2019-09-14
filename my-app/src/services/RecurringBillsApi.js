import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
import BillApi from "./BillApi";

class RecurringBillsApi {
  //This Method Create Bill
  createRecurringBill(success, failure, profileId, data, updateBill) {
    process(success, failure, profileId + "/recurbills", "POST", profileId, data, updateBill);
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
  updateRecurringBill(success, failure, data, profileId, recurbillId) {
    process(success, failure, profileId + "/recurbills/" + recurbillId, "PUT", profileId, data);
  }

  //This Method Delete Bill
  deleteRecurringBill(success, failure, profileId, recurbillId, recurDependencies) {
    process(success, failure, profileId + "/recurbills/" + recurbillId + "?removeDependents=" +recurDependencies, "DELETE", profileId);
  }
}

export default RecurringBillsApi;

async function process(success, failure, Uurl, Umethod, profileId, data, updateBill) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try {
    data === null ? promise = await HTTP.request() : promise = await HTTP.request({
      data
    });
    if (Umethod === "GET") {
      Store.saveRecurringBills(promise.data);
      validResponse(promise, success)
    } else if (Umethod === "POST") {
      if (updateBill) {
        validResponse(promise, success)
      } else {
        const newPostData = { ...data, "recurId": promise.data.id, "billDate": data.actualBillDate }
        await new BillApi().createBill(BillSuccessData(success, failure, profileId), failure, profileId, newPostData);
      }
    } else {
      await new RecurringBillsApi().getRecurringBills(success, failure, profileId, "True");
    }
  }
  //TODO: handle user error   
  catch (err) {
    AccessTokenError(profileId, err, failure, Uurl, Umethod, data, success);
  }
}

let BillSuccessData = function (success, failure, profileId) {
  new RecurringBillsApi().getRecurringBills(success, failure, profileId, "True");
}

//this method slove the Exprie Token Problem.
let AccessTokenError = function (profileId, err, failure, Uurl, Umethod, data, success) {
  if (err.request.status === 0) {
    new RecurringBillsApi().getRecurringBills(success, failure, profileId, "True");
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