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
        if (user !== null) {
            return user.oauthToken;
        } else {
            return 'xx';
        }
    },

    getRefreshToken: function() {
        let user = this.getUser();
        if (user !== null) {
          return user.refreshToken;
        } else {
          return "xx";
        }
      },

    isLoggedIn: function() {
        let user = this.getUser();
        let flag = user !== null && user.oauthToken !== null && user.oauthToken.length > 5 && user.user !== "Dummy";
        console.log('isLoggedin: ', flag);
        return flag;
    },

    logout: function(callBack) {
        db.clear();
        setTimeout(callBack, 50);
    },

    saveLoginResponse: function(token, refresh,expiry) {
        let user = {oauthToken: token, refreshToken: refresh,timeExpiry: expiry};
        this.setToken(user)
    },
    
    saveDummyResponse: function(token, refresh) {
        let user = {user:"Dummy",oauthToken: token, refreshToken: refresh};
        this.setToken(user)
    },
    setToken : function(user){
        console.log('User is: ', user);
        db.setItem(USER_KEY, JSON.stringify(user));
        console.log('After setting: ', db.getItem(USER_KEY));
    }
}
export default Store;