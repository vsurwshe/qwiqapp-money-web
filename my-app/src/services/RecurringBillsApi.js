import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class RecurringBillsApi extends AbstractApi {
  loginApi = null;
  billApi = null;
  init() {
    this.loginApi = this.loginInstance();
    this.billApi = this.billApiInstance();
  }
  //This Method Create Bill
  createRecurringBill(success, failure, profileId, data, updateBill, billId) {
    this.process(success, failure, profileId + "/recurbills", this.apiMethod.POST, profileId, data, updateBill, null, billId);
  }

  //This Method Get All Bills
  getRecurringBills(success, failure, profileId, value) {
    Store.getRecurringBills() === null || value ? this.process(success, failure, profileId + "/recurbills", this.apiMethod.GET) : success(Store.getRecurringBills());
  }

  //This Method Get Bill By ID
  getRecurringBillById(success, failure, profileId, recurbillId) {
    this.process(success, failure, profileId + "/recurbills/" + recurbillId, this.apiMethod.GET);
  }

  //This Method Update Bill 
  updateRecurringBill(success, failure, data, profileId, recurbillId, createNewBill, billId) {
    this.process(success, failure, profileId + "/recurbills/" + recurbillId, this.apiMethod.PUT, profileId, data, null, createNewBill, billId);
  }

  //This Method Delete Bill
  deleteRecurringBill(success, failure, profileId, recurbillId, recurDependencies) {
    this.process(success, failure, profileId + "/recurbills/" + recurbillId + "?removeDependents=" + recurDependencies, this.apiMethod.DELETE, profileId);
  }

  async process(success, failure, requestUrl, requestMethod, profileId, data, updateBill, createNewBill, billId, reload) {
    const profile = Store.getProfile();
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/" : '';
    let http = this.httpCall(requestUrl, requestMethod, baseUrl);
    let promise;
    if(http){
    try {
      data === null ? promise = await http.request() : promise = await http.request({ data });
      if (requestMethod === this.apiMethod.GET) {
        this.validResponse(promise, success)
      } else if (requestMethod === this.apiMethod.POST) {
        const newPostData = { ...data, "recurId": promise.data && promise.data.id }
        if (updateBill) { // normal Bill updated with recurring configuration
          await this.billApi.updateBill(this.billSuccessData(success, failure, profileId), failure, profileId, billId, newPostData);
        } else { // create new Recurring config and new Bills
          await this.billApi.createBill(this.billSuccessData(success, failure, profileId), failure, profileId, newPostData);
        }
      } else if (requestMethod === this.apiMethod.PUT) {
        const newPostData = { ...data, "recurId": promise.data.id, "version": data.billVersion }
        if (createNewBill) { // recur configuration updated and create New bill 
          await this.billApi.createBill(this.billSuccessData(success, failure, profileId), failure, profileId, newPostData);
        } else { // recur configuration updated and bill updated 
          this.billApi.updateBill(this.billSuccessData(success, failure, profileId), failure, profileId, billId, newPostData);
        }
      } else {
        this.getRecurringBills(success, failure, profileId, true);
      }
    }
    //TODO: handle user error   
    catch (error) {
      this.handleAccessTokenError(profileId, error, failure, requestUrl, requestMethod, data, success, updateBill, createNewBill, billId, reload);
    }
  }
  }

  billSuccessData(success, failure, profileId) {
    this.billApi.getBills(success, failure, profileId, true)
  }

  handleAccessTokenError(profileId, error, failure, requestUrl, requestMethod, data, success, updateBill, createNewBill, billId, reload) {
    const response = error && error.response ? error.response : '';
    if (error.request && response && error.request.status === 0) { // ristricting the network issues
      this.getRecurringBills(success, failure, profileId, true);
    } else if (response && (response.status === 403 || response.status === 401)) {
      if (!reload) {
        this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, profileId, data, updateBill, createNewBill, billId, true) }, this.errorResponse(error, failure));
      } else {
        this.errorResponse(error, failure)
      }
    } else {
      this.errorResponse(error, failure)
    }
  }
}


export default RecurringBillsApi;
