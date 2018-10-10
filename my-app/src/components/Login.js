import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Card } from 'reactstrap';

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
    alert(this.state.name+ ', your password id: '+this.state.password);
  }

  render() {
    // Note: onChange is required when value is present.} 
    return(
      <div>
        <h1>Login to the Tornadoes Website!</h1>
        <Card >
            <Input type='text' value={this.state.name}
                onChange={this.handleNameChange}/>
            <Input type='password' value={this.state.password} cols='3'
                onChange={this.handlePwdChange}/>
            <Button color="success" onClick={this.handleButton} >
              Sample button
            </Button> <br/><br/>
        </Card>
            <Link to='/'> Login (home)</Link>
      </div>
    );
  }
}

export default Login
