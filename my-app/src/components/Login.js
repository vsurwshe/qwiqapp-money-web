import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Card } from 'reactstrap';
import LoginApi from '../services/AuthApi'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {name: '', password: ''};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  
  handlePwdChange(event) {
    this.setState({password: event.target.value});
  }
  handleButton() {
    console.log(this.state.name, ', your password id: ',this.state.password);
    new LoginApi().login(this.state.name, this.state.password, 
      function() { alert('Success'); },
      function() { alert('Failure'); });
  }

  render() {
    // Note: onChange is required when value is present.} 
    return(
      <div className="col-9 .flex-md-row">
        <h1>Login to Tornadoes</h1>
        <div className="col-10" >
            <Input type='text' value={this.state.name}
                onChange={this.handleNameChange} placeholder='Your registered email'/>
            <Input type='password' value={this.state.password} cols='3'
                onChange={this.handlePwdChange} placeholder='Your super secret password'/>
            <Button color="success" onClick={this.handleButton} >
              Login
            </Button> <br/><br/>
        </div>
        <Card className="col-10">
          <span className="h5">Don't have an Account yet?</span>
          <Link to='/signup'>Signup now</Link>
        </Card>
            
      </div>
    );
  }
}

export default Login
