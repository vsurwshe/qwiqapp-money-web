import { billingAddressAction } from "./ReduxActionTypes";

// getting BillingAddress from reducers.
export function getBillingAddress(billingData) {
    return {
        type: billingAddressAction.GET,
        payload: billingData
    }
}

// updating every time bill address/ get billing address.
export function updateStatus(value){
    return {
        type: billingAddressAction.UPDATE_STATUS,
        updateStatus: value
    }
}


