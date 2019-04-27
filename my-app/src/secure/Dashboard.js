import React, { Component } from "react";
import { Card ,CardHeader,CardBody} from "reactstrap";
import ProfileApi from "../services/ProfileApi";
import Store from "../data/Store";

class Dashboard extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return <div>{this.loadDashboard()}</div>
  }
  componentDidMount = () => {
    new ProfileApi().getProfiles(this.successProfileid, this.errorCall);
  }

  successProfileid = json => {
    if (json === []) { console.log("there is no profile id") }
    else {
      const iterator = json.values();
      for (const value of iterator) { Store.saveProfileId(value.id) }
    }
  }

  errorCall = err => {
    console.log(err);
  }


  loadDashboard=()=>{
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
