import Axios from "axios";
import Config from "../data/Config";
import Store from "../data/Store";
import LoginApi from './LoginApi'
class CategoryApi {
  createCategory(success, failure, pid,data) {
    process(success, failure, "/profile/" + pid + "/categories", "POST", data);
  }
  getCategories(success, failure ,pid) {
    process(success, failure, "/profile/" + pid + "/categories" , "GET");
  }

  getSubCategories(success, failure ,pid,show) {
    process(success, failure, "/profile/" + pid + "/categories?subcategories=" + show, "GET");
  }

  getCategoriesById(success, failure, pid,cid) {
    process(success, failure, "/profile/" + pid + "/categories/" + cid, "GET");
  }

  updateCategory(success, failure, data, uid,cid) {
    process(success, failure, "/profile/" + uid + "/categories/" + cid, "PUT", data);
  }

  deleteCategory(success, failure, pid, cid) {
    process(success, failure, "/profile/" + pid + "/categories/" + cid, "DELETE");
  }
}

export default CategoryApi;

function process(success, failure, Uurl, Umethod, data) {
  if (Umethod === "PUT" || Umethod === "POST") {
    let insta = createInstance(Uurl, Umethod);
    insta
      .request({ data })
      .then(resp => validResponse(resp, success))
      .catch(error => {
       console.log("Token error=", error.response.status);
        if (error.response.status === 403 || error.response.status === 401){
          console.log("Error with Token")
          new LoginApi().refresh(()=>process(success,failure,Uurl,Umethod,data),()=>console.log("Error calling refresh Token"))
        }
      });
  } else {
    let insta = createInstance(Uurl, Umethod);
    insta
      .request()
      .then(resp => validResponse(resp, success))
      .catch(err => {
        if (err.response.status === 401 || err.response.status === 403){
          console.log("Error with Token", err.response.status)
          new LoginApi().refresh(()=>process(success,failure,Uurl,Umethod,data),()=>console.log("Error calling refresh Token"))
        }
        errorResponse(err, failure)
      });
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
