
import React from 'react';
import { Card, CardHeader, CardBody, Col, Alert, Row, Button, Collapse } from 'reactstrap';
import Avatar from 'react-avatar';
import { FaAngleDown } from 'react-icons/fa';
import Config from '../../data/Config';
import '../../css/style.css';

export const ShowServiceComponent = {
  loadDeleting: function (headerMsg, bodyMessage) {
    return (
      <div className="animated fadeIn">
        <Card>
          {headerMsg && this.loadHeaderAction(headerMsg)}
          <CardBody>
            <center>
              {this.loadBootstrapSpinner()}
              <br /><br />
              <h5 >{bodyMessage}</h5>
            </center>
          </CardBody>
        </Card>
      </div>)
  },

  // Shows Header
  loadHeader: function (headerMessage) {
    return <div className="padding">
      <center><strong> {headerMessage} </strong></center>
    </div>
  },

  //Shows Spinner 
  loadSpinner: function (headerMessage, color, message, spinnerOff) {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeaderAction(headerMessage)}
          <center className="padding-top">
            <CardBody>
              {!spinnerOff ? this.loadBootstrapSpinner() : this.loadAlert(color, message)}
            </CardBody>
          </center>
        </Card>
      </div>)
  },

  loadBootstrapSpinner: function () { // Block is for code reduce purpose (Spinner)
    return <div className="text-primary spinner-size" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  },
  
  loadAlert: function (color, message) { // Block is for code reduce purpose (Alert)
    return <Alert color={color}>{message}</Alert>
  },

  loadHeaderAction: function (headerMessage, addButtonHandler, buttonText)  { // Block is for code reduce purpose (Header with button )
    return (
     <CardHeader ><strong> {headerMessage} </strong>
        {addButtonHandler && <Button color="success" className="float-right" onClick={addButtonHandler}>{buttonText}</Button>}
      </CardHeader>)
  },

  handleSpinner: function (visible) {
    let data = false;
    if (visible) {
      setTimeout(()=>{
        data = true;
      }, Config.apiTimeoutMillis);
    } 
    return data;
  }, 

  loadSpinnerAction: function (headerMessage, alertMessage, addButtonHandler, buttonText, visible) {
    let spinnerOff = this.handleSpinner(visible);
    return (
      <div className="animated fadeIn">
        <Card>
        {this.loadHeaderAction(headerMessage, addButtonHandler, buttonText)}
          <center>
            <CardBody>
              {visible && this.loadAlert("danger", alertMessage)}
              {spinnerOff && this.loadBootstrapSpinner()}
            </CardBody>
          </center>
        </Card>
      </div>)
  },

  //Searches Items based on user given SearchTerm
  searchingFor: function (searchTerm) {
    const searchQuery=searchTerm.toLowerCase();
    return function (item) {
      let subItemName = '';
      if (item.childName) {
        subItemName = subItemName + item.childName.map(item => item);
      } 
        return item.name ? (item.name.toLowerCase().includes(searchQuery)):'' | subItemName ? (subItemName.toLowerCase().includes(searchQuery)):''    
    }
  },

  //This method loads Dropdown when Ellipsis is clicked to Update/Delete
  loadDropDown: function (item, stateFun, toggleDanger, updateLabel) {
    return <>
      <span>
        {item.subCategories && <span className="padding-top" ><b>SubCategories: {item.subCategories.length}</b></span>}
        {item.subLabels && <b>SubLabels: {item.subLabels.length}</b>}</span>
      <span className="float-right" style={{ marginRight: 7, marginTop: -3 }}>
        <Button style={{ backgroundColor: "transparent", borderColor: 'green', color: "green", marginRight: 5, width: 77, padding: 2 }} onClick={() => { updateLabel(item) }}> EDIT </Button> &nbsp;
        <Button style={{ backgroundColor: "transparent", borderColor: 'red', color: "red", width: 90, padding: 2 }} onClick={() => { stateFun(item); toggleDanger(); }}> REMOVE </Button>
      </span></>
  },

  loadHeaderWithSearch: function (headerMessage, items, setSearch, placeHolder, addItem) {
    return <CardHeader style={{height: 60}}>
      <Row form>
        <Col className="marigin-top" >
          <strong>{items ? headerMessage + " : " + items.length : headerMessage}</strong>
        </Col>
        {/* {(items && items.length) &&
          <Col md={7} className="shadow p-0 mb-3 bg-white rounded">
            <InputGroup>
              <Input type="search" className="float-right" style={{ width: '20%' }} onChange={e => setSearch(e)} placeholder={placeHolder} />
              <InputGroupAddon addonType="append">
              </InputGroupAddon>
            </InputGroup>
          </Col>} */}
        <Col>
          <Button color="success" className="float-right" onClick={addItem}> + ADD </Button>
        </Col>
      </Row>
    </CardHeader>
  },
  
  customDate: function (dateParam, monWeekDay, monWeekDayYear) {
    let toStr = "" + dateParam
    let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
    if (monWeekDay) {
      return this.billDateFormat(new Date(dateString));
    } else if (monWeekDayYear) {
      return this.billDataTableDateFormat(new Date(dateString));
    } else {
      return this.loadDateFormat(new Date(dateString));
    }
  },

  // date format like ex: DD/MM/YYYY
  loadDateFormat: function (date) {
    return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  },

 // this method return formate date like ex: Mon, 03 DeC
  billDateFormat: function (date) {
    return new Intl.DateTimeFormat('en-gb', { month: 'short', weekday: 'short', day: '2-digit'}).format(date); 
  },

  billDataTableDateFormat: function (date) {
    return new Intl.DateTimeFormat('en-gb', { month: 'short', weekday: 'short', day: '2-digit', year: 'numeric' }).format(date); 
  },

  billTypeAmount: function (currency, amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount>0 ? amount : -(amount))
  },

  handleTax: function (amount, taxPercent, taxAmount) {
    let result = {
      "taxPercent": 0,
      "taxAmount": 0
    };
    if (amount && taxPercent) {
      result.taxAmount = (taxPercent * amount) / 100;
      result.taxPercent = taxPercent;
    } else if (amount && taxAmount) {
      result.taxPercent = (taxAmount * 100) / (amount - taxAmount);
      result.taxAmount = taxAmount;
    }
    return result;
  },

  //This method Shows Categories/labels as Items
  loadItems: function (itemType, items, setSearch, search, addItem, visible, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion, color, content, subArray, subItemAccordion) {
    let placeHolder = "Search " + itemType + "..."
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeaderWithSearch(itemType, items, setSearch, placeHolder, addItem)}
        <div className="margin" >
          {visible && this.loadAlert(color, content)}
          {items.filter(this.searchingFor(search)).map((singleItem, key) => { return this.loadSingleItem(singleItem, key, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion, subArray, subItemAccordion) })} </div>
      </Card>
    </div>
  },

  //This method loads Single Items One by One
  loadSingleItem: function (singleItem, ukey, toggleAccordion, accordion, setItemId, toggleDanger, handleUpdate, stateDrodownAccord, dropDownAccordion, subArray, subItemAccordion) {
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
            <Col style={{ paddingTop: 10 }}>
              {stateDrodownAccord[ukey] && this.loadDropDown(singleItem, setItemId, toggleDanger, handleUpdate)}
            </Col>
          </Row>
        </div>
        <div style={{ marginBottom: 1.5 }} />
        {this.loadCollapse(singleItem, ukey, accordion, setItemId, toggleDanger, handleUpdate, subItemCss, ellipsisText1, ellipsisText2, toggleAccordion, subArray, subItemAccordion)}
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
  loadCollapse: function (singleItem, ukey, accordion, setItemId, toggleDanger, handleUpdate, subItemCss, ellipsisText1, ellipsisText2, toggleAccordion, subArray, subItemAccordion) {
    return <Collapse isOpen={accordion[ukey]}>
      {singleItem.subCategories ? (singleItem.subCategories ? singleItem.subCategories.map((subCategory, subKey) => { return this.loadSubItem(subCategory, subKey, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate, subArray, subItemAccordion) }) : "")
        : (singleItem.subLabels ? (singleItem.subLabels ? singleItem.subLabels.map((subLabel, subKey) => { return this.loadSubItem(subLabel, subKey, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate, subArray, subItemAccordion) }) : "") : "")}
    </Collapse>
  },

  // This method each subitem one by one
  loadSubItem: function (subItem, key, subItemCss, ellipsisText1, ellipsisText2, setItemId, toggleDanger, handleUpdate, subArray, subItemAccordion) {
    return <span className="list-group-item" style={subItemCss} key={key}>
      <Row onMouseEnter={() => subItemAccordion(key)} onMouseLeave={() => subItemAccordion(key)}>
        <Col>
          {this.loadAvatar_DisplayName(subItem, key, ellipsisText1, ellipsisText2)}
        </Col>
        <Col>
          <Row className="float-right" style={{ paddingTop: 7, paddingRight: 7 }} >
            {subArray[key] && <> <Button style={{ backgroundColor: "transparent", borderColor: 'green', color: "green", marginRight: 5, width: 77, padding: 2 }} onClick={() => { handleUpdate(subItem) }}> Edit</Button> &nbsp;
            <Button style={{ backgroundColor: "transparent", borderColor: 'red', color: "red", width: 90, padding: 2 }} onClick={() => { setItemId(subItem); toggleDanger() }}> Remove </Button></>}
          </Row>
        </Col>
      </Row>
      <br />
    </span>
  }
}