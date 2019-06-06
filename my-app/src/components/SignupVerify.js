import React, { Component } from "react";
import { CardTitle,Container,Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import queryString from "query-string";
import SignupApi from "../services/SignupApi";
import Config from "../data/Config";

class SignupVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      content: 'User Verification in Progress, Please wait ..........'
    };
  }

  
  componentWillMount = () => {
    let code = queryString.parse(window.location.search).code;
    let id = this.props.match.params.id;
    new SignupApi().verifySignup(this.successCall, this.errorCall, id, code);
  };

  successCall = json => {
    setTimeout(()=>{
      this.setState({ flag: true });
    }, Config.notificationMillis)
  };

  errorCall = err => {
    this.setState({ content: <div><strong>Email already Verified, please Login......</strong><br/><br/><br/><Link to='/login'> Login Now</Link></div>});
  };

  render() {
    if (this.state.flag) {
      return (
        <div>
          <Container style={{paddingTop: "20%"}} className="App" >
            <Card style={{ padding: 40, border: 0, textAlign: "center"}}> 
              <CardBody>
                <center>
                  <CardTitle>
                    <b>Congratulations!! You are successfully registered in JustMoney. You can now login.....</b>
                  </CardTitle>
                  <Link to="/login"> Login Now</Link>
                </center>
              </CardBody>
            </Card>
          </Container>
        </div>
      );
    }
    return (
      <div>
        <Container style={{paddingTop: "20%"}} className="App" >
          <Card style={{ padding: 40, border: 0, textAlign: "center"}}> 
            <CardBody>
              <center>
                <CardTitle><b>{this.state.content}</b></CardTitle>
                
              </center>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default SignupVerify;
