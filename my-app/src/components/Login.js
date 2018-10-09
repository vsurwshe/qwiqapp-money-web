import React from 'react'
import { Link } from 'react-router-dom'


const Login = () => (
  <div>
    <h1>Login to the Tornadoes Website!</h1>
    <div>
        <input type='text'/>
        <input type='text'/>
        <Link to='/'> Login (home)</Link>
    </div>
  </div>
)

export default Login
