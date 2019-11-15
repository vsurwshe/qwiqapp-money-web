import { combineReducers } from 'redux';
import utilityReducer from './UtilityReducer';
import billingAddressReducer from './BillingAddressReducer';

export const rootReducer = combineReducers({
   utility: utilityReducer,
   biliing: billingAddressReducer
});