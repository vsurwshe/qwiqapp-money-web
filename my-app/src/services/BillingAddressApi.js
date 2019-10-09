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

async function process(success, failure, Uurl, Umethod, data, reload, payments) {
    let HTTP = httpCall(Uurl, Umethod);
    let promise;
    try {
        data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
        validResponse(promise, success,payments)
    } catch (err) {
        handleAccessTokenError(err, failure, Uurl, Umethod, data, success, reload);
    }
}

//this method slove the Exprie Token Problem.
let handleAccessTokenError = function (err, failure, Uurl, Umethod, data, success, reload) {
    if (err.request.status === 0) {
    } else if (err.response.status === 403 || err.response.status === 401) {
        if (!reload) {
            new LoginApi().refresh(() => {
                process(success, failure, Uurl, Umethod, data, "restrict")
            }, errorResponse(err, failure));
        } else {
            errorResponse(err, failure);
        }
    } else {
        errorResponse(err, failure)
    }
}

let validResponse =  function (resp, successMethod,payments) {
    if (successMethod != null) {
        if (resp.data === '') {
            successMethod(null);
           
        } else if(payments!=="payments") {
            Store.saveBillingAddress(resp.data);
            successMethod(resp.data);
            
        }else{
             successMethod(resp.data);
        }
    }
};

let errorResponse = async function (error, failure) {
    let err = error.response;
    if (err.status === 500 || err.status === 400) {
        let data = {
            status: err.status,
            message: err.data.error.debugMessage
        }
        failure(data);
    } else {
        failure(error);
    }
};

function httpCall(Uurl, Umethod) {
    let instance = Axios.create({
        baseURL: Config.settings().cloudBaseURL,
        method: Umethod,
        url: Uurl,
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + Store.getAppUserAccessToken()
        }
    });
    return instance;
}