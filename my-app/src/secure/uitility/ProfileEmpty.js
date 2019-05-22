import React, {useState} from 'react';
import { Card, CardBody, CardHeader, Button } from "reactstrap";
import CreateProfile from '../profiles/CreateProfile';

export const ProfileEmpty = () => {
    let [addProfile, changeAddProfile] = useState(false)
    const profileChange = ()=>{
        changeAddProfile(addProfile = !addProfile)
    }
    if (addProfile) {
        return (<CreateProfile />)
    } else {
        return (
            <div className="animated fadeIn">
              <Card>
                  <CardHeader> <Button color="info" onClick={profileChange} className="float-right">Create Profile</Button> </CardHeader>
                <center style={{ paddingTop: '20px' }}>
                  <CardBody><h5><b>You haven't created any Profile yet. So Please Create Profile. </b></h5> </CardBody>
                </center>
              </Card>
            </div>)
    }
    
  }