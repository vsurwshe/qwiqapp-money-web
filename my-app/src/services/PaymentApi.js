import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class PaymentApi extends AbstractApi {

  loginApi = null;
  constructor(){
    super();
    if(!this.loginApi) {
      this.loginApi = this.loginInstance();
    }
  }

  //This Method Create Bill
  addBillPayment(success, failure, profileId, billId, data) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments", this.methodType.POST, profileId, data, null, billId);
  }

  //This Method Get All Bills
  getBillPayments(success, failure, profileId, billId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments", this.methodType.GET, profileId, null, null, billId);
  }

  //This Method Update Bill 
  updateBillPayment(success, failure, profileId, billId, billPaymentId, data) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments/" + billPaymentId, this.methodType.PUT, profileId, data, null, billId);
  }

  //This Method Delete Bill
  deleteBillPayment(success, failure, profileId, billId, billPaymentId) {
    this.process(success, failure, profileId + "/bills/" + billId + "/payments/" + billPaymentId, this.methodType.DELETE, profileId, null, null, billId);
  }

  async process(success, failure, requestUrl, requestMethod, profileId, data, reload, billId) {
    const profile = Store.getProfile();
    const baseUrl = (profile && profile.url) ? profile.url + "/profile/" : '';
    let http = this.httpCall(requestUrl, requestMethod, baseUrl);
    let promise;
    if(http){
    try {
      data === null ? promise = await http.request() : promise = await http.request({ data });
      this.validResponse(promise, success)
    }
    //TODO: handle user error   
    catch (err) {
      this.handleAccessTokenError(profileId, err, failure, requestUrl, requestMethod, data, success, reload, billId);
    }
  }
  }

  //this method slove the Exprie Token Problem.
  handleAccessTokenError(profileId, err, failure, requestUrl, requestMethod, data, success, reload, billId) {
    if (err.request.status === 0) {
      this.getBillPayments(success, failure, profileId, billId);
    } else if (err.response.status === 403 || err.response.status === 401) {
      if (!reload) {
        this.loginApi && this.loginApi.refresh(() => {
          this.process(success, failure, requestUrl, requestMethod, profileId, data, true)
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