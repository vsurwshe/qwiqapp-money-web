import React from "react";

import { Link } from "react-router-dom";
import Store from "../data/Store";
import { AuthButton } from "../App";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }
  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  render() {
 
    if (Store.isLoggedIn()) {
      return this.secureNavBar();
    } else {
      return this.nonSecureNavBar();
    }
  }

  secureNavBar = () => {
    return (
      <div>
        <body
          className="app header-fixed sidebar-md-show sidebar-fixed  "
          data-gr-c-s-loaded="true"
        >
          <header className="app-header navbar">
            <button
              className="navbar-toggler sidebar-toggler d-lg-none mr-auto"
              type="button"
              data-toggle="sidebar-show"
            >
                      <span className="navbar-toggler-icon" />
            </button>

            <ul className="nav navbar-nav mr-auto d-md-down-none" />
            <ul className="nav navbar-nav d-md-down-none">
              <li className="nav-item px-3">
                <AuthButton />
              </li>
            </ul>
          </header>
          <div className="app-body">
            <div className="sidebar">
              <nav className="sidebar-nav ps">
                <ul className="nav">
                  <li class="nav-item ">
                    {/* <a className="nav-link ">
                      <i class="nav-icon cui-dashboard" /> DashBoard
                    </a> */}
                    <ul className="nav-dropdown-items" />
                  </li>
                  <li className="nav-item  nav-dropdown  ">
                    <a className="nav-link " href="/dashboard">
                      <i class="nav-icon cui-dashboard" /> DashBoard
                    </a>
                  </li>
                  <li className="nav-item  nav-dropdown  ">
                    <a className="nav-link  nav-dropdown-toggle ">
                      <i class="nav-icon cui-user" />
                      Profiles
                    </a>
                    <ul className="nav-dropdown-items">
                      <li className="nav-item ">
                        <div className="nav-link">
                          <Link exact to="/createProfile">
                            Create Profile
                          </Link>
                        </div>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link " href="/profiles">
                          View Profile
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav> <button class="sidebar-minimizer brand-minimizer" type="button" />
            </div>
          </div>
        </body>
      </div>
    );
  };
  nonSecureNavBar = () => {
    return (
      <div />
      //   <div>
      //     <Container style={{ padding: 20 }} className="App">
      //  </Container>
      //   </div>
      // <SideMenu />
    );
  };
}
export default Header;
