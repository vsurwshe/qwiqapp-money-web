import React, { useEffect, useState } from "react";
import { withRouter, Link } from 'react-router-dom';
import { AppSidebarToggler, AppHeaderDropdown, AppNavbarBrand } from "@coreui/react";
import { Button, Nav, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem, DropdownMenu, DropdownToggle, } from "reactstrap";
import { FaSync, FaUserTie, FaKey, FaUserEdit, FaPowerOff, FaAngleDown, FaAddressCard, FaRegCalendarAlt } from "react-icons/fa";
import { AuthButton } from "../../App";
import Config from "../../data/Config";
import Store from "../../data/Store";


const DefaultHeader = (props) => {
  const styles = { paddingTop: '10px', marginRight: 10, marginBottom: 10, color: "#228B22" }
  let [profileName, setProfileName] = useState("Web Money");
  
  let [authButton, setAuthButton] = useState(false);
  let [icon, animatedIcon] = useState(false);

  // let [changeUsername] = useState("");
  // let [animatedIcon] = useState(false);
  // let [flag, setFlagAction] = useState(false);
  
  let profiles=Store.getUserProfiles();
 
  const refreshButton = async () => {
    await Store.userDataClear();
    callAlert();
  }
  let callAlert = () => {
    animatedIcon(icon = true);
    setTimeout(() => {
      animatedIcon(icon = false);
    }, Config.notificationMillis);
  }

  const toggleDanger = () => {
    setAuthButton(authButton = !authButton)
  }

  const successCall = async () => {
    if (Store.getProfile() === null) {
      setProfileName(profileName = "Web Money");
    } else {
      await setProfileName(profileName = Store.getProfile().name);
    }
  }
  //TODO:  handle profile error message
  useEffect(() => { successCall(); });
  
  // const getUseName = () => {
  //   let user = Store.getUser();
  //   if (user) {
  //     changeUsername(userName = user.name)
  //   }
  // };

  const loadAuthButton = () => {
    return (
      <Modal isOpen={authButton} toggle={toggleDanger} >
        <ModalHeader toggle={toggleDanger}>Sign Out</ModalHeader>
        <ModalBody>Are you Sure you want to Signout ?</ModalBody>
        <ModalFooter>
          <AuthButton> Signout </AuthButton>
          <Button color="secondary" onClick={toggleDanger}>Cancel</Button>
        </ModalFooter>
      </Modal>)
  }
  const loadUserDropdown = () =>{
    return (<> 
    <DropdownToggle nav>
          <FaUserTie style={{ marginLeft: 5, position: "relative" }} size={20} /><FaAngleDown size={18} style={{ color: "darkblue", marginRight: 25 }} />
        </DropdownToggle>
        <DropdownMenu right style={{ right: 'auto' }}>
          <DropdownItem header tag="div" className="text-center"><strong> Settings</strong></DropdownItem>
          <DropdownItem><Link to="/billing/address" ><FaAddressCard style={{ color: "#F16939", marginRight: 15 }} />Billing Address</Link> </DropdownItem>
          <DropdownItem><Link to="/billing/paymentHistory" ><FaRegCalendarAlt style={{ color: "green", marginRight: 15 }} />Payment History</Link> </DropdownItem>
          <DropdownItem><Link to="/editUser" ><FaUserEdit style={{ color: "#AB2504", marginRight: 15 }} />Edit User</Link> </DropdownItem>
          <DropdownItem><Link to="/changePassword" ><FaKey style={{ color: "#101011", marginRight: 15 }} />Change Password</Link> </DropdownItem>
          <DropdownItem onClick={e => toggleDanger(e)} ><FaPowerOff style={{ color: "red", marginRight: 15 }} />Logout</DropdownItem>
        </DropdownMenu>
    </>)
  }

  const loadProfileDropdown = () => {
    return (<>
      <DropdownToggle nav>
          <b>{profileName ? profileName.length <= 13 ? profileName : profileName.slice(0, 11) + "..." : ""}&nbsp;</b>&nbsp;
        <FaAngleDown size={18} style={{ color: "darkblue", marginRight: 25 }} />
      </DropdownToggle>
      <DropdownMenu right style={{ right: 'auto' }}>
        <DropdownItem header tag="div" className="text-center"><strong>Selecting Profile</strong></DropdownItem> 
          {profiles && profiles.map((profile,id)=>{
            let url="/profiles/"+profile.id;
            return( <Link to={url} style={{textDecoration: "none"}}><DropdownItem key={id} >{profile.name} </DropdownItem></Link>)})
          }
        <Link to="/profiles" style={{textDecoration: "none"}} ><DropdownItem>Manage Profile</DropdownItem></Link>
        <Link to="/createProfile" style={{textDecoration: "none"}}><DropdownItem>Create Profile</DropdownItem></Link>
        <DropdownItem> {!icon ? <FaSync style={styles} data-toggle="tooltip" boundary="scrollParent" data-placement="bottom" title="Refresh" size={25}
          onClick={refreshButton} /> : ""} 
        </DropdownItem>      
      </DropdownMenu>
    </>);
  }

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand /> 
      <Nav className="d-md-down-none" navbar />
      <Nav className="ml-auto" navbar>
      <AppHeaderDropdown direction="down">
          {loadProfileDropdown()}
        </AppHeaderDropdown>
        <AppHeaderDropdown direction="down">
          {loadUserDropdown()}
        </AppHeaderDropdown>
      </Nav>
      {loadAuthButton()}
    </React.Fragment>)

    
}
export default withRouter(DefaultHeader);