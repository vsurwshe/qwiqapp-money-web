import Store from "../data/Store";
import LoginApi from "./LoginApi";
import AbstractApi from "./AbstractApi";

class PaymentApi extends AbstractApi {

  loginApi = null;
  init() {
    this.loginApi = new LoginApi();
  }

  //This Method Create Bill
  addBillPayment(success, failure, profileId, billId, data) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments", "POST", profileId, data, null, billId);
  }

  //This Method Get All Bills
  getBillPayments(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments", "GET", profileId, null, null, billId);
  }

  //This Method Update Bill 
  updateBillPayment(success, failure, profileId, billId, billPaymentId, data) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments/" + billPaymentId, "PUT", profileId, data, null, billId);
  }

  //This Method Delete Bill
  deleteBillPayment(success, failure, profileId, billId, billPaymentId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments/" + billPaymentId, "DELETE", profileId, null, null, billId);
  }

  async process(success, failure, Uurl, Umethod, profileId, data, reload, billId) {
    const profile = Store.getProfile();
    const baseUrl = profile.url + "/profile/";
    let HTTP = this.httpCall(Uurl, Umethod, baseUrl);
    let promise;
    try {
      data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
      this.validResponse(promise, success)
    }
    //TODO: handle user error   
    catch (err) {
      this.handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, reload, billId);
    }
  }

  //this method slove the Exprie Token Problem.
  handleAccessTokenError(profileId, err, failure, Uurl, Umethod, data, success, reload, billId) {
    if (err.request.status === 0) {
      this.getBillPayments(success, failure, profileId, billId);
    } else if (err.response.status === 403 || err.response.status === 401) {
      if (!reload) {
        this.loginApi.refresh(() => {
          this.process(success, failure, Uurl, Umethod, profileId, data, "restrict")
        }, this.errorResponse(err, failure))
      } else {
        this.errorResponse(err, failure)
      }
    } else {
      this.errorResponse(err, failure)
    }
  }
}

export default PaymentApi;