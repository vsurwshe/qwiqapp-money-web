const USER_KEY = 'user';
const DUMMY_KEY = 'dummy';
const db = sessionStorage;

const Store = {
    
    //this Saves the AppUser Response
    saveAppUserAccessToken: function (token, refresh, expiry) {
        let appUser = { oauthToken: token, refreshToken: refresh, timeExpiry: expiry };
        db.setItem(USER_KEY, JSON.stringify(appUser));
        this.setSelectedValue(false)
    },
    getAppUserAccessToken: function () {
        let appUser = this.getAppUser();
        return this.getToken(appUser);
    },

    //this Saves The DummyUser Response
    saveDummyUserAccessToken: function (token, refresh) {
        let dummyUser = { oauthToken: token, refreshToken: refresh };
        db.setItem(DUMMY_KEY, JSON.stringify(dummyUser));
        this.setSelectedValue(false)
    },
    getDummyUserAccessToken: function () {
        let dummyUser = this.getDummyUser();
        return this.getToken(dummyUser);
    },
    //this is getting AppUser User Key
    getAppUser: function () {
        let user = db.getItem(USER_KEY);
        return JSON.parse(user);
    },
    //this is getting Dummy User Key
    getDummyUser: function () {
        let user = db.getItem(DUMMY_KEY);
        return JSON.parse(user);
    },

    //this is geting App User Refresh Token
    getAppUserRefreshToken: function () {
        let appUser = this.getAppUser();
        return this.getRefreshToken(appUser);
    },

    //this is getting Dummy User Refresh Token
    getDummyUserRefreshToken: function () {
        let dummyUser = this.getDummyUser();
        return this.getRefreshToken(dummyUser);
    },

    //getting Access Token
    getToken: function (user) {
        if (user !== null) {
            return user.oauthToken;
        } else {
            return null;
        }
    },

    //geting Refress token
    getRefreshToken: function (user) {
        if (user !== null) {
            return user.refreshToken;
        } else {
            return null;
        }
    },

    //this checks the App user is Loggedin or not
    isAppUserLoggedIn: function () {
        let appUser = this.getAppUser();
        let flag = appUser !== null && appUser.oauthToken !== null && appUser.oauthToken.length > 5;
        return flag;
    },

    //this logout the App User
    logoutAppUser: function (callBack) {
        db.clear();
        setTimeout(callBack, 50);
    },

    //Clears Dummy User Access Token 
    clearDummyAccessToken: function () {
        db.removeItem(DUMMY_KEY);
    },
    //Store User Details
    saveUser: function (data) {
        db.setItem("USERDATA", JSON.stringify(data))
    },
    //Gets User Details
    getUser: function () {
        const categories = db.getItem("USERDATA")
        return JSON.parse(categories)
    },
    // Setting Api for payapal payment transaction
    saveSetting: function (jsonValue) {
        db.setItem("SETTINGS", JSON.stringify(jsonValue));
    },

    getSetting: function (keyName) {
        let jsonValue = db.getItem(keyName);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            return null;
        }
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
    //this saves selected profile in local storage
    saveProfile: function (data) {
        db.setItem("PROFILE", JSON.stringify(data))
    },
    //gets selected profile from local storage
    getProfile: function () {
        return JSON.parse(db.getItem("PROFILE"));
    },
    setSelectedValue: function (data) {
        db.setItem("SELECTEDPROFILE", data)
    },
    getSelectedValue: function () {
        const selected = db.getItem("SELECTEDPROFILE")
        return selected
    },
    //lables
    storeLabels: function (categoriesJSON) {
        this.storeJson("LABELS", categoriesJSON);
    },

    getLabels: function () {
        return this.getJson("LABELS");
    },

    //this is save categories in local storege
    saveCategories: function (data) {
        db.setItem("CATEGORIES", JSON.stringify(data))
    },
    //this is get categories form local storege
    getCategories: function () {
        const categories = db.getItem("CATEGORIES")
        return JSON.parse(categories)
    },

    //this is save bills in local storege
    saveBills: function (data) {
        db.setItem("BILL", JSON.stringify(data))
    },
    //this is get bills form local storege
    getBills: function () {
        const categories = db.getItem("BILL")
        return JSON.parse(categories)
    },

    saveContacts: function (data) {
        db.setItem("CONTACTS", JSON.stringify(data))
    },
    getContacts: function () {
        const categories = db.getItem("CONTACTS")
        return JSON.parse(categories)
    },

    // Clears the Local Storage
    clearLocalStorage: function () {
        this.userDataClear()
        db.removeItem("PROFILES");
        db.removeItem("PROFILE");
        db.removeItem("SELECTEDPROFILE");
        db.removeItem("USERDATA");
    },

    // when refersh button call(userDataClear)
    userDataClear: function () {
        db.removeItem("CATEGORIES");
        db.removeItem("LABELS");
        db.removeItem("CONTACTS");
        db.removeItem("BILL");
    }
}
export default Store;

