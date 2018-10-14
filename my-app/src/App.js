import React from 'react'
import { withRouter } from "react-router-dom";
import Header from './components/Header'
import Main from './components/Main'
import Store from './data/Store'
import Login from './components/Login'

class App extends React.Component {

  render() {
    if (!Store.isLoggedIn()) {
      return ( <div><Header/><Main/><Login/> </div> );
    } else {
      return(<div><Header/><Main/></div>);
    }
  }
}

export default App;


const AuthButton = withRouter(
  ({ history }) =>
  Store.isLoggedIn() ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            Store.logout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);

export {AuthButton};
