import React from "react";

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
                <NavItem><NavLink href="/dashboard">Home</NavLink></NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>Profiles</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink href="/createProfiles">Create Profiles</NavLink></DropdownItem>
                    <DropdownItem><NavLink href="/viewProfiles">View Profiles</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <AuthButton />
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </Container>
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
