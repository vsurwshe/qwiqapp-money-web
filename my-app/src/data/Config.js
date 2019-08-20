
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
    customSetting: function(){ 
        let data={
            color:'',
            content:''
        }
        if(process.env.REACT_APP_NODE_ENV=== 'DEMO'){
            data.color='red';
            console.log("HELLO DEMO")
        } else if(process.env.REACT_APP_NODE_ENV=== 'PPE'){
            data.color='green';
            data.content='abc';
            console.log("HELLO PPE")
        } else {
            data.color='blue';
            console.log("HELLO DEVELOPMENT")
        }
        return data;
    }
}

export default Config;