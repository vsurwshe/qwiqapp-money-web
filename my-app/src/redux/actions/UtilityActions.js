import { utilityAction } from "./ActionTypes";

export function buttonAction(action,spinnerValue) {
    return{
        type: utilityAction.CLICK_BUTTON,
        addBilling: action,
        spinner: spinnerValue
    }
}
// This redux actions seting countries in reducers.
export function setCountries(countries) {
    return {
        type: utilityAction.GET_COUNTRIES,
        countries: countries
    }
}
// seting spinner in reducers.
export function setSpinnerValue(value) {
    return {
        type: utilityAction.SET_SPINNER,
        spinner: value
    }
}
// alert messages 
export function handleApiResponseMsg(message,color,value) {
    return {
        type: utilityAction.MESSAGE_CHANGE,
        color,
        message,
        showAlert:value
    }
}
// event handle calcel button
export function cancelButton() {
    return {
        type: utilityAction.CANCEL_BUTTON,
        buttonCalcel:true,
        addBilling:false
    }
}