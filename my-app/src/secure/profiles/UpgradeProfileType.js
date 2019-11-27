import React from 'react';
import PropTypes from "prop-types";
import { UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";

// Profile upgrade dropdown loads according to profile.upgradeTypes
export const UpgradeProfileType = (props) => {
  const {userProfile,profileTypes } = props;
  return <>
    {userProfile && userProfile.upgradeTypes && <UncontrolledDropdown group>
      <DropdownToggle caret >Upgrade to</DropdownToggle>
      <DropdownMenu><></>
        {profileTypes && userProfile.upgradeTypes.map((upgradeType, id) => {
          const upgradeProfileType = profileTypes.filter(profile => profile.type === upgradeType);
          return <DropdownItem key={id} onClick={() => props.handleUserConfirm(userProfile.id, upgradeProfileType[0].type)} >{upgradeProfileType[0].name} </DropdownItem>
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
    }
  </>
}

DropdownMenu.propTypes={
  children: PropTypes.node.isRequired,
}