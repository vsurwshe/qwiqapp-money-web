import React from 'react';
import { Card, CardHeader, CardBody, Button } from "reactstrap";
import Loader from 'react-loader-spinner';
export const ReuseComponents ={
    loadLoder : function(strongMessage, buttonMessage, callButton){
        console.log("reuse Loader")
        return (
            <div className="animated fadeIn">
              <Card>
                loadHeader(strongMessage, buttonMessage, callButton)
                <center style={{ paddingTop: '20px' }}>
                  <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60} /></CardBody>
                </center>
              </Card>
            </div>)
    },
    loadHeader : function(strongMessage, buttonMessage, callButton) {
        return (
            <CardHeader>
              <strong> {strongMessage} </strong>{buttonMessage === null ? "" :
              <Button color="success" className="float-right" onClick={()=>{callButton()}}> {buttonMessage} </Button>}
            </CardHeader>);
    }
}
