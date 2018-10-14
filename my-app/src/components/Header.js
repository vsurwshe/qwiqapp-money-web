import React from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand,
  Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Store from '../data/Store';
import { AuthButton } from '../App';

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
      return this.secureNavBar();
    } else {
      return this.nonSecureNavBar();
    };
  }

 secureNavBar = function() {
  return (
      <Navbar color="light" light expand="md">
      <AuthButton/>
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
      <Navbar color="light" light expand="md">
      <AuthButton/>
        <Link to='/'>Non secure navigagon bar.</Link>
      </Navbar>
    );
  } 
  
}


export default Header
