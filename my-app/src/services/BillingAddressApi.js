import Store from "../data/Store";
import Config from "../data/Config";
import AbstractApi from "./AbstractApi";

class BillingAddressApi extends AbstractApi {

    constructor() {
        super();
        this.loginApi = null;
        if (!this.loginApi) {
            this.loginApi = this.loginInstance();
        }
    }

    createBillingAddress(success, failure, data) {
        this.process(success, failure, "/billing/address", this.requestType.POST, data)
    }

    getBillings(success, failure) {
        this.process(success, failure, "/billing/address", this.requestType.GET)
    }

    getBillingItems(success, failure) {
        this.process(success, failure, "/billing/items", this.requestType.GET)
    }

    getPaymentsHistory(success, failure) {
        this.process(success, failure, "/billing/payments", this.requestType.GET, null, null, true)
    }

    async process(success, failure, requestUrl, requestMethod, data, reload, payments) {
        const baseUrl = Config.settings().cloudBaseURL;
        let http = this.httpCall(requestUrl, requestMethod, baseUrl);
        let promise;
        if (http) {
            try {
                data ? promise = await http.request({ data }) : promise = await http.request();
                requestMethod === this.requestType.GET ? validResponse(promise.data, success, payments) : validResponse(data, success, payments)
            } catch (error) {
                this.handleAccessTokenError(error, failure, requestUrl, requestMethod, data, success, reload);
            }
        }
    }

//this method slove the Exprie Token Problem.
    handleAccessTokenError (error, failure, requestUrl, requestMethod, data, success, reload) {
        const response = error && error.response ? error.response : '';
        if (response && (response.status === 403 || response.status === 401)) {
            // This condtions restrict calling of api after geting 403 or 401 Error
            if (!reload) {
                this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, data, true) }, ()=>{this.errorResponse(error, failure)});
            } else {
                this.errorResponse(error, failure)
            }
        } else {
            this.errorResponse(error, failure)
        }
    }
}
export default BillingAddressApi;

let validResponse = function(response, successMethod, payments) {
    if (successMethod != null) {
        // This condtion checking whether calling address api or payment api.   
        if (!payments) {
            Store.saveBillingAddress(response);
        }
        successMethod(response);
    }
};