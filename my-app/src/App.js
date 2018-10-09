import React, { Component } from 'react';
// import { BrowserRouter as Router } from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './auth/Login'
import Home from './auth/Home'
// import logo from './css/logo.svg';
import './xssets/css/App.css';

class App extends Component {
  render() {
    return (
      <Router>
      <Switch>
          <Route path='/' component={Login} />
          <Route path='/home' component={Home} />
      </Switch>
      </Router>
    );
  }
}

export default App;
