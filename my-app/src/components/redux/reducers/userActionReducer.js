import { USER_ACTION, USER_ACTION_ERROR_RECEIVE} from '../actions/actionTypes';

const initialState = {
    message: '',
    color: '',
    userAction:''
}

export default function userActionReducer(state = initialState, action) {
    switch (action.type) {
        case USER_ACTION:
            return { ...state, userAction: action.payload }
        case USER_ACTION_ERROR_RECEIVE:
            return { ...state, color: action.color, message: action.successMessage }
        default:
            return state;
    }
}