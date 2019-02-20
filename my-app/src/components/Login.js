import React, { Component } from "react";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Container,Button,Input,Card,CardBody,CardTitle,Alert} from "reactstrap";
import LoginApi from "../services/LoginApi";
import Store from "../data/Store";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
       name: "", 
       password: "",
       color :'',
       content :'' 
      };
  }

  handleEvent = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleButton = () => {
    // console.log(this.state.name, ", your password id: ", this.state.password);
   
      new LoginApi().login(
        this.state.name,
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
      name:'',
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

  render() {
    if (Store.isLoggedIn()) {
      return (
        <div>
          <Container style={{ padding: 20 }} className="App">
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
                  <form onSubmit={this.handleButton}>
                  <Input
                    type="text"
                    name="name"
                    onChange={this.handleEvent}
                    placeholder="Your Email"
                    value={this.state.name}
                    required
                  />
                  <br />
                  <Input
                    type="password"
                    cols="3"
                    name="password"
                    onChange={this.handleEvent}
                    placeholder="Your Password"
                    value={this.state.password}
                    required
                  />
                  <br />
                  <Button color="info"  onClick={this.handleButton}>Login</Button>
                  </form>
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
