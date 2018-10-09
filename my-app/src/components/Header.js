import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home Landing page</Link></li>
        <li><Link to='/login'>Login Page</Link></li>
        <li><Link to='/signup'>Signup Page</Link></li>
      </ul>
    </nav>
  </header>
)

export default Header
