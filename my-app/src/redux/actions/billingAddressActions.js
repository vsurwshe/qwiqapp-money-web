import { CLICK_BUTTON, CANCEL_BUTTON, GET_BILLING_ADDRESS, SET_SPINNER, MESSAGE_CHANGE, UPDATE_STATUS, GET_COUNTRIES} from './actionTypes';

export function buttonAction(action,spinnerValue) {
    return{
        type:CLICK_BUTTON,
        addBilling:action,
        spinner:spinnerValue
    }
}

export function setCountries(countires) {
    return {
        type: GET_COUNTRIES,
        countries: countires
    }
}


export function setSpinnerValue(value) {
    return {
        type: SET_SPINNER,
        spinner: value
    }
}

export function getBillingAddress(billingData) {
    return {
        type: GET_BILLING_ADDRESS,
        payload: billingData
    }
}

export function handleApiResponseMsg(message,color,value) {
    return {
        type: MESSAGE_CHANGE,
        color,
        message,
        showAlert:value
    }
}

export function updateStatus(value){
    return {
        type: UPDATE_STATUS,
        updateStatus: value
    }
}

export function cancelButton() {
    return {
        type: CANCEL_BUTTON,
        buttonCalcel:true,
        addBilling:false
    }
}
