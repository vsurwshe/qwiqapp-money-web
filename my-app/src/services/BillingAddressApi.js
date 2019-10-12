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
        data ?  promise = await HTTP.request({ data }) :promise = await HTTP.request()
        requestMethod === "GET" ?  validResponse(promise.data, success,payments) : validResponse(data, success,payments)
    } catch (err) {
        handleAccessTokenError(err, failure, apiPath, requestMethod, data, success, reload);
    }
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (err, failure, apiPath, requestMethod, data, success, reload) {
    if (err.request.status === 0) {
    } else if (err.response.status === 403 || err.response.status === 401) {
        // This condtions restrict calling of api after geting 403 or 401 Error
        if (!reload) {
            new LoginApi().refresh(() => { process(success, failure, apiPath, requestMethod, data, "restrict") }, errorResponse(err, failure));
        } 
    } else {
        errorResponse(err, failure)
    }
}

let validResponse =  function (response, successMethod,payments) {
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
    let err = error.response;
    if (err.status === 500) {
        let data = {
            status: err.status,
            message: err.data.error.debugMessage
        }
        failure(data);
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