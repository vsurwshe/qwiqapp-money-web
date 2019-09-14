import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody, Alert, Input, ListGroupItem, ListGroup, InputGroup, InputGroupAddon, InputGroupText, Button, FormGroup, Label } from "reactstrap";
import { FaSearch } from 'react-icons/fa';
import Loader from 'react-loader-spinner'
import CreateRecurringBill from "./CreateRecurringBill";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import LabelApi from "../../services/LabelApi";
import ContactApi from '../../services/ContactApi';
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import RecurringBillsApi from "../../services/RecurringBillsApi";
import '../../css/style.css';
import { DeleteModel } from "../utility/DeleteModel";
import DeleteRecurringBill from "./DeleteRecurringBill";
import UpdateRecurringBill from "./ UpdateRecurringBill";

class RecurringBills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recurBillsList: [],
      labels: [],
      categories: [],
      contacts: [],
      updateRecurBill: [],
      createRecurBillReq: false,
      updateRecurBillReq: false,
      deleteRecurBillReq: false,
      visible: false,
      dropdownOpen: [],
      hoverAccord: [],
      accordion: [],
      profileId: "",
      danger: false,
      onHover: false,
      spinner: false,
      selectedOption: '',
      searchName: false,
      deleteRecurBillId: null,
      removeDependents: true,
      profileType: 0
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile() !== null && Store.getProfile().length !== 0) {
      await this.setState({ profileId: Store.getProfile().id, profileType: Store.getProfile().type });
      console.log()
      if (this.state.profileType > 0) {
        this.getCategory();
      }
      
    }
  }

  getCategory = () => {
    new CategoryApi().getCategories(this.successCallCategory, this.errorCall, this.state.profileId);
  }

  // Categories response
  successCallCategory = async categories => {
    if (categories === []) {
      this.setState({ categories: [0] })
    } else {
      await this.setState({ categories: categories })
      await new RecurringBillsApi().getRecurringBills(this.successCallBill, this.errorCall, this.state.profileId);
    }
  };

  // recurBillsList response
  successCallBill = async recurBillsList => {
    if (recurBillsList === []) {
      this.setState({ recurBillsList: [0] })
    } else {
      await this.billsWithcategoryNameColor(recurBillsList);
      this.loadCollapse();
    }
  };
  // category name color append to recurBillsList
  billsWithcategoryNameColor = (recurBillsList) => {
    const prevState = recurBillsList;
    const state = prevState.map((bill, index) => {
      return { ...bill, categoryName: this.displayCategoryName(bill.categoryId) }
    });
    this.setState({ recurBillsList: state });
  }

  loadCollapse = async () => {
    await this.state.recurBillsList.map(labels => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        hoverAccord: [...prevState.hoverAccord, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
      }))
    });
    new LabelApi().getSublabels(this.successCallLabel, this.errorCall, this.state.profileId);
  }

  successCallLabel = async (label) => {
    if (this.state.spinner) {
      this.setState({ spinner: true })
    }
    if (label === []) {
      this.setState({ labels: [0] })
    } else {
      await this.setState({ labels: label });
      new ContactApi().getContacts(this.successCallContact, this.errorCall, this.state.profileId);
    }
  };

  successCallContact = async (contacts) => {
    this.setState({ spinner: true })
    if (contacts === []) {
      this.setState({ contacts: [0] })
    } else {
      await this.setState({ contacts });
    }
  };

  errorCall = (err) => { this.setState({ visible: true }) }

  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  //this method toggle recurring_bills tabIndex
  toggleAccordion = (tabIndex) => {
    const prevState = this.state.accordion;
    const state = prevState.map((value, index) => tabIndex === index ? !value : false);
    this.setState({ accordion: state });
  }

  toggleDropDown = (tabIndex) => {
    const prevState = this.state.dropdownOpen;
    const state = prevState.map((value, index) => tabIndex === index ? !value : false);
    this.setState({ dropdownOpen: state });
  }

  hoverAccordion = (keyIndex) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((value, index) => keyIndex === index ? !value : false);
    this.setState({ hoverAccord: state });
  }
  onHover = (e, keyIndex) => {
    this.setState({ onHover: true });
    this.hoverAccordion(keyIndex)
  }

  onHoverOff = (e, keyIndex) => {
    this.setState({ onHover: false });
    this.hoverAccordion(keyIndex)
  }


  handleCreateRecurBill = () => { this.setState({ createRecurBillReq: true }) }

  handleUpdateRecurBill = updateRecurBill => { this.setState({ updateRecurBillReq: true, updateRecurBill }) };

  handleDeleteRecurBill = () => { this.setState({ deleteRecurBillReq: true }) };

  searchSelected = (e) => { this.setState({ selectedOption: e.target.value }); }

  handleRemoveDependents = (event) => {
    this.setState({ removeDependents: !this.state.removeDependents })
  }

  searchingFor = (searchTerm) => {
    return function (bill) {
      return ((bill.description.toLowerCase() + bill.amount + bill.categoryName.name.toLowerCase()).includes(searchTerm.toLowerCase())) || !searchTerm
    }
  }

  render() {
    const { profileType ,recurBillsList, createRecurBillReq, updateRecurBillReq, deleteRecurBill, deleteRecurBillReq, visible, profileId, updateRecurBill, spinner, labels, categories, contacts } = this.state;
    let message = profileType === 0 ? "Your profile not support for recurring bills, any further information see in feature comparision table in create Profile " : "You haven't created any RecurringBills yet..."
    if (!profileId) {
      return <ProfileEmptyMessage />
    } else if (profileType === 0 ) {
      return <div>{ this.emptyRecurBills(message) }</div>
    }  else if (recurBillsList.length === 0 && !createRecurBillReq) {
      return <div>{!spinner ? this.loadLoader() : recurBillsList.length === 0 && !createRecurBillReq ? this.emptyRecurBills(message) : ""}</div>
    } else if (createRecurBillReq) {
      return <CreateRecurringBill profileId={profileId} label={labels} categories={categories} contacts={contacts} />
    } else if (updateRecurBillReq) {
      return <UpdateRecurringBill profileId={profileId} updateRecurBill={updateRecurBill} lables={labels} categories={categories} contacts={contacts} headerMessage="Recurring Bills" />
    } else if (deleteRecurBillReq) {
      return <DeleteRecurringBill recurBillId={deleteRecurBill.id} profileId={profileId} recurStatus={true} removeDependents={this.state.removeDependents} />
    } else {
      return <div>{this.displayRecurBills(visible, recurBillsList)}{this.state.danger && this.deleteRecurBillModel()}</div>
    }
  }

  loadHeader = () => {
    return <CardHeader>
      <Row>
        <Col sm={3} ><strong className="strong-text" >RecurringBills</strong></Col>
        <Col>
          {this.state.recurBillsList.length !== 0 &&
            <InputGroup>
              <Input placeholder="Search Recurring Bills....." onChange={this.searchSelected} />
              <InputGroupAddon addonType="append"> <InputGroupText><FaSearch /></InputGroupText></InputGroupAddon>
            </InputGroup>
          }
        </Col>
        <Col sm={3}>
          {this.state.profileType > 0 && <Button color="success" className="float-right" onClick={this.handleCreateRecurBill} > + Add </Button>}
        </Col>
      </Row>
    </CardHeader>
  }

  loadLoader = () => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center className="padding-top" >
          <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
        </center>
      </Card>
    </div>
  }

  // when recurring_bills is empty. 
  emptyRecurBills = (message) => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center className="padding-top" >
          <CardBody><h5><b>{message}</b></h5><br /></CardBody>
        </center>
      </Card>
    </div>
  }

  // Displays all the recurring_bills one by one
  displayRecurBills = (visible, recurBillsList) => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <div className="header-search">
          <h6><Alert isOpen={visible} color="danger">Unable to Process Request, Please try Again....</Alert></h6>
          {recurBillsList.filter(this.searchingFor(this.state.selectedOption)).map((recurbill, key) => { return this.singleRecurBill(recurbill, key); })}
        </div>
      </Card>
    </div>
  }

  // Show the Single RecurBill 
  singleRecurBill = (recurbill, key) => {
    return <ListGroup flush key={key} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, key)} onPointerLeave={(e) => this.onHoverOff(e, key)}>
      <ListGroupItem action>
        <Row>
          <Col sm={{ size: "auto" }} md={{ size: "auto" }} lg={{ size: "auto" }} xl={{ size: "auto" }} className="date-format" >
            <strong style={{ paddingBottom: 20 }}><center>{this.dateFormat(recurbill.billDate)}</center></strong>
          </Col>
          <Col >
            <Row className="text-link padding-left">{recurbill.description}</Row>
            <Row className="text-link padding-left" style={{ color: recurbill.categoryName.color }} ><b>{recurbill.categoryName.name}</b></Row>
          </Col>
          <Col className="float-right column-text ">
            {recurbill.amount < 0 ?
              <b className="text-color">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: recurbill.currency }).format(recurbill.amount)}
              </b> :
              <b className="bill-amount-color">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: recurbill.currency }).format(recurbill.amount)}
              </b>
            }
          </Col>
          <Col>{this.state.onHover && this.state.hoverAccord[key] ? this.loadDropDown(recurbill, key) : ''}</Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  }

  dateFormat = (userDate) => {
    let date = "" + userDate
    let dateString = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8)
    const finalDate = new Intl.DateTimeFormat('en-gb', { month: 'short', weekday: 'short', day: '2-digit' }).format(new Date(dateString));
    return finalDate;
  }

  displayCategoryName = (cid) => {
    const { categories } = this.state;
    var data = categories.filter(item => { return item.id === cid });
    if (data.length === 0) {
      categories.map(category => {
        if (Array.isArray(category.subCategories)) {
          category.subCategories.forEach(element => {
            if (element.id === cid) {
              data = { name: element.name, color: element.color === "" || element.color === null ? '#000000' : element.color };
              return data;
            }
          });
        }
        return 0
      })
      return data;
    } else {
      for (const value of data)
        return { name: value.name, color: value.color === '' || value.color === null ? '#000000' : value.color };
    }
  }

  setRecurBillId = (recurBill) => {
    this.setState({ deleteRecurBill: recurBill, recurBillDescription: recurBill.description });
  }

  //this Method loads Browser DropDown
  loadDropDown = (recurbill, key) => {
    return <span className="float-right" style={{ marginRight: 7, marginTop: 7 }}>
      <Button style={{ backgroundColor: "transparent", borderColor: 'green', color: "green", marginRight: 5, width: 77, padding: 2 }} onClick={() => { this.handleUpdateRecurBill(recurbill) }}> EDIT </Button> &nbsp;
        <Button style={{ backgroundColor: "transparent", borderColor: 'red', color: "red", width: 90, padding: 2 }} onClick={() => { this.setRecurBillId(recurbill); this.toggleDanger(); }}> REMOVE </Button>
    </span>
  }

  //this method calls the delete model
  deleteRecurBillModel = () => {
    const { deleteRecurBill } = this.state;
    let billName;
    if (deleteRecurBill.description) {
      billName = deleteRecurBill.description
    } else {
      billName = deleteRecurBill.categoryName.name;
    }
    return <DeleteModel danger={this.state.danger} toggleDanger={this.toggleDanger} headerMessage="Delete Recurring Bill"
      bodyMessage={billName} delete={this.handleDeleteRecurBill} cancel={this.toggleDanger} recurDeleteStatus={true} loadDeleteOptions={this.loadDeleteOptions}>recurring bill</DeleteModel>
  }


  loadDeleteOptions = () => {
    return <>
      <FormGroup check >
        <Label check>
          <Input type="radio" name="radio2" value="true" onChange={this.handleRemoveDependents} checked={this.state.removeDependents === true} />{' '}
          Delete this Recurring Bill along with the bill associated with it ?
          </Label>
        <Label check>
          <Input type="radio" name="radio2" value="false" onChange={this.handleRemoveDependents} checked={this.state.removeDependents === false} />{' '}
          Delete this Recurring Bill without deleting the associated bill ?
          </Label>
      </FormGroup>
    </>
  }

}
export default RecurringBills;