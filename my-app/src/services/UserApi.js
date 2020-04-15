import Config from "../data/Config";
import Store from "../data/Store";
import AbstractApi from "./AbstractApi";

class UserApi extends AbstractApi {

    loginApi = null;
    constructor() {
        super()
        if (!this.loginApi) {
            this.loginApi = this.loginInstance();
        }
    }

    getUser(success, failure) {
        this.process(success, failure, "/user", this.requestType.GET)
    }

    updateUser(success, failure, data) {
        this.process(success, failure, "/user", this.requestType.PUT, data)
    }

    changePassword(success, failure, data) {
        this.process(success, failure, "/user/passwd?new=" + data.new + "&old=" + data.old, this.requestType.PUT)
    }

    async process(success, failure, requestUrl, requestMethod, data, reload) {
        const baseURL = Config.settings().cloudBaseURL;
        let http = this.httpCall(requestUrl, requestMethod, baseURL);
        let promise;
        if (http) {
            try {
                data === null ? promise = await http.request() : promise = await http.request({ data });
                Store.saveUser(promise.data)
                this.validResponse(promise, success)
            } catch (err) {
                this.handleAccessTokenError(err, failure, requestUrl, requestMethod, data, success, reload);
            }
        }
    }

    //this method solve the Expire Token Problem.
    handleAccessTokenError(error, failure, requestUrl, requestMethod, data, success, reload) {
        const request = error && error.request ? error.request : '';
        const response = error && error.response ? error.response : '';
        if (request && request.status === 0) {
            this.errorResponse(error, failure)
        } else if (response && (response.status === 403 || response.status === 401)) {
            if (response.data && response.data.error && response.data.error.debugMessage) {
                this.errorResponse(error, failure)
            } else {
                if (!reload) {
                    this.loginApi.refresh(() => { this.process(success, failure, requestUrl, requestMethod, data, true) }, this.errorResponse(error, failure))
                } else {
                    this.errorResponse(error, failure)
                }
            }
        } else { this.errorResponse(error, failure) }
    }
}
export default UserApi;