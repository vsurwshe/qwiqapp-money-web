import React, { useEffect, useState } from "react";
import { withRouter, Link } from 'react-router-dom';
import { AppSidebarToggler, AppNavbarBrand, AppHeaderDropdown } from "@coreui/react";
import { Button, Nav, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem, DropdownMenu, DropdownToggle, } from "reactstrap";
import { FaSync, FaUserTie, FaKey, FaUserEdit, FaPowerOff, FaAngleDown, FaAddressCard, FaRegCalendarAlt } from "react-icons/fa";
import { AuthButton } from "../../App";
import Store from "../../data/Store";

const DefaultHeader = (props) => {
  let [profileName, changeProfleName] = useState("Web Money");
  let [flag, changeFlag] = useState(false);
  let [authButton, chnageAuthButton] = useState(false);
  // let [changeUsername] = useState("");
  // let [animatedIcon] = useState(false);

  const toggle = (e) => {
    changeFlag(flag = !flag)
    props.onFlagChange()
  }

  const refreshButton = async () => {
    await Store.userDataClear();
    // callAlert();
  }

  // let callAlert = () => {
  //   animatedIcon(icon = true);
  //   setTimeout(() => {
  //     animatedIcon(icon = false);
  //   }, Config.notificationMillis);
  // }

  const toggleDanger = () => {
    chnageAuthButton(authButton = !authButton)
  }

  const successCall = async () => {
    if (Store.getProfile() === null) {
      changeProfleName(profileName = "Web Money");
    } else {
      await changeProfleName(profileName = Store.getProfile().name);
    }
  }
  //TODO:  handle profile error message
  useEffect(() => {
    successCall();
    // getUseName();
  });

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

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand>
        <span onClick={toggle} >
          {/* <FaUserTie style={{ marginLeft: 5, position: "relative" }} size={25} /> */}
          {/* <strong style={{ marginLeft: 5, marginTop: 10 }}>{profileName ? profileName.length <= 13 ? profileName : profileName.slice(0, 11) + "..." : ""}</strong>&nbsp;
                 {flag ? <FaCaretUp style={{ color: '#0e2f73' }} /> : <FaCaretDown />} */}
        </span>
      </AppNavbarBrand>
      <Nav className="d-md-down-none" navbar />
      <Nav className="ml-auto" navbar>
      <AppHeaderDropdown direction="down">
          <DropdownToggle nav>
            <b>{profileName ? profileName.length <= 13 ? profileName : profileName.slice(0, 11) + "..." : ""}&nbsp;</b>&nbsp;<FaAngleDown size={18} style={{ color: "darkblue", marginRight: 25 }} />
          </DropdownToggle>
          <DropdownMenu right style={{ right: 'auto' }}>
            <DropdownItem header tag="div" className="text-center"><strong> Settings</strong></DropdownItem>
            <DropdownItem><Link to="/billing/address" ><FaAddressCard style={{ color: "#F16939", marginRight: 15 }} />Profile 1</Link> </DropdownItem>
            <DropdownItem><Link to="/billing/paymentHistory" ><FaRegCalendarAlt style={{ color: "green", marginRight: 15 }} />Profile 2</Link> </DropdownItem>
            <DropdownItem><Link to="/editUser" ><FaUserEdit style={{ color: "#AB2504", marginRight: 15 }} />Manage Profiles</Link> </DropdownItem>
            <DropdownItem><Link to="/changePassword" ><FaKey style={{ color: "#101011", marginRight: 15 }} />Create Profile</Link> </DropdownItem>
            <DropdownItem onClick={refreshButton} ><FaSync style={{color:'#228B22', marginRight: 15}} />Refresh Data</DropdownItem>
          </DropdownMenu>
        </AppHeaderDropdown>
        {/* <span onClick={toggle}>
                 {flag ? <FaCaretUp style={{ color: '#0e2f73' }} /> : <FaCaretDown />}
        </span> */}
        {/* {!icon ? <FaSync style={styles} data-toggle="tooltip" boundary="scrollParent" data-placement="bottom" title="Refresh" size={25}
          onClick={refreshButton} /> : ""} */}
        <AppHeaderDropdown direction="down">
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
        </AppHeaderDropdown>
      </Nav>
      {loadAuthButton()}
    </React.Fragment>)
}
export default withRouter(DefaultHeader);