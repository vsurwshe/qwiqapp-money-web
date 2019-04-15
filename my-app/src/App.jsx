import React from "react";
import { withRouter } from "react-router-dom";
import Store from "./data/Store";
import Main from "./components/Main";

const App = () => {
  return (
    <div><Main /></div>
  );
};

export default App;

const AuthButton = withRouter(({ history }) =>
  Store.isAppUserLoggedIn() ? (<span onClick={() => {Store.logoutAppUser(() => history.push("/"));}}>Sign out</span>) 
  : (<span onClick={() => { history.push("/login");}}>Login</span>)
);

export { AuthButton };
