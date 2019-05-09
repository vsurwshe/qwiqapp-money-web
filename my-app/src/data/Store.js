const USER_KEY = 'user';
const DUMMY_KEY = 'dummy';
const db = sessionStorage;

const Store = {
    storeLabels: function(categoriesJSON) {
        this.storeJson("LABELS", categoriesJSON);
    },
    getLabels: function(){
       return this.getJson("LABELS");
    },
    storeJson: function(keyName, jsonValue) {
        db.setItem(keyName, JSON.stringify(jsonValue));
    },

    getJson: function(keyName) {
        let jsonValue = db.getItem(keyName);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            return null;
        }
    },
    //this the Saved the AppUser Response
    saveAppUserAccessToken: function(token, refresh,expiry) {
        let appUser = {oauthToken: token, refreshToken: refresh,timeExpiry: expiry};
        db.setItem(USER_KEY, JSON.stringify(appUser));
    },
    //this the Saved The DummyUser Response
    saveDummyUserAccessToken: function(token, refresh) {
        let dummyUser = {oauthToken: token, refreshToken: refresh};
        db.setItem(DUMMY_KEY, JSON.stringify(dummyUser));
    },
    //this is geting AppUser User Key
    getAppUser: function() {
        let user = db.getItem(USER_KEY);
        return JSON.parse(user);
    },
    //this is geting Dummy User Key
    getDummyUser: function() {
        let user = db.getItem(DUMMY_KEY);
        return JSON.parse(user);
    },
    //this is the geting the App User Access Token
    getAppUserAccessToken: function() {
        let appUser = this.getAppUser();
        return this.getToken(appUser);
    },
    //this is geting the Dummy User Access Token
    getDummyUserAccessToken: function() {
        let dummyUser = this.getDummyUser();
        return this.getToken(dummyUser);
    },
    //this is geting App User Refresh Token
    getAppUserRefreshToken: function() {
        let appUser = this.getAppUser();
        return this.getRefreshToken(appUser);
    },
    //this is geting Dummy User Refresh Token
    getDummyUserRefreshToken: function() {
      let dummyUser = this.getDummyUser();
      return this.getRefreshToken(dummyUser);
    },
    //geting Access Token
    getToken:function(user){
      if (user !== null) {
            return user.oauthToken;
        } else {
            return null;
        }
    },
    //geting Refress token
    getRefreshToken:function(user){
        if (user !== null) {
            return user.refreshToken;
          } else {
            return null;
          }
    },
    //this is check the App user is Login or not
    isAppUserLoggedIn: function() {
        let appUser = this.getAppUser();
        let flag = appUser !== null && appUser.oauthToken !== null && appUser.oauthToken.length > 5;
        return flag;
    },
    //this is the logout the App User
    logoutAppUser: function(callBack) {
        db.clear();
        setTimeout(callBack, 50);
    },
    //this is the Dummy User Clear
    clearDummyAccessToken: function() {
        db.removeItem(DUMMY_KEY);       
    },

    saveCategories: function(data) {
      db.setItem("CATEGORIES",JSON.stringify(data))
    },

    getCategories: function(){
        const categories = db.getItem("CATEGORIES")
        return JSON.parse(categories)
    },

    //this is save profiles in local storege
    saveUserProfiles: function (data) {
      db.setItem("PROFILES", JSON.stringify(data))
    },
    //this is get profiles form local storege
    getUserProfiles: function () {
      const categories = db.getItem("PROFILES")
      return JSON.parse(categories)
    },

    //this is save profile id in local storege
    saveProfile: function (data) {
        db.setItem("PROFILE", JSON.stringify(data))
    },
    //this is get profile id form local storege
    getProfile: function () {
        return JSON.parse(db.getItem("PROFILE"));
    },

    clearLocalStroge: function(){
        db.removeItem("CATEGORIES");
        db.removeItem("LABELS");
        db.removeItem("PROFILES");
        db.removeItem("PROFILE");
    },
    
   
}
export default Store;

