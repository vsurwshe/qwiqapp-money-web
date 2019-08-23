
const Config = {
    // authBaseURL: "http://localhost:8081",
    // cloudBaseURL: "http://localhost:8082",
    // authBaseURL: "https://124apps.com/bills/auth",
    // cloudBaseURL: "https://124apps.com/bills/cloud",
    authBaseURL: "http://demo-api.124apps.com/bills/auth",
    cloudBaseURL: "http://demo-api.124apps.com/bills/cloud",
    clientId: "trusted-app",
    clientSecret: "secret",
    notificationMillis: 400,
    apiTimeoutMillis: 2000,
    customSetting: function () {
        let data = {
            color: '',
            content: ''
        }
        if (process.env.REACT_APP_NODE_ENV === 'development') {
            data.color = 'red';
            console.log("This is development level")
        } else if (process.env.REACT_APP_NODE_ENV === 'production') {
            data.color = 'green';
            data.content = 'abc';
            console.log("This is Production level(PPE)")
        } else {
            data.color = 'blue';
            console.log("This is staging level")
        }
        return data;
    }
}

export default Config;