import React, { Component } from "react";
import {  CardTitle, Container, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import queryString from "query-string";
import SignupApi from "../services/SignupApi";

class SignupVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false
    };
  }

  componentDidMount = () => {
    let code = queryString.parse(window.location.search).code;
    let id = this.props.match.params.id;
    console.log("id " + code + "  code " + id);
    new SignupApi().verifySignup(this.successCall, this.errorCall, id, code);
  };
  successCall = json => {
    console.log(json);
    this.setState({ flag: true });
  };

  errorCall = err => {
    this.setState({ flag: false });
  };

  render() {
    if (this.state.flag) {
      return (
        <div>
          <Container style={{ padding: 20, color:"success" }} className="App">
            <Card style={{ border : 0 }}>
              <CardBody>
                <center>
                  <CardTitle>
                    Congratulations!! You are successfully registered in JustMoney. You can now login.....
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
        <Container style={{ padding: 20 }} className="App">
          <Card style={{ border : 0 }}>
            <CardBody>
              <center>
                <CardTitle>User Verification in Progress, Please wait ..........</CardTitle>
              </center>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default SignupVerify;
