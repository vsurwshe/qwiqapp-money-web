import Axios from "axios";
import Store from "../data/Store";
import LoginApi from "./LoginApi";
class ContactApi {
 
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
  }
}

export default ContactApi;

async function process(success, failure, Uurl, Umethod, profileId, data) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
    try {
      data === null ? promise = await HTTP.request() : promise = await HTTP.request({ data });
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
      AccessTokenError(profileId,err, failure, Uurl, Umethod, data, success);
    }
}

//this method slove the Exprie Token Problem.
let AccessTokenError = function(profileId, err, failure, Uurl, Umethod, data, success){
  if(err.request.status=== 0){
     new ContactApi().getSublabels(success, failure, profileId, "True");
  } else if (err.response.status===403 || err.response.status===401){
    new LoginApi().refresh(()=>{process(success,failure,Uurl,Umethod,data)},errorResponse(err, failure))
  } else {errorResponse(err, failure)}
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
  let baseURL=Store.getProfile();
  let instance = Axios.create({
    baseURL: baseURL[0].url +"/profile",
    method: Umethod,
    url: Uurl,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Store.getAppUserAccessToken()
    }
  });
  return instance;
}
