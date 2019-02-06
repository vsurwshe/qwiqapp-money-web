import React, {Component} from 'react'
import Profiles from './Profiles'

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Manage Profiles.!</h1>
        <Profiles/>
      </div>
    );
  }
}

export default Dashboard
