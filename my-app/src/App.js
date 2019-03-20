import React from "react";
import { withRouter } from "react-router-dom";
import Store from "./data/Store";
import { Button } from "reactstrap";
import Main from "./components/Main";

const App = () => {
  return (
    <div>
      <Main />
    </div>
  );
};

export default App;

const AuthButton = withRouter(({ history }) =>
  Store.isAppUserLoggedIn() ? (
    <div>
      <p>
        <Button
          onClick={() => {
            Store.logoutAppUser(() => history.push("/"));
          }}
        >
          Sign out
        </Button>
      </p>
    </div>
  ) : (
    <div>
      <p>
        <Button
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </Button>
      </p>
    </div>
  )
);

export { AuthButton };
