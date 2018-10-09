import React, { Component } from 'react';

class Home extends Component {
  state = {
    redirect: false
  };

  componentDidMount() {
    this.setState({
      redirect: false
    });
  }

  render() {
    return (
      <div className="Login">
        <h1>Home Page</h1>
      </div>
    );
  }
}

export default Home;
