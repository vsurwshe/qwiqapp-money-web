import React, { Component } from "react";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Container,Button,Input,Card,CardBody,CardTitle,FormFeedback,Alert,FormGroup} from "reactstrap";
import LoginApi from "../services/LoginApi";
import Store from "../data/Store";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
       email: "", 
       password: "",
       color :'',
       content :'' ,
       validate :{
         emailState:'',
         passwordState:''
       }
      };
  }

  handleEvent = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleButton = event => {
      new LoginApi().login(
        this.state.email,
        this.state.password,
        () => {
          browserHistory.push("/dashboard");
          window.location.reload();
        },
        () => {
          this.callAlertTimer('danger','Incorrect Username/Password')
        }
      );
  };

  resetData(){
    this.setState({
      email:'',
      password:''
    })
  }

  callAlertTimer(color,content){
    this.setState({
      color:color,
      content: content,
    })
    this.resetData()
    setTimeout(()=>
      this.setState({color:'',content:''}),5000
    )
  }

  validateEmail= e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
      if (emailRex.test(e.target.value)) 
        validate.emailState = 'success'
      else 
        validate.emailState = 'danger'
      this.setState({ validate })
  }

  validatePassword = e =>{
    const { validate } = this.state
    if(e.target.value.length >= 4)
        validate.passwordState = 'success'
    else 
        validate.passwordState = 'danger'
    this.setState({ validate })
  }

  render() {
    if (Store.isLoggedIn()) {
      return (
        <div>
          <Container style={{ padding: 20 }} classmail="App">
            <h3>
              Already loggedin. Go to
              <Link to="/dashboard"> Dashboard </Link>
            </h3>
            <br />
          </Container>
        </div>
      );
    } else {
      return (
        <div style={{color:'teal'}}>
          <center>
            <Container style={{ paddingTop : 50 }} className="App">
             <Alert color={this.state.color}>{this.state.content}</Alert>
              <Card style={{ width: 300,borderRadius : 8 }}>
                <CardBody>
                  <CardTitle>Welcome Back!</CardTitle><br/>
                  <FormGroup>
                  <Input
                    type="text"
                    name="email"
                    onChange={
                      (e) => {
                        this.validateEmail(e)
                        this.handleEvent(e)
                      }}
                    placeholder="Your Email"
                    value={this.state.email}
                    required
                    valid={ this.state.validate.emailState === 'success' }
                    invalid={ this.state.validate.emailState === 'danger'}
                  />
                  <FormFeedback invalid>
                         Uh oh! Incorrect email.
                  </FormFeedback>  
                  </FormGroup>
                  <FormGroup>
                  <Input
                    type="password"
                    cols="3"
                    name="password"
                    onChange={
                      (e) => {
                        this.validatePassword(e)
                        this.handleEvent(e)
                      }}
                    placeholder="Your Password"
                    value={this.state.password}
                    required
                    valid={ this.state.validate.passwordState === 'success' }
                    invalid={ this.state.validate.passwordState === 'danger' }
                  />
                  <FormFeedback invalid tooltip>
                      Password length must be minimum 6 characters
                  </FormFeedback> 
                  </FormGroup>
                  <Button color="info" onClick={this.handleButton}>Login</Button>  
                </CardBody>
                <CardBody>
                  <span>Don't have an Account yet? </span>&nbsp;
                  <br />
                  <Link to="/signup">Signup Now</Link>
                </CardBody> 
              </Card>
            </Container>
          </center>
        </div>
      );
    }
  }
}

const browserHistory = createBrowserHistory();

export default Login;
