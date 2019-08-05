import React from "react";
import { withRouter } from "react-router-dom";
import Store from "./data/Store";
import Main from "./components/Main";
import { Button } from 'reactstrap';
import {BASE_URL} from './environmnet';

const App = () => {
  return (
    <>   
    <p>{BASE_URL}</p>
    <Main /> 
     </>
  );
};

export default App;

const AuthButton = withRouter(({ history }) =>
  Store.isAppUserLoggedIn() ? (
    <span > <Button onClick={() => { Store.logoutAppUser(() => history.push("/")); }} color="danger">Sign out</Button>  </span>
  ) : (
      <span onClick={() => { history.push("/login"); }}>Login</span>
    )
);

export { AuthButton };