import React, { useEffect, useState } from "react";
import { withRouter, Link } from 'react-router-dom';
import { AppSidebarToggler, AppHeaderDropdown, AppNavbarBrand } from "@coreui/react";
import { Button, Nav, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem, DropdownMenu, DropdownToggle, } from "reactstrap";
import { FaKey, FaUserEdit, FaPowerOff, FaAngleDown, FaAddressCard, FaRegCalendarAlt, FaUserCircle, FaRegSun, FaUserPlus, FaSyncAlt, FaViacoin } from "react-icons/fa";
import { AuthButton } from "../../App";
import Config from "../../data/Config";
import Store from "../../data/Store";
import Avatar from "react-avatar";
import '../../css/bills-reminder.css';
const DefaultHeader = (props) => {
  let [profileName, setProfileName] = useState("Web Money");

  let [authButton, setAuthButton] = useState(false);
  let [icon, animatedIcon] = useState(false);

  let [userName, changeUserName] = useState("");

  let profiles = Store.getUserProfiles();

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

  //TODO:  handle profile error message
  useEffect(() => { successCall(); getUserName() });

  const successCall = async () => {
    if (Store.getProfile() === null) {
      setProfileName(profileName = "Web Money");
    } else {
      await setProfileName(profileName = Store.getProfile().name);
    }
  }

  const getUserName = () => {
    let user = Store.getUser();
    if (user) {
      changeUserName(userName = user.name)
    }
  };

  const loadAuthButton = () => {
    return <Modal isOpen={authButton} toggle={toggleDanger} >
      <ModalHeader toggle={toggleDanger}>Sign Out</ModalHeader>
      <ModalBody>Are you Sure you want to Signout ?</ModalBody>
      <ModalFooter>
        <AuthButton> Signout </AuthButton>
        <Button color="secondary" onClick={toggleDanger}>Cancel</Button>
      </ModalFooter>
    </Modal>
  }

  const loadUserDropdown = () => {
    return <>
      <DropdownToggle nav>
        <Avatar name={userName && userName.charAt(0)} style={{ marginRight: 25, position: "relative" }} size="40" round={true} />
      </DropdownToggle>
      <DropdownMenu right style={{ right: 'auto' }}>
        <DropdownItem tag="div" className="text-center"><strong >{userName}</strong></DropdownItem>
        <DropdownItem tag={Link} to='/billing/address'><FaAddressCard style={{ color: "#F16939", marginRight: 15 }} />Billing Address</DropdownItem>
        <DropdownItem tag={Link} to="/billing/paymentHistory"><FaRegCalendarAlt style={{ color: "green", marginRight: 15 }} />Payment History</DropdownItem>
        <DropdownItem tag={Link} to="/editUser"><FaUserEdit style={{ color: "#AB2504", marginRight: 15 }} />Edit User</DropdownItem>
        <DropdownItem tag={Link} to="/changePassword"><FaKey style={{ color: "#101011", marginRight: 15 }} />Change Password</DropdownItem>
        <DropdownItem onClick={e => toggleDanger(e)} ><FaPowerOff style={{ color: "red", marginRight: 15 }} />Logout</DropdownItem>
      </DropdownMenu>
    </>
  }

  const loadProfileDropdown = () => {
    return <>
      <DropdownToggle nav>
        <b>{profileName ? profileName.length <= 13 ? profileName : profileName.slice(0, 11) + "..." : ""}&nbsp;</b>&nbsp;
        <FaAngleDown size={18} style={{ color: "darkblue", marginRight: 25 }} />
      </DropdownToggle>
      <DropdownMenu right style={{ right: 'auto' }}>
        {profiles && profiles.map((profile, id) => {
          let url = "/profiles/" + profile.id;
          return <DropdownItem key={id} tag={Link} to={url}>
            <FaUserCircle style={{ color: "#7F3BDB" }} /> &nbsp; {profile.name.length > 15 ? profileName.slice(0, 15) + "..." : profile.name}
          </DropdownItem>
        })
        }
        <DropdownItem tag={Link} to="/profiles"> <FaRegSun style={{ color: "#4763B9" }} /> &nbsp;&nbsp;Manage Profiles</DropdownItem>
        <DropdownItem tag={Link} to="/createProfile"><FaUserPlus style={{ color: "#832476  " }} /> &nbsp; Create Profile </DropdownItem>
        <DropdownItem onClick={refreshButton} > {!icon && <><FaSyncAlt style={{ color: "#0C7223" }} />&nbsp; &nbsp;Refresh</>}
        </DropdownItem>
      </DropdownMenu>
    </>
  }

  return <React.Fragment>
    <AppSidebarToggler className="d-lg-none" display="md" mobile />
    {/* <AppNavbarBrand> */}
    <Link to="/dashboard">
      <span style={{ color: "black", textDecoration: "none" }}>
       <img src={process.env.PUBLIC_URL + '/img/logo.png'} className="bills-reminder-logo" alt="bills-reminder" />Bills reminder
        </span>
      </Link>
    {/* </AppNavbarBrand> */}
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
  </React.Fragment>
}
export default withRouter(DefaultHeader);