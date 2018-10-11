import React from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand,
  Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Store from '../data/Store';

class Header extends React.Component {

  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
    // this.nonSecureNavBar = this.nonSecureNavBar.bind(this);
    // this.secureNavBar = this.secureNavBar.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    let content;
    console.log('render: Store.isLoggedIn: ', Store.isLoggedIn());
    if (Store.isLoggedIn()) {
      content = (
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">The Thing</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    Option 1
                  </DropdownItem>
                  <DropdownItem>
                    Option 2
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Reset
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
    );
    } else {
      content = (
        <Navbar color="light" light expand="md">
          <Link to='/'>Non secure navigagon bar.</Link>
        </Navbar>
    );
    }
    return (
      <div>{content}</div>
    );
  }

/*
 secureNavBar = function() {
  return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">reactstrap</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/components/">Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
  );
}

  nonSecureNavBar = function() {
    return (
        <Link to='/'>Non secure navigagon bar.</Link>
    );
  } 
  */
}


export default Header
