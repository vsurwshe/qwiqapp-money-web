/*
  * componet dispatch mathods executing a specific method execute.
  * specific action type and appended state calling reduces class. 
*/

import { CLICK_BUTTON, CANCEL_BUTTON, GET_BILLING_ADDRESS, SET_SPINNER, MESSAGE_CHANGE, UPDATE_STATUS, GET_COUNTRIES} from './actionTypes'; 

// This redux actions seting button value and spinner value as you passed in parameters.
export function buttonAction(action,spinnerValue) {
    return{
        type:CLICK_BUTTON,
        addBilling:action,
        spinner:spinnerValue
    }
}
// This redux actions seting countries in reducers.
export function setCountries(countries) {
    return {
        type: GET_COUNTRIES,
        countries: countries
    }
}

// seting spinner in reducers.
export function setSpinnerValue(value) {
    return {
        type: SET_SPINNER,
        spinner: value
    }
}

// getting BillingAddress from reducers.
export function getBillingAddress(billingData) {
    return {
        type: GET_BILLING_ADDRESS,
        payload: billingData
    }
}

// alert messages 
export function handleApiResponseMsg(message,color,value) {
    return {
        type: MESSAGE_CHANGE,
        color,
        message,
        showAlert:value
    }
}

// updating every time bill address/ get billing address.
export function updateStatus(value){
    return {
        type: UPDATE_STATUS,
        updateStatus: value
    }
}
// event handle calcel button
export function cancelButton() {
    return {
        type: CANCEL_BUTTON,
        buttonCalcel:true,
        addBilling:false
    }
}
