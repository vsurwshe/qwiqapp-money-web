import axios from 'axios';
import { USER_ACTION,USER_ACTION_ERROR_RECEIVE} from './actionTypes';
import Config from '../../../data/Config';
import Store from '../../../data/Store';

const URL = Config.settings().cloudBaseURL + "/user";

function headerConfig() {
    return {
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + Store.getAppUserAccessToken()
        }
    }
}
function responseAddress(params) {
          return {
              type: USER_ACTION,
              payload: params.data,
          }
      }  
function handleErrorResponse(error) {
          return {
              type: USER_ACTION_ERROR_RECEIVE,
              color: "danger",
              successMessage: "Interel server occuring, please try Agai..."
          }
      }
      
export function changeUserAction() {
    return dispatch=>{
            return axios.get(URL, headerConfig())
                .then(address => dispatch(responseAddress(address)))
                .catch(error => dispatch(handleErrorResponse(error)))
}
}