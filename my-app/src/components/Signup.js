import React from "react";
import {Container,Alert,Label,Button,Input,Card, CardBody,
  CardTitle,
  FormGroup
} from "reactstrap";
import { Link } from "react-router-dom";
import SignupApi from "../services/SignupApi";

class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    adminToken: "",
    id: "",
    color:'',
    content:''
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
      console.log(this.state.email + " " + this.state.password);
      const data = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      };
      new SignupApi().existsUser(this.successCall, this.errorCall, data);
  };

  successCall = json => {
    console.log(json);
    this.callAlertTimer("success","Successful!Please Check your email for Activation Link!!")
    
  };

  errorCall = err => {
    //this.callAlertTimer("danger","User Already exists")
  };

  callAlertTimer = (color,content) => {
    this.setState({
      color:color,
      content:content,

    })
    if(color === 'success'){

      setTimeout(() => {
        this.setState({color:'',content:''})
        //browserHistory.push("/login");
        window.location.reload();
        
      }
        ,2000)
      
    }
    else{
      setTimeout(() => {
        this.setState({color:'',content:''})
        
      }
        ,5000)
    }
  }



  render() {
    var style={
      color:'red'
    }
    return (
      <div>
        <center>
          <Container style={{ paddingTop: 50 }} className="App">
          
            <Card style={{ width: 400, border : 0 }}>
            
              <CardBody>
              <Alert color={this.state.color}>{this.state.content}</Alert>
                <center>
                <center>
                  <CardTitle style={{color:"teal"}}>Create an Account</CardTitle>
                 <br/>
                </center>
                  <form onSubmit={this.handleSubmit} >
                    <FormGroup style={{textAlign:"left"}}>
                  <div><Label for="Name">Name <span style={style}>*</span></Label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      onChange={e => this.handleInput(e)}
                      required
                    /></div>
                    </FormGroup>
                    <br />
                    <FormGroup style={{textAlign:"left"}}>
                    <Label style={{textAlign:"left"}} for="Email">Email <span style={style}>*</span></Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      onChange={e => this.handleInput(e)}
                      required
                    />
                    <br />
                    </FormGroup>
                    <FormGroup style={{textAlign:"left"}}>
                    <Label for="password">Password <span style={style}>*</span></Label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Your password"
                      onChange={e => this.handleInput(e)}
                      required
                    />
                    <br />
                    </FormGroup>
                    <center>
                      <Button color="info">Signup</Button>
                      <CardBody>
                        <span>I already have an Account. </span>
                        <Link to="/login">Login Now </Link>
                      </CardBody>
                    </center>
                  </form>
                </center>
              </CardBody>
            </Card>
          </Container>
        </center>
      </div>
    );
  }
}

export default Signup;
