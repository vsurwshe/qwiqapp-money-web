import React, { useEffect, useState } from "react";
import { Button, Nav, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { AppSidebarToggler, AppNavbarBrand } from "@coreui/react";
import { AuthButton } from "../../App";
import { FaCaretDown, FaSync, FaCaretUp, FaUserTie, FaPowerOff } from "react-icons/fa";
import ProfileApi from "../../services/ProfileApi";
import Store from "../../data/Store";
import { withRouter } from 'react-router-dom'

const DefaultHeader=(props)=>{

  const styles = { paddingTop: '10px', marginRight: 10, marginBottom: 10, color: "#228B22" }
  let [profileName, chnageProfleName] = useState("Web Money");
  let [flag, chnageFlag] = useState(false);
  let [authButton, chnageAuthButton] = useState(false);
  const toggle = (e) => {
    chnageFlag(flag = !flag)
     props.onFlagChange()
  }

  const refreshButton = async () => {
    await Store.clearLocalStorage();
    chnageProfleName(profileName ="Web Money")
    console.log(profileName);
  }

  const toggleDanger = () => {
    chnageAuthButton(authButton = !authButton)
  }

  useEffect(() => {
     new ProfileApi().getProfiles(async (json) => {
      if (json.length === 0 || json === null) {
        chnageProfleName(profileName = "Web Money");
      } else {
        await Store.saveProfile(json)
        chnageProfleName(profileName = json.map(profile => profile.name).toString());
      }
    }, (error) => {
      console.log(error)
    });
  })
   
  const loadAuthButton = () => {
    return (<Modal isOpen={authButton} toggle={toggleDanger} >
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
          <FaUserTie style={{ marginLeft: 5, position: "relative" }} size={25} />
          <strong style={{ marginLeft: 5, marginTop: 10 }}>{profileName.length <= 15 ? profileName : profileName.slice(0, 14) + "..."}</strong>&nbsp;
                 {flag ? <FaCaretUp style={{ color: '#0e2f73' }} /> : <FaCaretDown />}
        </span>
      </AppNavbarBrand>
      <Nav className="d-md-down-none" navbar />
      <Nav className="ml-auto" navbar>
        <FaSync style={styles} data-toggle="tooltip" boundary="scrollParent" data-placement="bottom" title="Refresh" size={25} 
        onClick={refreshButton} />
        <FaPowerOff onClick={e => toggleDanger(e)} style={{ color: "red", marginRight: 25 }} />
      </Nav>
      {loadAuthButton()}
    </React.Fragment>)
}
export default withRouter(DefaultHeader);