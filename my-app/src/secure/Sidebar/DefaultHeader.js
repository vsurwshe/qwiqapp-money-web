import React, { Component } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, Nav} from "reactstrap";
import PropTypes from "prop-types";
import { AppHeaderDropdown, AppSidebarToggler,AppNavbarBrand } from "@coreui/react";
import { AuthButton } from "../../App";
import logo from '../Sidebar/img/user.png'
import { FaCaretDown, FaCaretUp, FaUserTie } from "react-icons/fa";
const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props){
    super(props)
    this.state = {
      flag:false
    }
  }

  toggle = () =>{
    this.setState({flag:!this.state.flag})
    this.props.onFlagChange()
  }

  render() {
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand>
          {/* <img src={logo} style={{borderRadius:'50%', marginLeft:'40px'}} alt="Profile Pic" align='center' width="40" height="40"/> */}
          <span onClick = {this.toggle} > 
            <FaUserTie  size={25} style={{marginLeft:40}}/><br/>
            <strong style={{ marginTop:10}}>MY PROFILE</strong> &nbsp;
            {this.state.flag ? <FaCaretUp style={{color:'#0e2f73'}}/> : <FaCaretDown/>}
          </span>
        </AppNavbarBrand>
        <Nav className="d-md-down-none" navbar />
          <Nav className="ml-auto" navbar>
            <h5 style={{paddingTop:'10px'}}><strong>WEB MONEY</strong></h5>
              <AppHeaderDropdown direction="down">
                <DropdownToggle nav><img src={logo} className="img-avatar" alt="Menu" /></DropdownToggle>
                <DropdownMenu right style={{ right: "auto" }}>
                  <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
                  <DropdownItem><AuthButton /></DropdownItem>
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
