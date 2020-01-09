import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class BillApi extends AbstractApi {

  loginApi = null;
  constructor() {
    super()
    if (!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }
  //This Method Create Bill
  createBill(success, failure, profileId, data) {
    this.process(success, failure, profileId + "/bills", "POST", profileId, data);
  }

  //This Method Get All Bills
  getBills(success, failure, profileId, value) {
    !Store.getBills() || value ? this.process(success, failure, profileId + "/bills", "GET", profileId) : success(Store.getBills());
  }

  //This Method Get Bill By ID
  getBillById(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId, "GET", profileId, null, null, billId);
  }

  //This Method Update Bill 
  updateBill(success, failure, profileId, billId, data) {
    this.process(success, failure, profileId + "/bills/" + billId, "PUT", profileId, data);
  }

  //This Method Delete Bill
  deleteBill(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId + "?removeDependency=true", "DELETE", profileId);
  }

  markAsUnPaid(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/unpaid", "PUT", profileId);
  }

  async process(success, failure, requestURL, requestMethod, profileId, data, reload, billId) {
    const profile = Store.getProfile();
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/" : '';
    let HTTP = this.httpCall(requestURL, requestMethod, baseUrl);
    let promise;
    try {
      !data ? promise = await HTTP.request() : promise = await HTTP.request({ data });
      if (requestMethod === "GET") {
        if (billId) {
          let filterData = Store.getBills() && Store.getBills().filter(bill => bill.id !== promise.data.id)
          filterData.push(promise.data)
          Store.saveBills(filterData);
        } else {
          Store.saveBills(promise.data);
        }
        this.validResponse(promise, success)
      } else {
        this.getBills(success, failure, profileId, true);
      }
    }
    // handle user error   
    catch (err) {
      this.handleAccessTokenError(profileId, err, failure, requestURL, requestMethod, data, success, reload);
    }
  }
  //this method slove the Exprie Token Problem.
  handleAccessTokenError(profileId, err, failure, requestURL, requestMethod, data, success, reload) {
    if (err.request && err.request.status === 0) {
      this.getBills(success, failure, profileId, true);
    } else if (err.response && (err.response.status === 403 || err.response.status === 401)) {
      if (!reload) {
        this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, requestURL, requestMethod, profileId, data, true) }, this.errorResponse(err, failure))
      } else {
        this.errorResponse(err, failure)
      }
    } else {
      this.errorResponse(err, failure)
    }
  }
}
export default BillApi;