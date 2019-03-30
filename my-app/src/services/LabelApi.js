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
  //This Method Get All labels
  getlabelsById(success, failure,pid,lid) {
    process(success, failure, pid+"/labels/"+lid, "GET");
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
  let HTTP = httpCall(Uurl, Umethod);
  if (Umethod === "PUT" || Umethod === "POST") {
      HTTP.request({ data })
      .then(resp => validResponse(resp, success))
      .catch(err => {AccessTokenError(err,failure,Uurl, Umethod, data,success)});
  } else {
    HTTP.request()
      .then(resp => validResponse(resp, success))
      .catch(err => {AccessTokenError(err,failure,Uurl, Umethod, data,success)});
  }
}

//this method slove the Exprie Token Problem.
let AccessTokenError =function(err,failure,Uurl, Umethod, data,success){
  if(err.request.status=== 0)
  {errorResponse(err, failure)
  }else if (err.response.status===403 || err.response.status===401)
  {new LoginApi().refresh(()=>{process(success,failure,Uurl,Umethod,data)},(err)=>{console.log(err)})
  }else{errorResponse(err, failure)}
}

let validResponse = function(resp, successMethod) {
  // console.log("Response: ", resp.data);
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

function httpCall(Uurl, Umethod) {
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
