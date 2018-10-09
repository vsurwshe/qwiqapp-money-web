import React, { Component } from 'react';
// import { browserHistory } from 'react-router'
import {Redirect} from 'react-router-dom';
// import logo from '../xssets/images/logo.svg';
import '../xssets/css/App.css';

class Login extends Component {
  state = {
    redirect: false
  };
  // constructor() {
  //   super();
  //   this.setState({
  //     redirect : false
  //   });
  //   // this.state = {
  //   //   redirect: false
  //   // };
  // }
  handleClick() {
    console.info("before...", this.state.redirect);
    this.setState(state => ({
      redirect : true,
      redirectPage : '/home'
    }));
    console.info('after..', this.state.redirect);
  }

  render() {
    if (this.state.redirect === true) {
      // this.setState(state => ({
      //   redirect : false,
      //   redirectPage : null
      // }));
      return (<Redirect to='/home'/>);
    }
    return (
      <div className="Login">
        <h1>Bill Reminder</h1>
        <input type='text'/>
        <input type='text'/>
        <button onClick={this.handleClick.bind(this)}>          
          Login button
        </button>
      </div>
    );
  }
}

export default Login;
