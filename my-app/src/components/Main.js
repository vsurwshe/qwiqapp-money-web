import React from 'react'
import {Route,Redirect, Switch } 
        from 'react-router-dom'
import Dashboard from '../secure/Dashboard'
import Signup from './Signup'
import Home from './Home'
import Login from './Login'
import Store from '../data/Store'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      {/* <PrivateRoute exact path='/' component={Home}/> */}
      {/* <Route path='/' component={App}/> */}
      <PrivateRoute path='/dashboard' component={Dashboard}/>
      <Route path='/login' component={Login}/>
      <Route path='/signup' component={Signup}/>
      <Route path='/' component={Home}/>
    </Switch>
  </main>
)

export default Main;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Store.isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",  // -> /login
            state: { from: props.location }
          }}
        />
      )
    }
  />
);