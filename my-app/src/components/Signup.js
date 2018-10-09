import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => (
  <div>
    <h1>Register for free Website!</h1>
    <div>
        Name: <input type='text'/> <br/>
        Password: <input type='text'/> <br/>

        <Link to='/login'> Register Now (login) </Link>
    </div>
  </div>
)

export default Signup
