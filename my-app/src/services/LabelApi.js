import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
class LabelApi {
   //This Method Create label 
  createLabel(success, failure, pid,data) {
    console.log(pid);
    process(success, failure, pid+"/labels", "POST", data);
  }
  //This Method Get All labels
  getlabels(success, failure,pid) {
    process(success, failure, pid+"/labels", "GET");
  }
  //This Method Get All Sub-labels
  getSublabels(success, failure,pid,value) {
    process(success, failure, pid+"/labels?sublabels="+value+"", "GET");
  }
  
  //This Method Update labels 
  updateLabel(success, failure, data, pid,lid) {
    process(success, failure,pid+"/labels/"+lid, "PUT", data);
  }
  //This Method Delete the lables
  deleteLabel(success, failure, pid,lid) {
    process(success, failure, pid+"/labels/"+lid, "DELETE");
  }
}

export default LabelApi;
//this is 
function process(success, failure, Uurl, Umethod, data) {
  let instance = createInstance(Uurl, Umethod);
  if (Umethod === "PUT" || Umethod === "POST") {
    console.log(data)
     instance.request({ data })
      .then(resp => validResponse(resp, success))
      .catch(err => {
        console.log(err.response.status);
        if (err.response.status===403)
         { 
           //When App User Token Access The new Resource That Time 403 Error Comeing So We sloved By Using Refresh Token....
           console.log("Token Error Comeing");
           //here i calling Refresh Method Which Get New Access Token And Set New App User Access Token
           //Then we are Calling Again This Method For Creating label.
           new LoginApi().refresh(()=>{ process(success,failure,Uurl,Umethod,data);},(err)=>{console.log(err)})
           
          
         }
      });
  } else {
    instance.request()
      .then(resp => validResponse(resp, success))
      .catch(err => errorResponse(err, failure));
  }
}

let validResponse = function(resp, successMethod) {
  console.log("Response: ", resp.data);
  if (successMethod != null) {
    successMethod(resp.data);
  }
};

let errorResponse = function(error, failure) {
  console.log("Error: ", error);
  if (failure != null) {
    failure(error);
  }
};

function createInstance(Uurl, Umethod) {
  let instance = Axios.create({
    baseURL: Config.labelBaseURL,
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
