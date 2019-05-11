import React, { Component } from "react";
import { Nav } from "reactstrap";
import PropTypes from "prop-types";
import { AppSidebarToggler, AppNavbarBrand } from "@coreui/react";
import { AuthButton } from "../../App";
import { createBrowserHistory } from "history";
import { FaCaretDown, FaSync, FaCaretUp, FaUserTie, } from "react-icons/fa";
import ProfileApi from "../../services/ProfileApi";
import Store from "../../data/Store";

const browserHistory = createBrowserHistory();

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props){
    super(props)
    this.state = {
      flag : false,
      profileName : ''
    }
  }

  componentDidMount = () =>{
    new ProfileApi().getProfiles(this.successCall, this.errorCall)
  }
  
  successCall = async (json) =>{
    if(json.length === 0 || json === null ){ 
      this.setState({ profileName : "Web Money" })
    }else{
      await Store.saveProfile(json)
      this.setState({ profileName : json.map(profile=>profile.name) })
    }
  }

  toggle = () =>{
    this.setState({flag:!this.state.flag})
    this.props.onFlagChange()
  }

  refreshButton = async () =>{
    await Store.clearLocalStorage();
    browserHistory.push("/dashboard");
    window.location.reload();
  }

  render() {
    const styles= {paddingTop:'10px', marginRight:10, marginBottom:10, color:"#228B22"}
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand>
          {/* <img src={logo} style={{borderRadius:'50%', marginLeft:'40px'}} alt="Profile Pic" align='center' width="40" height="40"/> */}
          <span onClick = {this.toggle} > 
            <FaUserTie  size={25} style={{marginLeft:40}}/><br/>
            <strong style={{ marginTop:10}}>{this.state.profileName}</strong> &nbsp;
            {this.state.flag ? <FaCaretUp style={{color:'#0e2f73'}}/> : <FaCaretDown/>}
          </span>
        </AppNavbarBrand>
        <Nav className="d-md-down-none" navbar />
        <Nav className="ml-auto" navbar>
          <FaSync style={styles} data-toggle="tooltip" boundary="scrollParent" data-placement="bottom" title="Refresh" size={25} onClick={this.refreshButton} />
          <AuthButton />
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
