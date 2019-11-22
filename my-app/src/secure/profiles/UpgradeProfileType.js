import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";

export const UpgradeProfileType= (props)=>{
  const {userProfile, profileTypes}=props;
  return <div>
    {userProfile && userProfile.upgradeTypes && <UncontrolledDropdown group>
      <DropdownToggle caret >Upgrade to</DropdownToggle>
      <DropdownMenu>
        {profileTypes && userProfile.upgradeTypes.map((upgradeType, id) => {
          const upgradeProfileType =  profileTypes.filter(profile => profile.type === upgradeType);
          return <DropdownItem key={id} onClick={() => props.handleUserConfirm(userProfile.id, upgradeProfileType[0].type)} >{upgradeProfileType[0].name} </DropdownItem>
          })}
      </DropdownMenu>
      </UncontrolledDropdown>
      }
  </div>
    }