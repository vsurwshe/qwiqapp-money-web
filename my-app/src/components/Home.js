import React, { Component } from "react";

import { Container, Col, Card, CardBody, CardTitle } from "reactstrap";

class Home extends Component {
  render() {
    return (
      <div>
        <Container className="App">
          <Card>
            <CardBody>
              <Col>
                <CardTitle>Hello, welcome to App!</CardTitle>
              </Col>
              {/* <Link to='/singup'> Register Now</Link> <Link to='/login'> (login) </Link> */}
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default Home;
