import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from './LoginApi'
class CategoryApi {
  createCategory(success, failure, pid,data) {
    process(success, failure,  pid +"/categories", "POST",pid, data);
  }
  getCategories(success, failure ,pid,value) {
    Store.getCategories() === null || value === 'true'
      ? process(success, failure,  pid +"/categories?subcategories=true" ,'GET', pid) 
      : success(Store.getCategories())
     console.log('local storage is: ',Store.getCategories())
  }

  // getSubCategories(success, failure ,pid,show) {
  //   process(success, failure,  pid + "/categories?subcategories=" + show, "GET");
  // }

  getCategoriesById(success, failure, pid,cid) {
    process(success, failure,  pid + "/categories/" + cid, "GET",pid);
  }

  updateCategory(success, failure, data, pid,cid) {
    process(success, failure,  pid + "/categories/" + cid, "PUT",pid, data);
  }

  deleteCategory(success, failure, pid, cid) {
    process(success, failure,  pid + "/categories/" + cid, "DELETE",pid);
  }
}

export default CategoryApi;

async function process(success, failure, Uurl, Umethod, pid, data) {
  let HTTP = httpCall(Uurl, Umethod);
  let promise;
  try{
     data===null?promise = await HTTP.request():promise = await HTTP.request({data})
     if(Umethod === 'GET'){
        Store.saveCategories(promise.data)
     }else{
        new CategoryApi().getCategories(success,failure,pid,'true')
     }
     validResponse(promise, success);
  }catch(error){
     AccessTokenError(error,failure, Uurl, Umethod, data,success)
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
  console.log("Response Data= ", resp.data);
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
