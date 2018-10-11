import React from 'react'
import Header from './components/Header'
import Main from './components/Main'

class App extends React.Component {
  constructor() {
    super();
    this.setState = {
      user: {oauthToken: '', refreshToken: '', email: ''},
      profiles: []
    }
  }

  render() {
    return(
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

export default App
