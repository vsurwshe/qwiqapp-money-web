const USER_KEY = 'user';
const db = sessionStorage;

const Store = {
    getUser: function() {
        let user = db.getItem(USER_KEY);
        // console.log("parsing User: "+ user);
        return JSON.parse(user);
    },

    getAccessToken: function() {
        let user = this.getUser();
        if (user != null) {
            return user.oauthToken;
        } else {
            return 'xx';
        }
    },

    isLoggedIn: function() {
        let user = this.getUser();
        let flag = user != null && user.oauthToken != null && user.oauthToken.length > 5;
        // console.log('isLoggedin: ', flag);
        return flag;
    },

    logout: function(callBack) {
        db.clear();
        setTimeout(callBack, 50);
    },

    saveLoginResponse: function(token, refresh) {
        let user = {oauthToken: token, 
            refreshToken: refresh};
        console.log('User is: ', user);
        db.setItem(USER_KEY, JSON.stringify(user));
        console.log('After setting: ', db.getItem(USER_KEY));
    }
}

export default Store;