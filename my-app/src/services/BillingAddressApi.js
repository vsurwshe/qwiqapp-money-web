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
        this.process(success, failure, "/billing/address", this.apiMethod.POST, data)
    }

    getBillings(success, failure) {
        this.process(success, failure, "/billing/address", this.apiMethod.GET)
    }

    getBillingItems(success, failure) {
        this.process(success, failure, "/billing/items", this.apiMethod.GET)
    }

    getPaymentsHistory(success, failure) {
        this.process(success, failure, "/billing/payments", this.apiMethod.GET, null, null, true)
    }

async process(success, failure, requestUrl, requestMethod, data, reload, payments) {

    const baseUrl = Config.settings().cloudBaseURL;
    let http = this.httpCall(requestUrl, requestMethod, baseUrl);
    let promise;
    if (http) {
        try {
            data ?  promise = await http.request({ data }) : promise = await http.request();
            requestMethod === this.apiMethod.GET ?  validResponse(promise.data, success, payments) : validResponse(data, success, payments)
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
            this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, data, true) }, ()=>{errorResponse(error, failure)});
        } 
    } else {
        errorResponse(error, failure)
    }
}
}
export default BillingAddressApi;

let validResponse = function (response, successMethod, payments) {
    if (successMethod != null) {
        // This condtion checking whether calling address api or payment api.   
        if(!payments){
            Store.saveBillingAddress(response); 
        }
        successMethod(response);
    }
};

let errorResponse = async function (error, failure) {
    if (failure) {
        failure(error);
    }
};
