import React from "react";
import { withRouter } from "react-router-dom";
import Store from "./data/Store";
import Main from "./components/Main";
import { Button } from 'reactstrap';

const App = () => {
  return (
    <div> <Main /> </div>
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