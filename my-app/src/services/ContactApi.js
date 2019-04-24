import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
class ContactApi {
 
<<<<<<< HEAD
  createContact(success, failure, profileId, data) {
    process(success, failure, profileId + "/contacts", "POST", profileId, data);
  }
 
  getContacts(success, failure, profileId, value) {
    Store.getContacts()===null||value==="true" ? process(success, failure, profileId + "/contacts", "GET"): success(Store.getContacts());
  }
 
  getContactById(success, failure, profileId, contactId) {
    const store = true;
    process(success, failure, profileId + "/contacts/" + contactId, "GET", profileId, store);
  }
 
  updateContact(success, failure, data, profileId, contactId) {
    process(success, failure, profileId + "/contacts/" + contactId, "PUT", profileId, data);
  }
 
  deleteContact(success, failure, profileId,contactId) {
    process(success, failure, profileId + "/contacts/" + contactId, "DELETE", profileId);
=======
  createContact(success, failure, pid,data) {
    process(success, failure, pid+"/contacts", "POST",pid, data);
  }
 
  getContacts(success, failure,pid,value) {
    Store.getContacts()===null||value==="true" ? process(success, failure, pid+"/contacts", "GET"): success(Store.getContacts());
  }
 
  getContactById(success, failure,pid,lid) {
    process(success, failure, pid+"/contacts/"+lid, "GET");
  }
 
  updateContact(success, failure, data, pid,cid) {
    process(success, failure,pid+"/contacts/"+cid, "PUT",pid, data);
  }
 
  deleteContact(success, failure, pid,lid) {
    process(success, failure, pid+"/contacts/"+lid, "DELETE",pid);
>>>>>>> 0.4: Basic CRUD Operations Implemented
  }
}

export default ContactApi;

<<<<<<< HEAD
async function process(success, failure, Uurl, Umethod, profileId, data) {
  console.log("Data = ", data)
=======
async function process(success, failure, Uurl, Umethod,profileId, data) {
>>>>>>> 0.4: Basic CRUD Operations Implemented
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
    try {
      data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
<<<<<<< HEAD
      if (Umethod === "GET" && data === undefined) {
        Store.saveContacts(promise.data);
        validResponse(promise, success)
      } else if(Umethod === "GET" && data === true){
        validResponse(promise,success)
      } else{
        new ContactApi().getContacts(success,failure,profileId,"true");
        validResponse(promise, success)
      }
    } catch (err) {   
=======
      if (Umethod === "GET") {
        Store.saveContacts(promise.data);
        validResponse(promise, success)
      } else {
        new ContactApi().getContacts(success,failure,profileId,"true");
        validResponse(promise, success)
      }
    } catch (err) {
      console.log(err.request.status)      
>>>>>>> 0.4: Basic CRUD Operations Implemented
      console.table(err);
      AccessTokenError(profileId,err, failure, Uurl, Umethod, data, success);
    }
}

//this method slove the Exprie Token Problem.
<<<<<<< HEAD
let AccessTokenError = function(profileId, err, failure, Uurl, Umethod, data, success){
  if(err.request.status=== 0){
     new ContactApi().getSublabels(success, failure, profileId, "True");
  } else if (err.response.status===403 || err.response.status===401){
    new LoginApi().refresh(()=>{process(success,failure,Uurl,Umethod,data)},errorResponse(err, failure))
  } else {errorResponse(err, failure)}
=======
let AccessTokenError =function(profileId,err,failure,Uurl, Umethod, data,success){
  if(err.request.status=== 0)
  { new ContactApi().getSublabels(success,failure,profileId,"True");
  }else if (err.response.status===403 || err.response.status===401)
  {new LoginApi().refresh(()=>{process(success,failure,Uurl,Umethod,data)},errorResponse(err, failure))
  }else{errorResponse(err, failure)}
>>>>>>> 0.4: Basic CRUD Operations Implemented
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
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
