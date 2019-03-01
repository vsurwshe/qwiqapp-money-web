import React, { Component } from "react";
import { Card, CardTitle } from "reactstrap";

class Dashboard extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    this.props.history.push("/login");
  }
  render() {
    return (
      <div>
        <Card>
          <CardTitle>Welcome To WebMoney App</CardTitle>
        </Card>
      </div>
    );
  }
}

export default Dashboard;
