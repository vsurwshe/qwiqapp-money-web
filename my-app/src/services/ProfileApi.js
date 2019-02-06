import axios from 'axios'
import Config from '../data/Config'
import Store from '../data/Store'


class ProfileApi {

    getProfiles (success, failure) { 
        process(success, failure);
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

export default ProfileApi;


let process = function(success, failure) {
    let promise = HTTP.request()
        .then((resp) => validResponse(resp, success))
        .catch((error) => errorResponse(error, failure));
    console.log('Promise is: ', promise);
}

let validResponse = function(resp, successMethod) {
    console.log('Response: ', resp.data);
    if (successMethod != null) {
        successMethod(resp.data);
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
    baseURL: Config.cloudBaseURL,
    method: 'get',
    url: '/profiles',
    headers: { 
        'accept': 'application/json', 
        'content-type': 'application/json',
        'Authorization': "bearer "+ Store.getAccessToken()}
    });
    
