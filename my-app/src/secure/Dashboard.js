import React, { Component } from "react";
import { Card, CardHeader, CardBody } from "reactstrap";

class Dashboard extends Component {

  render() {
    return <div>{this.loadDashboard()}</div>
  }

  loadDashboard = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Dashboard</strong></CardHeader>
          <CardBody><center><h1>Welcome To WebMoney App</h1></center></CardBody>
        </Card>
      </div>);
  }
}

export default Dashboard;
