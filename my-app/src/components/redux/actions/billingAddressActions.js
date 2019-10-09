import axios from 'axios';
import { ADD_UPDATE_BILLING_ADDRESS, BILLING_ADDRESS_ERROR_RECEIVE, GET_RESPONSE,GET_BILLINGADDRESS, CLICK_BUTTON, CANCEL_BUTTON, STOP_NOTIFICATION} from './actionTypes';
import Config from '../../../data/Config';
import Store from '../../../data/Store';

const URL = Config.settings().cloudBaseURL + "/billing/address";

function headerConfig() {
    return {
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + Store.getAppUserAccessToken()
        }
    }
}

export function clickBillingAddressButton() {
    console.log("M1 ")
    return{
        type:CLICK_BUTTON,
        addBilling:true,
        spinner:true,
        buttonCalcel:false
    }
}

function responseAddress(params, method) {
  
    if (method === "POST") {
        return {
            type: ADD_UPDATE_BILLING_ADDRESS,
            payload: params,
            color: "success",
            successMessage: "Successfully updated billing address.."
        }
    } 
    else{
        return {
            type: GET_BILLINGADDRESS,
            payload: params.data,
            successMessage:"Loading successfully billing address..",
            color:"success"
        }
    }
}

    function handleErrorResponse(error) {
        return {
            type: BILLING_ADDRESS_ERROR_RECEIVE,
            errorMessage: error,
            color: "danger",
            successMessage: "Interel server occuring, please try Agai..."
        }
    }
export function cancelButton() {
    return {
        type: CANCEL_BUTTON,
        buttonCalcel:true,
        addBilling:false
    }
}
export function shopNotification() {
    return{
        type:STOP_NOTIFICATION,        
        showAlert:false
    }
}

    export function billingAddressPost(data) {
        return dispatch => {
            return axios.post(URL,
                data, headerConfig())
                //.then(response => response.data)
                .then(response => dispatch(responseAddress(response,"POST")))
                .catch(error => dispatch(handleErrorResponse(error)))
        }
    }

    export function loadBillingAddress() {
        return dispatch => {
            return axios.get(URL,headerConfig())
                //.then(response => response.data)
                .then(address => dispatch(responseAddress(address,"GET")))
                .catch(error => dispatch(handleErrorResponse(error)))
        }
    }
    