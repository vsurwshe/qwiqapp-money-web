import Store from "../data/Store";
import LoginApi from "./LoginApi";
import BillApi from "./BillApi";
import AbstractApi from "./AbstractApi";

class RecurringBillsApi extends AbstractApi {
  loginApi = null;
  billApi = null;
  init() {
    this.loginApi = new LoginApi();
    this.billApi = new BillApi();
  }
  //This Method Create Bill
  createRecurringBill(success, failure, profileId, data, updateBill, billId) {
    this.process(success, failure, profileId + "/recurbills", "POST", profileId, data, updateBill, null, billId);
  }

  //This Method Get All Bills
  getRecurringBills(success, failure, profileId, value) {
    Store.getRecurringBills() === null || value === "True" ? this.process(success, failure, profileId + "/recurbills", "GET") : success(Store.getRecurringBills());
  }

  //This Method Get Bill By ID
  getRecurringBillById(success, failure, profileId, recurbillId) {
    this.process(success, failure, profileId + "/recurbills/" + recurbillId, "GET");
  }

  //This Method Update Bill 
  updateRecurringBill(success, failure, data, profileId, recurbillId, createNewBill, billId) {
    this.process(success, failure, profileId + "/recurbills/" + recurbillId, "PUT", profileId, data, null, createNewBill, billId);
  }

  //This Method Delete Bill
  deleteRecurringBill(success, failure, profileId, recurbillId, recurDependencies) {
    this.process(success, failure, profileId + "/recurbills/" + recurbillId + "?removeDependents=" + recurDependencies, "DELETE", profileId);
  }

  async process(success, failure, Uurl, Umethod, profileId, data, updateBill, createNewBill, billId, reload) {
    const profile = Store.getProfile();
    const baseUrl = profile.url + "/profile/";
    let HTTP = this.httpCall(Uurl, Umethod, baseUrl);
    let promise;
    try {
      data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
      if (Umethod === "GET") {
        this.validResponse(promise, success)
      } else if (Umethod === "POST") {
        const newPostData = { ...data, "recurId": promise.data.id }
        if (updateBill) { // normal Bill updated with recurring configuration
          await this.billApi.updateBill(this.billSuccessData(success, failure, profileId), failure, profileId, billId, newPostData);
        } else { // create new Recurring config and new Bills
          await this.billApi.createBill(this.billSuccessData(success, failure, profileId), failure, profileId, newPostData);
        }
      } else if (Umethod === "PUT") {
        const newPostData = { ...data, "recurId": promise.data.id, "version": data.billVersion }
        if (createNewBill) { // recur configuration updated and create New bill 
          await this.billApi.createBill(this.billSuccessData(success, failure, profileId), failure, profileId, newPostData);
        } else { // recur configuration updated and bill updated 
          this.billApi.updateBill(this.billSuccessData(success, failure, profileId), failure, profileId, billId, newPostData);
        }
      } else {
        this.getRecurringBills(success, failure, profileId, "True");
      }
    }
    //TODO: handle user error   
    catch (err) {
      this.handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, updateBill, createNewBill, billId, reload);
    }
  }

  billSuccessData(success, failure, profileId) {
    this.billApi.getBills(success, failure, profileId, "True")
  }
  handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, updateBill, createNewBill, billId, reload) {
    if (err.request && err.request.status === 0) {
      this.getRecurringBills(success, failure, profileId, "True");
    } else if (err.response && (err.response.status === 403 || err.response.status === 401)) {
      if (!reload) {
        this.loginApi.refresh(() => { this.process(success, failure, Uurl, Umethod, profileId, data, updateBill, createNewBill, billId, "ristrict") }, this.errorResponse(err, failure));
      } else {
        this.errorResponse(err, failure)
      }
    } else {
      this.errorResponse(err, failure)
    }
  }
}

export default RecurringBillsApi;
