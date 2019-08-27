import React from 'react';
import { Card, CardHeader, CardBody, Col, Alert, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Collapse } from 'reactstrap';
import Loader from 'react-loader-spinner';
import Avatar from 'react-avatar';
import { FaSearch, FaAngleDown } from 'react-icons/fa';
import '../../css/style.css';

export const ReUseComponents = {

  loadDeleting: function (headerMsg, bodyMessage, color) {
    return (
      <div className="animated fadeIn">
        <Card>
          {headerMsg === "" ? "" : this.loadHeader(headerMsg)}
          <CardBody>
            <center>
              <Loader type="TailSpin" color={color} height={60} width={60} />
              <br /><br />
              <h5 style={{ color: 'green' }}>{bodyMessage}</h5>
            </center>
          </CardBody>
        </Card>
      </div>)
  },

  // Shows Header
  loadHeader: function (headerMessage) {
    return (<div className="padding">
      <center><strong> {headerMessage} </strong></center>
    </div>)
  },

  //Shows Spinner 
  loadSpinner: function (headerMessage) {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader(headerMessage)}
          <center className="padding-top">
            <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
          </center>
        </Card>
      </div>)
  },

  //Searches Items based on user given SearchTerm
  searchingFor: function (searchTerm) {
    return function (item) {
      let subItemName = '';
      if (item.childName !== null) {
        subItemName = subItemName + item.childName.map(item => item)
      }
      return (item.name.toLowerCase() + subItemName.toLowerCase()).includes(searchTerm.toLowerCase()) || !searchTerm
    }
  },

  //This method loads Dropdown when Ellipsis is clicked to Update/Delete
  loadDropDown: function (item, stateFun, toggleDanger, updateLabel) {
    return <span className="float-right"><Row>
      <Button style={{ backgroundColor: "transparent", color: "green" }} onClick={() => { updateLabel(item) }}> Edit</Button> &nbsp;
      <Button style={{ backgroundColor: "transparent", color: "red", marginRight: 10 }} onClick={() => { stateFun(item); toggleDanger(); }}> Remove </Button>
      </Row>
    </span>
  },

  loadHeaderWithSearch: function (headerMessage, items, setSearch, placeHolder, addItem) {
    return <CardHeader>
      <Row form>
        <Col className="marigin-top" >
          <strong>{items ? headerMessage + " : " + items.length : headerMessage}</strong>
        </Col>
        {(items && items.length) &&
          <Col md={7} className="shadow p-0 mb-3 bg-white rounded">
            <InputGroup>
              <Input type="search" className="float-right" style={{ width: '20%' }} onChange={e => setSearch(e)} placeholder={placeHolder} />
              <InputGroupAddon addonType="append">
                <InputGroupText className="dark"><FaSearch /></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>}
        <Col >
          <Button color="success" className="float-right" onClick={addItem}> + ADD </Button>
        </Col>
      </Row>
    </CardHeader>
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
    return <div className="animated fadeIn">
        <Card>
          {this.loadHeaderWithSearch(itemType, items, setSearch, placeHolder, addItem)}
          <div className="margin" >
            {visible && <Alert color={color}>{content}</Alert>}
            {items.filter(this.searchingFor(search)).map((singleItem, key) => { return this.loadSingleItem(singleItem, key, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion) })} </div>
        </Card>
      </div>
  },

  //This method loads Single Items One by One
  loadSingleItem: function (singleItem, ukey, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion) {
    const ellipsisText1 = { flex: 1, display: 'flex', alignItems: 'center', marginLeft: '-10' }
    const ellipsisText2 = { flex: 1, width: '100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingLeft: 10 }
    const subItemCss = { marginLeft: 50, paddingTop: 4, paddingBottom: 0, paddingLeft: 5, height: 50 };
    return (
      <div className="list-group" key={ukey}>
        <div className="list-group-item" style={{ paddingTop: 1, padding: 7 }}>
         <Row onMouseEnter={() => { dropDownAccordion(ukey) }} onMouseLeave={() => { dropDownAccordion(ukey) }}>
              <Col>
                {this.loadAvatar_DisplayName(singleItem, ukey, ellipsisText1, ellipsisText2, toggleAccordion)}
              </Col>
              <Col className="float-right" >
                {stateDrodownAccord[ukey] && this.loadDropDown(singleItem, setItemId, toggleDanger, handleUpdate)}
              </Col>
         </Row>
          </div>
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
    return <>
      <Avatar name={singleItem.name.charAt(0)} color={!singleItem.color ? '#000000' : singleItem.color} size="40" square={true} />
      <div style={ellipsisText2}>&nbsp;&nbsp;{singleItem.name}
        {(singleItem.subCategories || singleItem.subLabels) && <span><FaAngleDown style={{ marginLeft: 8 }} onClick={() => { toggleAccordion(ukey) }} /></span>}
      </div>
    </>
  },

  //This method displays subItems 
  loadCollapse: function (singleItem, ukey, accordion, setItemId, toggleDanger, handleUpdate, subItemCss, ellipsisText1, ellipsisText2, toggleAccordion) {
    return <Collapse isOpen={accordion[ukey]}>
        {singleItem.subCategories ? (singleItem.subCategories ? singleItem.subCategories.map((subCategory, subKey) => { return this.loadSubItem(subCategory, subKey, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate, toggleAccordion) }) : "")
          : (singleItem.subLabels ? (singleItem.subLabels ? singleItem.subLabels.map((subLabel, subKey) => { return this.loadSubItem(subLabel, subKey, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate, toggleAccordion) }) : "") : "")}
      </Collapse>
  },

  // This method each subitem one by one
  loadSubItem: function (subItem, key, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate) {
    return <span className="list-group-item" style={subItemCss} key={key}>
        <Row>
          <Col>
            {this.loadAvatar_DisplayName(subItem, key, ellipsisText1, ellipsisText2)}
          </Col>
          <Col>
            <Row className="float-right">
              <Button style={{ backgroundColor: "transparent", color: "green" }} onClick={() => { handleUpdate(subItem) }}> Edit</Button> &nbsp;
              <Button style={{ backgroundColor: "transparent", color: "red" }} onClick={() => { setItemId(subItem); toggleDanger() }}> Remove </Button>
            </Row>
          </Col>
        </Row>
        <br />
      </span>
  }
}
