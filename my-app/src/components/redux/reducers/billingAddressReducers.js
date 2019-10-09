import { ADD_UPDATE_BILLING_ADDRESS, BILLING_ADDRESS_RESPONSE, BILLING_ADDRESS_ERROR_RECEIVE, GET_BILLINGADDRESS,GET_RESPONSE, CLICK_BUTTON, CANCEL_BUTTON,STOP_NOTIFICATION} from '../actions/actionTypes';

const initialState = {
    message: '',
    color: '',
    showAlert: false,
    isLoading: false,
    getBillingAddress: [],
    spinner: false,
    addBilling: false,
    buttonCalcel:false
}

export default function billingReducer(state = initialState, action) {

    switch (action.type) {
        case ADD_UPDATE_BILLING_ADDRESS:
            return { ...state, getBillingAddress: action.payload, color: action.color, message: action.successMessage, isLoading: true }
        case GET_BILLINGADDRESS:
            return { ...state, isLoading: true, getBillingAddress: action.payload, color: action.color, message: action.successMessage, spinner: true, showAlert: true }
        case CLICK_BUTTON:
            console.log("m2")
            return { ...state, addBilling: action.addBilling, spinner: action.spinner,buttonCalcel:action.buttonCalcel }
        case CANCEL_BUTTON:
            return {...state, buttonCalcel:action.buttonCalcel,addBilling:action.addBilling}
            // case GET_RESPONSE:
            // return {...state, showAlert:action.showAlert,getBillingAddress:action.payload, isLoading:action.isLoading, successMessage:action.successMessage,color:action.color}
        case STOP_NOTIFICATION:
            return {...state, color:'', message:'', showAlert:action.showAlert}
            case BILLING_ADDRESS_RESPONSE:
                    return { ...state, color: action.color, message: action.successMessage, showAlert: true }
                case BILLING_ADDRESS_ERROR_RECEIVE:
                    return { ...state, isLoading: false, color: action.color, message: action.successMessage, errorMessage: action.errorMessage, showAlert: false }
        default:
            return state;
    }
}