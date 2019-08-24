
const Config = {
    // authBaseURL: "http://localhost:8081",
    // cloudBaseURL: "http://localhost:8082",
    // authBaseURL: "https://124apps.com/bills/auth",
    // cloudBaseURL: "https://124apps.com/bills/cloud",
    clientId: "trusted-app",
    clientSecret: "secret",
    notificationMillis: 400,
    apiTimeoutMillis: 2000,
    customSetting: function () {
        let data = {
            color: '',
            content: '',
            authBaseURL:'',
            cloudBaseURL:''
        }
        if (process.env.REACT_APP_NODE_ENV === 'DEMO') {
            data.color = 'red';
            data.authBaseURL= "http://demo-api.124apps.com/bills/auth";
            data.cloudBaseURL="http://demo-api.124apps.com/bills/cloud";
            console.log("This is DEMO level")
        } else if (process.env.REACT_APP_NODE_ENV ==='PPE') {
            data.color = 'green';
            data.authBaseURL= "https://124apps.com/bills/auth";
            data.cloudBaseURL="https://124apps.com/bills/cloud";
            console.log("This is PPE")
        } else if (process.env.REACT_APP_NODE_ENV === 'LIVE') {
            data.color = 'green';
            data.content = 'abc';
            console.log("This is LIVE")
        } else {
            data.color = 'blue';
            console.log("This is Developmet",process.env.REACT_APP_NODE_ENV)
        }
        return data;
    }
}

export default Config;