const USER_KEY = 'user';
const db = sessionStorage;

const Store = {
    getUser: function() {
        let user = db.getItem(USER_KEY);
        return JSON.parse(user);
    },

    getAuthToken: function() {
        let user = this.getUser();
        if (user != null) {
            console.info('getAuthToken().. ', user.oauthToken);
            return user.oauthToken;
        } else {
            console.info('getAuthToken().. NULL');
            return 'xx';
        }
    },

    isLoggedIn: function() {
        let user = this.getUser();
        let xx = user != null && user.oauthToken != null && user.oauthToken.length > 5;
        console.log('isLoggedin: ', xx);
        return xx;
    },

    logout: function(callBack) {
        sessionStorage.clear();
        setTimeout(callBack, 50);
    },

    setLogin: function(token, refresh, email) {
        let user = {oauthToken: token, 
            refreshToken: refresh, 
            email: email};
        console.log('User is: ', user);
        db.setItem(USER_KEY, JSON.stringify(user));
        console.log('After setting: ', db.getItem(USER_KEY));
    }
}

export default Store;