import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
import Config from "../data/Config";

class BillingAddressApi {
    createBillingAddress(success, failure, data) {
        process(success, failure, "/billing/address", "POST", data)
    }

    getBillings(success, failure) {
        process(success, failure, "/billing/address", "GET")
    }

    getBillingItems(success, failure) {
        process(success, failure, "/billing/items", "GET")
    }

    getPaymentsHistory(success, failure) {
        process(success, failure, "/billing/payments", "GET",null,null,"payments")
    }
}
export default BillingAddressApi;

async function process(success, failure, apiPath, requestMethod, data, reload, payments) {
    let HTTP = httpCall(apiPath, requestMethod);
    let promise;
    try {
        data ?  promise = await HTTP.request({ data }) : promise = await HTTP.request();
        requestMethod === "GET" ?  validResponse(promise.data, success, payments) : validResponse(data, success, payments)
    } catch (error) {
        handleAccessTokenError(error, failure, apiPath, requestMethod, data, success, reload);
    }
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (error, failure, apiPath, requestMethod, data, success, reload) {
    const request = error && error.request;
    const response = error && error.response;
    if (request && request.status === 0 && !response) {
        errorResponse(error, failure);
    } else if (response && (response.status === 403 || response.status === 401)) {
        // This condtions restrict calling of api after geting 403 or 401 Error
        if (!reload) {
            new LoginApi().refresh(() => { process(success, failure, apiPath, requestMethod, data, "restrict") }, ()=>{errorResponse(error, failure)});
        } 
    } else {
        errorResponse(error, failure)
    }
}

let validResponse =  function (response, successMethod, payments) {
    if (successMethod != null) {
        // This condtion checking whether calling address api or payment api.   
        if(payments!=="payments") {
            Store.saveBillingAddress(response);
            successMethod(response);
        }else{
            successMethod(response);
        }
    }
};

let errorResponse = async function (error, failure) {
    let response = error && error.response;
    if (response && response.status === 500) {
        const {status, data} = response;
        let errorData = {
            status: status,
            message: data && data.error && data.error.debugMessage
        }
        failure(errorData);
    } else { // apart form 500, any response code else block will execute..
        failure(error);
    }
};

function httpCall(apiPath, requestMethod) {
    let instance = Axios.create({
        baseURL: Config.settings().cloudBaseURL,
        method: requestMethod,
        url: apiPath,
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + Store.getAppUserAccessToken()
        }
    });
    return instance;
}