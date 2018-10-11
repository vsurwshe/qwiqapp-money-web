import axios, {AxiosPromise, AxiosResponse} from 'axios'
import Config from '../data/Config'
import Store from '../data/Store'


class LoginApi {
    login (username, password, success, failure) {        
        let params= { grant_type: 'password',
            username:'vijay@sdf.co.in', password:'sdf12345'
            // username: username, password: password
        };
        process(params, success, failure);
    }

    refresh(success, failure) {
        if (!Store.isLoggedIn) {
            console.log('Please login first..');
            failure();
            return;
        }
        let params= { grant_type: 'refresh_token',
            refresh_token: Store.user.refreshToken
        };
        process(params, success, failure);
    }
}

export default LoginApi;


let process = function(params, success, failure) {
    let promise = HTTP.request({params: params})
        .then((resp) => validResponse(resp, success))
        .catch((error) => errorResponse(error, failure));
    console.log('Promise is: ', promise);
}

let validResponse = function(resp, successMethod) {
    console.log('Response: ', resp);
    console.log('Response: ', resp.data);
    Store.setLogin(resp.data.access_token, resp.data.refresh_token, '');
    if (successMethod != null) {
        successMethod();
    }
};

let errorResponse = function (error, failure) {
    console.log('Error: ', error);
    console.log(error.config);
    if (failure != null) {
        failure();
    }
};

let HTTP = axios.create({
    baseURL: Config.baseURL,
    method: 'post',
    url: '/oauth/token',
    headers: { 'accept': 'application/json', 'content-type': 'application/json'},

    auth: { username: 'trusted-app', password: 'secret'},
    withCredentials: true
});
    
