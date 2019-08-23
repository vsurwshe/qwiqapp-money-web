import React, { Component } from "react";
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from "reactstrap";
import Store from "../data/Store";
import '../css/style.css';

class Dashboard extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    const profileName = Store.getProfile().name;
    return <div>{this.loadDashboard(profileName)}</div>
  }

  // hard coded added for now...
  loadDashboard = (profileName) => {
    return <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Dashboard</strong>
        </CardHeader>
        <CardTitle className="card-align">{profileName}</CardTitle>
        <CardBody>
          <Row>
            <Col sm={3}>
              <CardBody style={{ backgroundColor: "#CF5EE8"}}>
                <CardTitle >Upcoming Bills: 12</CardTitle>
              </CardBody>
            </Col>
            <Col sm={3}>
              <CardBody style={{ backgroundColor: "#F3F781"}}>
                <CardTitle className="card-title">Overdue Bills: 11 </CardTitle>
              </CardBody>
            </Col>
            <Col sm={3}>
              <CardBody style={{ backgroundColor: "#298A08"}}>
                <CardTitle className="card-title">Paid Bills: 12 </CardTitle>
              </CardBody>
            </Col>
            <Col sm={3}>
              <CardBody style={{ backgroundColor: "#FA5858"}}>
                <CardTitle className="card-title">Unpaid Bills: 12 </CardTitle>
              </CardBody>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  }
}

export default Dashboard;
