import React from 'react';
import {Card, CardBody, Col, Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from 'react-loader-spinner';
import { FaEllipsisV } from 'react-icons/fa';

export const ReUseComponents = {

    loadDeleting : function(strongHeaderMsg, bodyMessage, color, content ){
        return(
            <div className="animated fadeIn">
              <Card>
                {this.loadHeader(strongHeaderMsg)}
                <CardBody>
                 <Col sm="12" md={{ size: 5, offset: 4 }}> {color === "" ? bodyMessage : <Alert color={color}> {content} </Alert>} </Col>
                </CardBody>
              </Card>
            </div>)
    },
    loadHeader : function(strongMessage){
        return (<div style={{padding:10}}>
          <center><strong> {strongMessage} </strong></center>
        </div>)
    },
    loadLoader : function(headerMessage){
        return(
            <div className="animated fadeIn">
              <Card>
                {this.loadHeader(headerMessage)}
                <center style={{paddingTop:'20px'}}>
                  <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60}/></CardBody>
                </center>
              </Card>
            </div>)
    },
    searchingFor : function(term) {
        return function(x){
          return x.name.toLowerCase().includes(term.toLowerCase()) || !term
        }
      },
      
    loadDropDown : function(item, ukey, dropdownOpen, toggleDropDown, updateLabel, stateFun, toggleDanger){
        return (
            <Dropdown isOpen={dropdownOpen} style={{ marginTop: 7 }} toggle={() => { toggleDropDown(ukey); }} size="sm">
        <DropdownToggle tag="span" onClick={() => { toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={dropdownOpen}>
          <FaEllipsisV style={{ marginLeft: 10, marginRight: 10 }} />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => { updateLabel(item) }} > Update </DropdownItem>
          <DropdownItem onClick={() => { stateFun(item); toggleDanger(); }}> Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>);
    }, 
}
