import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Store} from "../data/Store"

class SideMenu extends Component {
  render() {
    return (
      <div class="col-xl-2 col-md-3 col-12 SideNav-SidePanel-module--side-panel--19YKC d-flex flex-column">
        <div>
          <Link to="/dashboard"> Dashboard </Link> <br/>
          <Link to="/profiles"> Profiles </Link> <br/>
          <Link to="/profiles"> Menu3 (1) </Link> <br/>
          <Link to="/profiles"> Menu4  </Link>
        </div>
      </div>
    );
  }
}

export default SideMenu;
