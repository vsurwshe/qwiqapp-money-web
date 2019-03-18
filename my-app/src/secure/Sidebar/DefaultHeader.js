import React, { Component } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, Nav } from "reactstrap";
import PropTypes from "prop-types";
import { AppHeaderDropdown, AppSidebarToggler ,AppNavbarBrand} from "@coreui/react";
import { AuthButton } from "../../App";
import logo from '../Sidebar/img/user.png'
const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand>
          <span ><b>WEB MONEY</b></span>
          </AppNavbarBrand>
        <Nav className="d-md-down-none" navbar />
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={logo} className="img-avatar" alt="Menu"/>
            </DropdownToggle>
            <DropdownMenu right style={{ right: "auto" }}>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <AuthButton />
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
