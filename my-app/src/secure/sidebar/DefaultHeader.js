import React, { useEffect, useState } from "react";
import { withRouter, Link } from 'react-router-dom';
import { AppSidebarToggler, AppHeaderDropdown } from "@coreui/react";
import { Button, Nav, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem, DropdownMenu, DropdownToggle, } from "reactstrap";
import { FaKey, FaUserEdit, FaPowerOff, FaAngleDown, FaAddressCard, FaRegCalendarAlt, FaUserCircle, FaRegSun, FaUserPlus, FaSyncAlt } from "react-icons/fa";
import { AuthButton } from "../../App";
import Config from "../../data/Config";
import Store from "../../data/Store";
import Avatar from "react-avatar";
import '../../css/bills-reminder.css';
import '../../css/style.css';
import { userAction } from "../../data/GlobalKeys";

const DefaultHeader = (props) => {
  let [profileName, setProfileName] = useState("Web Money");

  let [authButton, setAuthButton] = useState(false);
  let [icon, animatedIcon] = useState(false);
  let [userName, changeUserName] = useState("");
  let profiles = Store.getUserProfiles();
  const currentUserAction = Store.getUser() ? Store.getUser().action : '';
  let navigateUrl = currentUserAction !== userAction.VERIFY_EMAIL ? "/dashboard" : "/profiles"

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
  useEffect(() => {
    successCall(); getUserName()
  });

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
        <Avatar name={userName && userName.charAt(0)} className="avtar" size="40" round={true} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem tag="div" className="text-center"><strong >{userName}</strong></DropdownItem>
        <DropdownItem tag={Link} to='/billing/address'><FaAddressCard className="faAddressCard" />Billing Address</DropdownItem>
        <DropdownItem tag={Link} to="/billing/paymentHistory"><FaRegCalendarAlt className="faRegCalendarAlt" />Payment History</DropdownItem>
        <DropdownItem tag={Link} to="/editUser"><FaUserEdit className="faUserEdit" />Edit User</DropdownItem>
        <DropdownItem tag={Link} to="/changePassword"><FaKey className="faKey" />Change Password</DropdownItem>
        <DropdownItem onClick={e => toggleDanger(e)} ><FaPowerOff className="faPowerOff" />Logout</DropdownItem>
      </DropdownMenu>
    </>
  }

  const loadProfileDropdown = () => {
    return <>
      <DropdownToggle nav>
        <b>{profileName ? profileName.length <= 13 ? profileName : profileName.slice(0, 11) + "..." : ""}&nbsp;</b>&nbsp;
        <FaAngleDown size={18} className="faAngleDown"/>
      </DropdownToggle>
      <DropdownMenu>
        {profiles && profiles.map((profile, id) => {
          let url = "/profiles/" + profile.id;
          return <DropdownItem key={id} tag={Link} to={url}>
            <FaUserCircle className="faUserCircle" /> &nbsp; {profile.name.length > 15 ? (profile.name).slice(0, 15) + "..." : profile.name}
          </DropdownItem>
        })
        }
        <DropdownItem tag={Link} to="/profiles"> <FaRegSun className="faRegSun" /> &nbsp;&nbsp;Manage Profiles</DropdownItem>
        <DropdownItem tag={Link} to="/createProfile"><FaUserPlus className="faUserPlus"/> &nbsp; Create Profile </DropdownItem>
        <DropdownItem onClick={refreshButton} > {!icon && <><FaSyncAlt className="faSyncAlt" />&nbsp; &nbsp;Refresh</>}
        </DropdownItem>
      </DropdownMenu>
    </>
  }

  return <React.Fragment>
    <AppSidebarToggler className="d-lg-none" display="md" mobile />
    <Link to={navigateUrl} className="dashboardLink">
      <span>
          <img src={process.env.PUBLIC_URL + '/img/logo.png'} className="bills-reminder-logo" alt="bills-reminder" />Bills Reminder
        </span>
    </Link>
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