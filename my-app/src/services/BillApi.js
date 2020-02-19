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
    this.process(success, failure, profileId + "/bills", this.methodType.POST, profileId, data);
  }

  //This Method Get All Bills
  getBills(success, failure, profileId, value) {
    !Store.getBills() || value ? this.process(success, failure, profileId + "/bills", this.methodType.GET, profileId) : success(Store.getBills());
  }

  //This Method Get Bill By ID
  getBillById(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId, this.methodType.GET, profileId, null, null, billId);
  }

  //This Method Update Bill 
  updateBill(success, failure, profileId, billId, data) {
    this.process(success, failure, profileId + "/bills/" + billId, this.methodType.PUT, profileId, data);
  }

  //This Method Delete Bill
  deleteBill(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId + "?removeDependency=true", this.methodType.DELETE, profileId);
  }

  markAsUnPaid(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/unpaid", "PUT", profileId);
  }

  async process(success, failure, requestURL, requestMethod, profileId, data, reload, billId) {
    const profile = Store.getProfile();
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/" : '';
    let http = this.httpCall(requestURL, requestMethod, baseUrl);
    let promise;
    if (http) {
      try {
        !data ? promise = await http.request() : promise = await http.request({ data });
        if (requestMethod === this.methodType.GET) {
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
  }
  //this method slove the Exprie Token Problem.
  handleAccessTokenError(profileId, error, failure, requestURL, requestMethod, data, success, reload) {
    const response = error.response ? error.response : '';
    if (response && (response.status === 403 || response.status === 401)) {
      if (!reload) { // Handle access token error, ristricting the infinit api calls.
        this.loginApi && this.loginApi.refresh(() => { this.process(success, failure, requestURL, requestMethod, profileId, data, true) }, this.errorResponse(error, failure))
      } else {
        this.errorResponse(error, failure)
      }
    } else {
      this.errorResponse(error, failure)
    }
  }
}
export default BillApi;