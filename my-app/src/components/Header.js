import React from "react";
import '../css/style.css';

import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";

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
//    console.log("render: Store.isLoggedIn: ", Store.isLoggedIn());
    if (Store.isLoggedIn()) {
      return this.secureNavBar();
    } else {
      return this.nonSecureNavBar();
    }
  }

  secureNavBar = () => {
    return (
      <div>
        <Container style={{ padding: 20 }} className="App">
          <Navbar
            style={{ backgroundColor: "#D3F9F6", color: "#000000" }}
            light
            expand="md">
            <NavbarBrand href="/">Just Money Web App</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              
              <Nav className="ml-auto" navbar>
                <NavItem>
                   <AuthButton />
                 </NavItem>
                 </Nav>
            </Collapse>
          </Navbar>
        </Container>

              <Nav navbar vertical style={{padding:"20px"}}>
                <NavItem><NavLink href="/dashboard">Dashboard</NavLink></NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>Profiles</DropdownToggle>
                  <DropdownMenu className="sidebar">
                    <DropdownItem><NavLink href="/createProfiles">Create Profiles</NavLink></DropdownItem>
                    <DropdownItem><NavLink href="/profiles">View Profiles</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
      </div>
    );
  };
  nonSecureNavBar = () => {
    return (
      <div>
        <Container style={{ padding: 20 }} className="App"> </Container>
      </div>
    );
  };
}
export default Header;
