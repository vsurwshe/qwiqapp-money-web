import React, { Component } from "react";
import Profiles from "./Profiles";
import Sidemenu from './SideMenu';

class Dashboard extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="flex-xl-nowrap row">
            <Sidemenu/> 
            <Profiles /> 
        </div> 
      </div>
    );
  }
}

export default Dashboard;
