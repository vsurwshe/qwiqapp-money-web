import { combineReducers } from 'redux'
import billingAddressReducers from './billingAddressReducers';
import userActionReducer from './userActionReducer';

export default combineReducers({
  billingAddressReducers,
  userActionReducer
})