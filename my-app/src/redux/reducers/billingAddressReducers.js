import { billingAddressAction, utilityAction } from "../actions/ActionTypes";


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
        case billingAddressAction.GET:
            return { ...state, billingAddress: action.payload }
        case utilityAction.CLICK_BUTTON:
            return { ...state, addBilling: action.addBilling }
        case utilityAction.CANCEL_BUTTON:
            return { ...state, buttonCancle: action.buttonCancle, addBilling: action.addBilling }
        case utilityAction.SET_SPINNER:
            return { ...state, spinner: action.spinner }
        case utilityAction.MESSAGE_CHANGE:
            return { ...state, color: action.color, message: action.message, showAlert: action.showAlert }
        case billingAddressAction.UPDATE_STATUS:
            return { ...state, updateStatus: action.updateStatus }
        case utilityAction.GET_COUNTRIES:
            return { ...state, countries: action.countries }
        default:
            return state;
    }
}