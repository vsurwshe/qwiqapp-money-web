import React from 'react';
import { Card, CardHeader, CardBody, Col, Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Collapse } from 'reactstrap';
import Loader from 'react-loader-spinner';
import Avatar from 'react-avatar';
import { FaEllipsisV, FaSearch, FaTrashAlt, FaPen, FaAngleDown } from 'react-icons/fa';

export const ReUseComponents = {

  //Shows Deleting in process Message
  loadDeleting: function (strongHeaderMsg, bodyMessage, color, content) {
    return (
      <div className="animated fadeIn">
        <Card>
          {strongHeaderMsg === "" ? "" : this.loadHeader(strongHeaderMsg)}
          <CardBody>
            <Col sm="12" md={{ size: 5, offset: 4 }}> {color === "" ? bodyMessage : <Alert color={color}> {content} </Alert>} </Col>
          </CardBody>
        </Card>
      </div>)
  },

  // Shows Header
  loadHeader: function (strongMessage) {
    return (<div style={{ padding: 10 }}>
      <center><strong> {strongMessage} </strong></center>
    </div>)
  },

  //Shows Spinner 
  loadSpinner: function (headerMessage) {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader(headerMessage)}
          <center style={{ paddingTop: '20px' }}>
            <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60} /></CardBody>
          </center>
        </Card>
      </div>)
  },

  //Searches Items based on user given SearchTerm
  searchingFor: function (searchTerm) {
    return function (item) {
      let subItemName ='' ;
      if(item.childName !== null){
        subItemName = subItemName+ item.childName.map(item => item )
      }
      return (item.name.toLowerCase()+subItemName.toLowerCase()).includes(searchTerm.toLowerCase()) ||!searchTerm
    }
  },

  //This method loads Dropdown when Ellipsis is clicked to Update/Delete
  loadDropDown: function (item, ukey, dropdownOpen, toggleDropDown, stateFun, toggleDanger, updateLabel) {
    return (<Dropdown isOpen={dropdownOpen} style={{ marginTop: 7 }} toggle={() => { toggleDropDown(ukey); }} size="sm">
      <DropdownToggle tag="span" onClick={() => { toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={dropdownOpen}>
        <FaEllipsisV style={{ marginLeft: 10, marginRight: 10 }} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => { updateLabel(item) }} > Update </DropdownItem>
        <DropdownItem onClick={() => { stateFun(item); toggleDanger(); }}> Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>);
  },

  //This method Shows Categories/labels as Items
  loadItems: function (items, setSearch, search, addItem, visible, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion, color, content) {
    let itemType;
    if (items[0].subLabels !== undefined) {
      itemType = "Labels"
    } else {
      itemType = "Categories"
    }
    let placeHolder = "Search " + itemType + "..."
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader style={{ padding: "10px 10px 0px 10px" }} >
            <Row form>
              <Col md={3} style={{ marginTop: "10px" }}>
                <strong>{itemType} : {items.length}</strong>
              </Col>
              <Col md={7} className="shadow p-0 mb-3 bg-white rounded">
                <InputGroup>
                  <Input type="search" className="float-right" style={{ width: '20%' }} onChange={e => setSearch(e)} placeholder={placeHolder} />
                  <InputGroupAddon addonType="append">
                    <InputGroupText className="dark"><FaSearch /></InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col md={2}>
                <Button color="success" className="float-right" onClick={addItem}> + ADD </Button>
              </Col>
            </Row>
          </CardHeader>
          <div style={{ margin: 10, paddingLeft: 50 }}>
            <Alert isOpen={visible} color={color === undefined || content === undefined ? '' : color}>{content}</Alert>
            {items.filter(this.searchingFor(search)).map((singleItem, key) => { return this.loadSingleItem(singleItem, key, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion) })} </div>
        </Card>
      </div>)
  },

  //This method loads Single Items One by One
  loadSingleItem: function (singleItem, ukey, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion) {
    const ellipsisText1 = { flex: 1, display: 'flex', alignItems: 'center', marginLeft: '-10' }
    const ellipsisText2 = { flex: 1, width: '100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingLeft: 10 }
    const subItemCss = { marginLeft: 50, paddingTop: 4, paddingBottom: 0, paddingLeft: 5, height: 50 };
    return (
      <div className="list-group" key={ukey}>
        <div className="list-group-item" style={{ paddingTop: 1, padding: 7 }}>
          <Row >
            <Col>
              {this.loadAvatar_DisplayName(singleItem, ukey, ellipsisText1, ellipsisText2, toggleAccordion)}
            </Col>
            <Col sm={1} md={1} lg={1} xl={1} >
              {this.loadDropDown(singleItem, ukey, stateDrodownAccord[ukey], dropDownAccordion, setItemId, toggleDanger, handleUpdate)}
            </Col>
          </Row></div>
        <div style={{ marginBottom: 1.5 }} />
        {this.loadCollapse(singleItem, ukey, accordion, setItemId, toggleDanger, handleUpdate, subItemCss, ellipsisText1, ellipsisText2, toggleAccordion)}
        <div style={{ marginTop: 1 }} />
      </div>)
  },

  //This method adjusts the text design relatively
  loadAvatar_DisplayName: function (singleItem, ukey, ellipsisText1, ellipsisText2, toggleAccordion) {
    if (singleItem.parentId !== null) {
      return <span style={ellipsisText1} > {this.loadAvatar(singleItem, ukey, ellipsisText2, toggleAccordion)} </span>
    } else {
      return <span style={ellipsisText1} onClick={() => { toggleAccordion(ukey) }} > {this.loadAvatar(singleItem, ukey, ellipsisText2, toggleAccordion)} </span>
    }
  },

  //This method displays Items's Name with Avatar and AngleDown for SubItems
  loadAvatar: function (singleItem, ukey, ellipsisText2, toggleAccordion) {
    return (<>
      <Avatar name={singleItem.name.charAt(0)} color={singleItem.color === null || singleItem.color === "" ? '#000000' : singleItem.color} size="40" square={true} />
      <div style={ellipsisText2}>&nbsp;&nbsp;{singleItem.name}
        {singleItem.subCategories !== undefined
          ? (singleItem.subCategories !== null ? <span><FaAngleDown style={{ marginLeft: 8 }} onClick={() => { toggleAccordion(ukey) }} /></span> : "")
          : (singleItem.subLabels !== undefined ? (singleItem.subLabels !== null ? <span><FaAngleDown style={{ marginLeft: 8 }} onClick={() => { toggleAccordion(ukey) }} /></span> : "") : "")}
      </div>
    </>
    )
  },

  //This method displays subItems 
  loadCollapse: function (singleItem, ukey, accordion, setItemId, toggleDanger, handleUpdate, subItemCss, ellipsisText1, ellipsisText2, toggleAccordion) {
    return (
      <Collapse isOpen={accordion[ukey]}>
        {singleItem.subCategories !== undefined ? (singleItem.subCategories !== null ? singleItem.subCategories.map((subCategory, subKey) => { return this.loadSubItem(subCategory, subKey, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate, toggleAccordion) }) : "")
          : (singleItem.subLabels !== undefined ? (singleItem.subLabels !== null ? singleItem.subLabels.map((subLabel, subKey) => { return this.loadSubItem(subLabel, subKey, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate, toggleAccordion) }) : "") : "")}
      </Collapse>
    )
  },

  // This method each subitem one by one
  loadSubItem: function (subItem, key, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate) {
    return (
      <span className="list-group-item" style={subItemCss} key={key}>
        <Row>
          <Col>
            {this.loadAvatar_DisplayName(subItem, key, ellipsisText1, ellipsisText2)}
          </Col>
          <Col> <FaTrashAlt className="float-right" color="red" style={{ marginTop: 20, marginLeft: 10, marginRight: 20 }} onClick={() => { setItemId(subItem); toggleDanger() }} />
            <FaPen size={12} className="float-right" color="blue" style={{ marginTop: 20 }} onClick={() => handleUpdate(subItem)} />
          </Col>
        </Row>
        <br />
      </span>)
  }
}