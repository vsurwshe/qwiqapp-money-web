import { CLICK_BUTTON, CANCEL_BUTTON, GET_BILLING_ADDRESS, SET_SPINNER, MESSAGE_CHANGE, UPDATE_STATUS, GET_COUNTRIES } from '../actions/actionTypes';

const initialState = {
    message: '',
    color: '',
    showAlert: false,
    isLoading: false,
    billingAddress: [],
    spinner: false,
    addBilling: false,
    buttonCancle: false,
    updateStatus: false,
    countries: []
}

export default function billingReducer(state = initialState, action) {
    switch (action.type) {
        case GET_BILLING_ADDRESS:
            return { ...state, billingAddress: action.payload }
        case CLICK_BUTTON:
            return { ...state, addBilling: action.addBilling }
        case CANCEL_BUTTON:
            return { ...state, buttonCancle: action.buttonCancle, addBilling: action.addBilling }
        case SET_SPINNER:
            return { ...state, spinner: action.spinner }
        case MESSAGE_CHANGE:
            return { ...state, color: action.color, message: action.message, showAlert: action.showAlert }
        case UPDATE_STATUS:
            return { ...state, updateStatus: action.updateStatus }
        case GET_COUNTRIES:
            return { ...state, countries: action.countries }
        default:
            return state;
    }
}