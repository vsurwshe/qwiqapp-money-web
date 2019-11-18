import { billingAddressAction} from "../actions/ReduxActionTypes";

const initialState = {
    billingAddress: [],
    updateStatus: false
}

export default function billingReducer(state = initialState, action) {
    switch (action.type) {
        case billingAddressAction.GET:
            return { ...state, billingAddress: action.payload }
        case billingAddressAction.UPDATE_STATUS:
            return { ...state, updateStatus: action.updateStatus }
        default:
            return state;
    }
}