import React, { Component } from "react";
import { Card ,CardHeader,CardBody} from "reactstrap";
import ProfileApi from "../services/ProfileApi";
import Store from "../data/Store";

class Dashboard extends Component {
 
  componentDidMount = () => {
    new ProfileApi().getProfiles(this.successProfileid, this.errorCall);
  }

  successProfileid = json => {
    if (json === null) { console.log("there is no profile id") }
    else {
      const iterator = json.values();
      for (const value of iterator) { Store.saveProfile(value) }
    }
  }

  errorCall = err => {
    console.log(err);
  }

  render() {
    return <div>{this.loadDashboard()}</div>
  }
  
  loadDashboard = () =>{
    return( 
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Dashboard</strong></CardHeader>
          <CardBody><center><h1>Welcome To WebMoney App</h1></center></CardBody>
        </Card>
      </div>);
  }
}

export default Dashboard;
