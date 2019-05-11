import React from "react";
import { withRouter } from "react-router-dom";
import Store from "./data/Store";
import Main from "./components/Main";
import { FaPowerOff } from "react-icons/fa";

const App = () => {
  return (
    <div><Main /></div>
  );
};

export default App;

const style={ paddingTop:'10px', marginRight:10, marginBottom: 10, color:"#ff3333" }
const AuthButton = withRouter(({ history }) =>
  Store.isAppUserLoggedIn() ? (
      <FaPowerOff style={style} data-toggle="tooltip" data-placement="bottom" title="Signout" id="toolTip" size={25} onClick={() => {Store.logoutAppUser(() => history.push("/"));}} />
      ): (
            <span onClick={() => { history.push("/login");}}>Login</span>
      )
);

export { AuthButton };