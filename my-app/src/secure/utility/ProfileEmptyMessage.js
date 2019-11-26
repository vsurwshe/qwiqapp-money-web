import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from "reactstrap";
import ProfileForm from '../profiles/ProfileForm';
import Store from '../../data/Store';
import { userAction } from '../../data/GlobalKeys';

export const ProfileEmptyMessage = () => {
  let [addProfile, changeAddProfile] = useState(false)
  const profileChange = () => {
    changeAddProfile(addProfile = !addProfile)
  }
  const user = Store.getUser()

  if (addProfile) {
    if (user && user.action === userAction.VERIFY_EMAIL) {
      return showNoProfile(profileChange, "You haven't verified the email, please verify your email first .....")
    } else {
      return <ProfileForm />
    }
  } else {
    return showNoProfile(profileChange, "You haven't created any Profile yet. So Please Create Profile... ")
  }
}

const showNoProfile = (profileChange, message) => {
  return <div className="animated fadeIn">
    <Card>
      <CardHeader> <Button color="info" onClick={profileChange} className="float-right"> + Create Profile</Button> </CardHeader>
      <center style={{ paddingTop: '20px' }}>
        <CardBody><h5><b>{message}</b></h5> </CardBody>
      </center>
    </Card>
  </div>
}