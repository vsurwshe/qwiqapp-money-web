import React from "react";
import { Container, Alert, Label, Button, Input, Card, CardBody, CardTitle, FormGroup, FormFeedback } from "reactstrap";
import { Link } from "react-router-dom";
import SignupApi from "../services/SignupApi";
class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    adminToken: "",
    flag: true,
    color: "",
    content: "",
    emailAlert:false,
    validate: {
      emailState: "",
      passwordState: ""
    }
  };
  //this is use for the store whatever input given in input fileds set into state variable
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  //when enter key press that time this method call
  handleEnter = (event) =>{
    if (event.key === 'Enter' ) { this.handleSubmit(); }
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state.email + " " + this.state.password);
    const data = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
    };
    if (this.state.name === "") {
        this.callAlertTimer("danger", "Name should not be empty")
        // this.setState({ password: "" });
    } else if (this.state.password.length > 5) {
         new SignupApi().registerUser(this.successCall, this.errorCall, data);
    }
  };
  //when user singup the successfully that time this method call
  successCall = () => {
    this.callAlertTimer("success", "Succesfull! Please Check your Email for Activation Link")
  };
  //When Call the Email Already Exits
  successCallCheck = () => {
    const { validate } = this.state;
    validate.emailState = 'danger'; this.setState({ emailAlert: true });
  };

 // when any internal Error is coming
  errorCall = err => {
    this.callAlertTimer("danger", "Internal Error");
  };
  //if Email Already not exits
  errorCallCheck = err => {
    const { validate } = this.state;
    validate.emailState = 'danger'
  };
  //this print onscreen alert
  callAlertTimer = (color, content) => {
    this.setState({color: color,content: content});
    if ( this.state.color === "success"  && this.state.content === "Succesfull! Please Check your Email for Activation Link") {
      setTimeout(() => { this.setState({ color: '', content: '', flag: false }) }, 4000)
    }else {setTimeout(() => { this.setState({ color: '', content: '', email: '' }) }, 4000)}
  };
  //this method check user enter vaild email format or not
  validateEmail = e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    let email = e.target.value;
    let data = {email: e.target.value};
    if (emailRex.test(email)) {
      validate.emailState = 'success'
      new SignupApi().existsUser(this.successCallCheck, this.errorCallCheck, data)
      this.forceUpdate()
    }else {
      this.setState({ emailAlert: false })
      validate.emailState = 'danger'
    }
    this.setState({ validate });
  };
  //validate the user enter password 
  validatePassword = e => {
    const { validate } = this.state
    if (e.target.value.length > 5){
      validate.passwordState = 'success'
    }else{
      validate.passwordState = 'danger'
    }
    this.setState({ validate })
  }

  render() {
    const requiredLabel = { color: 'red' }
    const align = { textAlign: "left" }
    const {emailState, passwordState} = this.state.validate
    const {name,email,password,content,color,flag,emailAlert}=this.state
    if (flag) {
      return <div>{this.loadSignupComponent(requiredLabel,align,emailState,passwordState,name,email,password,content,color,emailAlert)}</div>
    } else {
      return (
          <Container style={{paddingTop: "20%"}} className="App" >
            <Card style={{ padding: 40, border: 0, textAlign: "center"}}> <p><b>You are Succesfully Registered with Web Money !!<br/>
             <br/>Please Check your Email for Activation Link !</b></p>
             <br/> <br/>
             </Card>
          </Container>
      )
    }
  }
  
  loadSignupComponent = (requiredLabel,align,emailState,passwordState,name,email,password,content,color,emailAlert) => {
    return (<div style={{ paddingTop: 50 }} className="animated fadeIn">
      <center>
          <Card style={{ width: 400, border: 0 }}>
            <CardBody>
              <Alert color={color}>{content}</Alert>
              <center>
                <CardTitle style={{ color: "teal" }}> Create a Web Money Account </CardTitle> <br />
              </center>
              <FormGroup style={align}>
                <Label for="Name">Name <span style={requiredLabel}>*</span></Label>
                <Input name="name" type="text" placeholder="Your Name" value={name} onChange={e => this.handleInput(e)}  />
              </FormGroup>
              <FormGroup style={align}>
                <Label style={{ align }} for="Email">Email <span style={requiredLabel}>*</span></Label>
                <Input name="email" type="email" placeholder="Your Email" value={email} valid={emailState === 'success'}
                       invalid={emailState === 'danger'} onChange={e => {  this.handleInput(e); this.validateEmail(e) }}/>
                <FormFeedback invalid> {emailAlert ? "Email already Exists, try another Email..." : "Uh oh! Incorrect email"}
                </FormFeedback>
              </FormGroup>
              <FormGroup style={align}>
                <Label for="password">Password <span style={requiredLabel}>*</span></Label>
                <Input name="password" type="password" placeholder="Your password" onChange={e => { this.handleInput(e); this.validatePassword(e) }} 
                  onKeyPress = {this.handleEnter} disabled={!email || emailState === 'danger'} valid={passwordState === 'success'} invalid={passwordState === 'danger'} value={password} />
                <FormFeedback invalid tooltip> Password length must be more then 5 characters </FormFeedback>
              </FormGroup>
              <center>
                <Button color="info" disabled={!password || (emailAlert &&  emailState === 'danger' ) } onClick={this.handleSubmit}> Signup </Button>
                <CardBody>
                  <span> I already have an Account. </span>
                  <Link to="/login"> Login Now </Link>
                </CardBody>
              </center>
            </CardBody>
          </Card>
      </center>
    </div>)
  }
}

export default Signup;
