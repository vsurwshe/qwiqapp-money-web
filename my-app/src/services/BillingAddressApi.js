import Store from "../data/Store";
import LoginApi from "./LoginApi";
import Config from "../data/Config";
import AbstractApi from "./AbstractApi";

class BillingAddressApi extends AbstractApi {

    loginApi = null;
    init() {
        this.loginApi = new LoginApi();
    }

    createBillingAddress(success, failure, data) {
        this.process(success, failure, "/billing/address", "POST", data)
    }

    getBillings(success, failure) {
        this.process(success, failure, "/billing/address", "GET")
    }

    getBillingItems(success, failure) {
        this.process(success, failure, "/billing/items", "GET")
    }

    getPaymentsHistory(success, failure) {
        this.process(success, failure, "/billing/payments", "GET", null, null, "payments")
    }

async process(success, failure, apiPath, requestMethod, data, reload, payments) {
    const baseUrl = Config.settings().cloudBaseURL;
    let HTTP = this.httpCall(apiPath, requestMethod, baseUrl);
    let promise;
    if (HTTP) {
        try {
            data ?  promise = await HTTP.request({ data }) : promise = await HTTP.request();
            requestMethod === "GET" ?  validResponse(promise.data, success, payments) : validResponse(data, success, payments)
        } catch (error) {
            this.handleAccessTokenError(error, failure, apiPath, requestMethod, data, success, reload);
        }
    }
}

//this method slove the Exprie Token Problem.
 handleAccessTokenError (error, failure, apiPath, requestMethod, data, success, reload) {
    const request = error && error.request ? error.request : '';
    const response = error && error.response ? error.response : '';
    if (request && request.status === 0 && !response) {
        errorResponse(error, failure);
    } else if (response && (response.status === 403 || response.status === 401)) {
        // This condtions restrict calling of api after geting 403 or 401 Error
        if (!reload) {
            this.loginApi.refresh(() => { this.process(success, failure, apiPath, requestMethod, data, true) }, ()=>{errorResponse(error, failure)});
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
        if (payments !== "payments") {
            Store.saveBillingAddress(response);
            successMethod(response);
        } else {
            successMethod(response);
        }
    }
};

let errorResponse = async function (error, failure) {
    let response = (error && error.response) ? error.response : ''; // If error && error.response are there, then we are assigning error.response or else ''
    if (response && response.status === 500) {
        const {status, data} = response;
        let errorData = {
            status: status,
            message: (data && data.error) && data.error.debugMessage // If data && data.error are there then assigning data.error.debugMessage or else falsy value(null/undefined...)
        }
        failure(errorData);
    } else { // apart form 500, any response code else block will execute..
        failure(error);
    }
};
