import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from './LoginApi';

class AttachmentApi {

  createAttachment(success, failure, pid, cid, data) {
    process(success, failure,  pid + "/contacts/" + cid + "/attachments", "POST", data);
  }
  
  getAttachments(success, failure, pid, cid) {
     process(success, failure,  pid +"/contacts/" + cid + "/attachments" ,'GET', pid) 
  }

  getAttachmentsById(success,failure,pid,cid,aid){
    process(success, failure,  pid + "/contacts/" + cid + "/attachments/" +aid, "GET");
  }

  deleteAttachment(success, failure, pid, cid, aId) {
    process(success, failure,  pid + "/contacts/" + cid + "/attachments/" +aId, "DELETE",pid);
  }
}

export default AttachmentApi;

async function process(success, failure, Uurl, Umethod, data) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try{
     data === null? promise = await HTTP.request() : promise = await HTTP.request({data})
     validResponse(promise, success);
  }catch(error){
     AccessTokenError(error, failure, Uurl, Umethod, data, success)
  }
}

let AccessTokenError=(err,failure, Uurl, Umethod, data,success)=>{
  if(err.request.status===0){
    errorResponse(err, failure)
  }else if(err.response.status===401 ||err.response.status===403){
    new LoginApi().refresh(()=>process(success,failure,Uurl,Umethod,data), errorResponse(err, failure))
  }else{
    errorResponse(err, failure)
  }
}
let validResponse = function(resp, successMethod) {
  if (successMethod != null) {
    successMethod(resp.data);
  }
};

let errorResponse = function(error, failure) {
  if (failure != null) {
    failure(error);
  }
};

function httpCall(Uurl, Umethod) {
  let instance = Axios.create({
    baseURL: Config.profileURL,
    method: Umethod,
    url: Uurl,
    headers: {
      "Content-Type" : "form-data",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
