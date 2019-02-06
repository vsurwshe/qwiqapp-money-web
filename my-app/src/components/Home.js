import React, {Component} from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Hello, welcome to App!</h1>
        <br/>

        <Link to='/login'> Register Now (login) </Link>
      </div>
    );
  }
}

export default Home
