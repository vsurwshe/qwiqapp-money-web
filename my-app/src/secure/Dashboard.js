import React, { Component } from "react";
import { Card ,CardHeader,CardBody} from "reactstrap";

class Dashboard extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return <div>{this.loadDashborad()}</div>
  }

  loadDashborad=()=>{
    return( <div className="animated fadeIn">
    <Card>
      <CardHeader>
        <strong>Dashboard</strong>
      </CardHeader>
      <CardBody>
        <center>
        <h1>Welcome To WebMoney App</h1>
        </center>
        </CardBody>
      </Card>
    </div>);
  }
}

export default Dashboard;
