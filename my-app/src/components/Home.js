import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Container, Card, CardBody, CardTitle } from "reactstrap";

class Home extends Component {
  render() {
    return (
      <div>
        <Container className="App">
          <Card>
            <CardTitle>Hello, welcome to Financial App!</CardTitle>
            <CardBody>
              This app has many useful feature as below (refactor required):
              <ui>
                <li>Manage bills</li>
                <li>Manage bills</li>
                <li>Manage bills</li>
                <li>Manage bills</li>
                <li>Manage bills</li>
              </ui>
            </CardBody>
            {/* <Link to='/singup'> Register Now</Link> <Link to='/login'> (login) </Link> */}
          </Card>
          <Card>
            <CardTitle>In order to use the app please,</CardTitle>
            <CardBody>
              To signup for a new acccount: <Link to="/signup">Signup Now</Link>
              <br />
              Existing users can signin using: <Link to="/login">Login</Link>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default Home;
