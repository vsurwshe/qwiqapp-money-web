
let mData = null;

const Config = {
    notificationMillis: 400,
    apiTimeoutMillis: 2000,
    settings: function () {
        if (mData) {
            return mData;
        } else {
            return initFirst();
        }
    },
    isLive: function() {
        return process.env.REACT_APP_NODE_ENV === 'LIVE';
    },
    environment: function() {
        return process.env.REACT_APP_NODE_ENV;
    }
}

let initFirst= function () {
    let data = {
        bgcolor: 'red',
        content: 'green',
        authBaseURL: "http://localhost:8081",
        cloudBaseURL: "http://localhost:8082",
        clientId: "trusted-app",
        clientSecret: "secret"
    }
    let mode = process.env.REACT_APP_SITE_MODE
    if (process.env.REACT_APP_NODE_ENV === 'DEMO') {
        data.bgcolor = '#dac292';
        data.authBaseURL= "http://demo-api.124apps.com/" +mode+ "/auth";
        data.cloudBaseURL="http://demo-api.124apps.com/" +mode+ "/cloud";
        console.log("This is DEMO level")
    } else if (process.env.REACT_APP_NODE_ENV ==='PPE') {
        data.bgcolor = '#82b74b';
        data.authBaseURL= "http://ppe" +mode+ "-auth.124apps.com/v1";
        data.cloudBaseURL="http://ppe" +mode+ "-cloud.124apps.com/v1";
        console.log("This is PPE")
    } else if (process.env.REACT_APP_NODE_ENV === 'LIVE') {
        data.bgcolor = '#F3F2F1';
        data.authBaseURL= "http://" +mode+ "-auth.124apps.com/v1";
        data.cloudBaseURL="http://" +mode+ "-cloud.124apps.com/v1";
        console.log("This is LIVE")
    } else {
        data.bgcolor = 'blue';
        console.log("This is Developmet",process.env.REACT_APP_NODE_ENV)
    }
    mData = data;
    return data;
}

export default Config;