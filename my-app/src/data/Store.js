

const Store = {
    // data: {
        user: {oauthToken: '', refreshToken: '', email: ''},
        profiles: [],
    // },

    isLoggedIn: function() {
        console.log('in Store.isLoggedIn()...');
        let xx = this.user.oauthToken != null && this.user.oauthToken.length > 5;
        console.log('isLoggedin: ', xx);
        return xx;
    },

    setLogin: function(token, refresh, email) {
        this.user = {oauthToken: token, 
            refreshToken: refresh, 
            email: email};
    }
}

export default Store;