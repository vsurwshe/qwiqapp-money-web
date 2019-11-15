import { utilityAction } from "../actions/ReduxActionTypes";

const initialState={
    alertMessage: '',
    alertColor: '',
    showAlert: false,
    isLoading: false,
    buttonCancle: false,
    countries: [],
    profileId: ''
}
export default function utilityReducer(state= initialState, action){
    switch(action.type){
        case utilityAction.GET_COUNTRIES:
            return { ...state, countries: action.countries }
        case utilityAction.PROFILE_ID:
            return {...state, profileId: action.profileId};
        case utilityAction.CLICK_BUTTON:
            return { ...state, addBilling: action.addBilling }
        case utilityAction.CANCEL_BUTTON:
            return { ...state, buttonCancle: action.buttonCancle, addBilling: action.addBilling }
        case utilityAction.SET_SPINNER:
            return { ...state, spinner: action.spinner }
        case utilityAction.MESSAGE_CHANGE:
                return { ...state, alertColor: action.color, alertMessage: action.message, showAlert: action.showAlert }
        default:
            return state;
        
    }
}
