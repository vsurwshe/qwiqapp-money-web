import React from "react";
import {
  Container,
  Alert,
  Label,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  FormFeedback
} from "reactstrap";
import { Link } from "react-router-dom";
import SignupApi from "../services/SignupApi";
class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    adminToken: "",
    flag: true,
    color: '',
    content: '',
    emailAlert: '',
    validate: {
      emailState: "",
      passwordState: ""
    }
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleEnter = (event) =>{
    if (event.key === 'Enter' ) { this.handleSubmit(); }
  }

  handleSubmit = () => {
    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    if (this.state.name === "") {
      this.callAlertTimer("danger", "Name should not be empty")
      this.setState({ password: "" });
    } else if (this.state.password.length > 5) {
       new SignupApi().registerUser(this.successCall, this.errorCall, data);
    }
  };

  successCall = json => {
    this.callAlertTimer("success", "Succesfull! Please Check your Email for Activation Link")
  };

  errorCall = err => {
    this.callAlertTimer("danger", "Internal Error");
  };

  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
    if (
      color === "success" &&
      content === "Succesfull! Please Check your Email for Activation Link"
    ) {
      setTimeout(() => {
        this.setState({ color: '', content: '', flag: false })
      }, 2000)
    }
    else {
      setTimeout(() => {
        this.setState({ color: '', content: '', email: '' })
      }, 4000)
    }
  };

  validateEmail = e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    let email = e.target.value;
    let data = {
      email: e.target.value
    };
    if (emailRex.test(email)) {
      validate.emailState = 'success'
      new SignupApi().existsUser(() => { validate.emailState = 'danger'; this.setState({ email: "",emailAlert: true }); }, () => { validate.emailState = 'danger' }, data)
    }
    else {
      this.setState({ emailAlert: false })
      validate.emailState = 'danger'
    }
    this.setState({ validate });
  };

  validatePassword = e => {
    const { validate } = this.state
    if (e.target.value.length > 5)
      validate.passwordState = 'success'
    else
      validate.passwordState = 'danger'
    this.setState({ validate })
  }

  render() {
    const requiredLabel = { color: 'red' }
    const align = { textAlign: "left" }
    const {emailState, passwordState} = this.state.validate
    const {name,email,password,content,color,flag,emailAlert}=this.state
    if (flag) {
      return (
        <div>
          <center>
            <Container style={{ paddingTop: 50 }} className="App">
              <Card style={{ width: 400, border: 0 }}>
                <CardBody>
                  <Alert color={color}>{content}</Alert>
                  <center>
                    <CardTitle style={{ color: "teal" }}>
                      Create an Account
                    </CardTitle>
                    <br />
                  </center>
                  <FormGroup style={align}>
                    <Label for="Name">Name <span style={requiredLabel}>*</span></Label>
                    <Input name="name" type="text" placeholder="Your Name" value={name} onChange={e => this.handleInput(e)}  />
                  </FormGroup>
                  <FormGroup style={align}>
                    <Label style={{ align }} for="Email">Email <span style={requiredLabel}>*</span></Label>
                    <Input name="email" type="email" placeholder="Your Email" value={email} 
                           valid={emailState === 'success'} invalid={emailState === 'danger'}
                           onChange={e => {  this.handleInput(e); this.validateEmail(e) }}
                     />
                    <FormFeedback invalid> {emailAlert ? "Email already exists, try another mail" : "Uh oh! Incorrect email"}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup style={align}>
                    <Label for="password">Password <span style={requiredLabel}>*</span></Label>
                    <Input name="password" type="password" disabled={!email} placeholder="Your password" 
                           value={password} onChange={e => { this.handleInput(e); this.validatePassword(e) }}
                           onKeyPress = {this.handleEnter} valid={passwordState === 'success'} invalid={passwordState === 'danger'}
                    />
                    <FormFeedback invalid tooltip>
                      Password length must be more then 5 characters
                    </FormFeedback>
                  </FormGroup>
                  <center>
                    <Button color="info" disabled={!password} onClick={this.handleSubmit}>Signup</Button>
                    <CardBody>
                      <span>I already have an Account. </span>
                      <Link to="/login">Login Now </Link>
                    </CardBody>
                  </center>
                </CardBody>
              </Card>
            </Container>
          </center>
        </div>
      );
    } else {
      return (
        <center>
          <Container>
            <Card style={{ border: 0 }}> <p>Please Check your Email for Activation Link!</p></Card>
          </Container>
        </center>
      )
    }
  }
}

export default Signup;
