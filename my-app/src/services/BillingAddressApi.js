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
    getBillingItems(success,failure){
        process(success,failure,"/billing/items", "GET")
      }
      
    getPaymentsHistory(success,failure){
        process(success,failure,"/billing/payments","GET")
      }
}

export default BillingAddressApi;

async function process(success, failure, Uurl, Umethod, data) {
    let HTTP = httpCall(Uurl, Umethod);
    let promise;
    try {
        data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
        validResponse(promise, success)
    } catch (err) {
        errorResponse(err, failure)
        AccessTokenError(err, failure, Uurl, Umethod, data, success);
    }
}

//this method slove the Exprie Token Problem.
let AccessTokenError = function (err, failure, Uurl, Umethod, data, success) {
    if (err.request.status === 0) {
    } else if (err.response.status === 403 || err.response.status === 401) {
        new LoginApi().refresh(() => {
            process(success, failure, Uurl, Umethod, data)
        }, errorResponse(err, failure))
    } else {
        errorResponse(err, failure)
    }
}

let validResponse = function (resp, successMethod) {
    if (successMethod != null) {
        if (resp.data === '') {
            successMethod(null);
        } else {
            successMethod(resp.data);
        }
    }
};

let errorResponse = function (error, failure) {
    if (failure != null) {
        failure(error);
    }
};

function httpCall(Uurl, Umethod) {
    let instance = Axios.create({
        baseURL: Config.cloudBaseURL,
        method: Umethod,
        url: Uurl,
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + Store.getAppUserAccessToken()
        }
    });
    return instance;
}