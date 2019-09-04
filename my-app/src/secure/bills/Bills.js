import React, { Component } from "react";
import { Row, Col, Card, CardBody, Alert, ListGroupItem, ListGroup, Button } from "reactstrap";
import Loader from 'react-loader-spinner'
import UpdateBill from "./UpdateBill";
import CreateBill from "./CreateBill";
import BillApi from "../../services/BillApi";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import LabelApi from "../../services/LabelApi";
import DeleteBill from "./DeleteBill";
import ContactApi from '../../services/ContactApi';
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { DeleteModel } from "../utility/DeleteModel";
import { ReUseComponents } from "../utility/ReUseComponents";
import '../../css/style.css';
import Config from "../../data/Config";

class Bills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: [],
      labels: [],
      categories: [],
      contacts: [],
      updateBill: [],
      createBillRequest: false,
      updateBillRequest: false,
      deleteBillRequest: false,
      visible: props.visible,
      dropdownOpen: [],
      hoverAccord: [],
      accordion: [],
      profileId: "",
      danger: false,
      onHover: false,
      spinner: false,
      selectedOption: '',
      searchName: false,
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id });
      this.getCategory();
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
      await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId);
    }
  };

  // bills response
  successCallBill = async bill => {
    if (bill === []) {
      this.setState({ bills: [0] })
    } else {
      await this.billsWithcategoryNameColor(bill);
      this.loadCollapse();
    }
  };

  // category name color append to bills
  billsWithcategoryNameColor = (bills) => {
    const prevState = bills;
    const state = prevState.map((bill, index) => {
      return { ...bill, categoryName: this.displayCategoryName(bill.categoryId) }
    });
    this.setState({ bills: state });
  }

  loadCollapse = async () => {
    await this.state.bills.map(labels => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        hoverAccord: [...prevState.hoverAccord, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
      }))
    });
    new LabelApi().getSublabels(this.successCallLabel, this.errorCall, this.state.profileId);
  }

  successCallLabel = async (label) => {
    this.setState({ spinner: true })
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

  errorCall = (err) => { this.setState({ color:'danger', content:'Unable to Process Request, Please try Again....' }) }

  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  createBillAction = () => { this.setState({ createBillRequest: true }) }

  updateBillAction = updateBill => {
    this.setState({ updateBillRequest: true, updateBill })
  };

  deleteBillAction = () => {
    this.setState({ deleteBillRequest: true })
  };

  //this method toggle Bills tabIndex
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

  setBillId = (bill) => {
    let data = {
      "deletBillDescription": bill.description,
      "deletBillCategoryName": bill.categoryName.name      
    }
    this.setState({ id: bill.id, deleteBillName: data});
  }

  callAlertTimer = (visible) => {
    if (visible) {
      setTimeout(() => {
        this.setState({ visible: false });
      }, Config.apiTimeoutMillis)
    }
  };

  render() {
    const { bills, createBillRequest, updateBillRequest, id, deleteBillRequest, visible, profileId, updateBill, spinner, labels, categories, contacts, danger } = this.state;
    if (!profileId) {
      return <ProfileEmptyMessage />
    } else if (bills.length === 0 && !createBillRequest) {
      return <div>{!spinner ? this.loadLoader() : bills.length === 0 && !createBillRequest ? this.emptyBills() : ""}</div>
    } else if (createBillRequest) {
      return <CreateBill pid={profileId} label={labels} categories={categories} contacts={contacts} />
    } else if (updateBillRequest) {
      return <UpdateBill pid={profileId} bill={updateBill} lables={labels} categories={categories} contacts={contacts} />
    } else if (deleteBillRequest) {
      return <DeleteBill id={id} pid={profileId} />
    } else {
      return <div>{this.displayAllBills( visible, bills )}{danger && this.deleteBillModel()}</div>
    }
  }

  searchSelected = (e) => {
    this.setState({ selectedOption: e.target.value });
  }

  searchingFor = (searchTerm) => {
    return function (bill) {
      return ((bill.description.toLowerCase() + bill.amount + bill.categoryName.name.toLowerCase()).includes(searchTerm.toLowerCase())) || !searchTerm
    }
  }

  loadHeader = (bills) => {
    return new ReUseComponents.loadHeaderWithSearch("BILLS", bills, this.searchSelected, "Search Bills.....", this.createBillAction);
  }

  loadLoader = () => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader("")}
        <center className="padding-top" >
          <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
        </center>
      </Card>
    </div>
  }

  // when bills is empty. 
  emptyBills = () => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader("")}
        <center className="padding-top" >
          <CardBody><h5><b>You haven't created any Bills yet... </b></h5><br /></CardBody>
        </center>
      </Card>
    </div>
  }

  // Displays all the Bills one by one
  displayAllBills = ( visible, bills ) => {
    const color = this.props.color;
    if(color){
      this.callAlertTimer(visible)
    }
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader(bills)}
        <br />
        <div className="header-search">
          <h6>{visible && <Alert isOpen={visible} color={color}>{this.props.content}</Alert>}</h6>
          {bills.filter(this.searchingFor(this.state.selectedOption)).map((bill, key) => { return this.loadSingleBill(bill, key); })}
        </div>
      </Card>
    </div>
  }

  // Show the Single Bill 
  loadSingleBill = (bill, key) => {
    return <ListGroup flush key={key} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, key)} onPointerLeave={(e) => this.onHoverOff(e, key)} style={{ paddingLeft: 10, paddingRight: 10 }}>
      <ListGroupItem action>
        <Row>
          <Col sm={{ size: 'auto', offset: 0 }} lg={1} className="date-format" >
            <strong className="date-formate"><center>{this.dateFormat(bill.billDate)}</center></strong>
          </Col>
          <Col sm={5}>
            {bill.description ? 
              <><Row className="text-link padding-left">{bill.description}</Row>
                <Row className="text-link padding-left" style={{ color: bill.categoryName.color }} ><b>{bill.categoryName.name}</b></Row>
              </> :
              <><Row className="text-link padding-left"><p></p></Row>
              <Row className="text-link padding-left" style={{ color: bill.categoryName.color, paddingBottom: 3 }} ><b>{bill.categoryName.name}</b></Row>
            </>}
          </Col>
          <Col className="column-text ">
            {bill.amount > 0 ?
              <b className="float-right bill-amount-color">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: bill.currency }).format(bill.amount)}
              </b> :
              <b className="float-right text-color">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: bill.currency }).format(bill.amount)}
              </b>
            }
          </Col>
          <Col>{this.state.onHover && this.state.hoverAccord[key] ? this.loadDropDown(bill, key) : ''}</Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  }

  dateFormat = (userDate) => {
    let sd = userDate.toString().split('');
    let year = sd[0] + sd[1] + sd[2] + sd[3];
    let month = sd[4] + sd[5];
    let day = sd[6] + sd[7];
    var date = new Date(year, month, day);
    const finalDate = new Intl.DateTimeFormat('en-gb', { month: 'short', weekday: 'short', day: '2-digit' }).format(date);
    return finalDate;
  }

  displayCategoryName = (categoryId) => {
    const { categories } = this.state;
    var data = categories.filter(item => { return item.id === categoryId });
    if (data.length === 0) {
      categories.map(category => {
        if (Array.isArray(category.subCategories)) {
          category.subCategories.forEach(subCategory => {
            if (subCategory.id === categoryId) {
              data = { name: subCategory.name, color: !subCategory.color ? '#000000' : subCategory.color };
              return data;
            }
          });
        }
        return 0;
      })
      return data;
    } else {
      for (const value of data)
        return { name: value.name, color: !value.color ? '#000000' : value.color };
    }
  }

  //this Method loads Browser DropDown
  loadDropDown = (bill, key) => {
   return  <span className="float-right" style={{ marginRight: 7, marginTop: 7 }}>
        <Button style={{ backgroundColor: "transparent", borderColor: 'green', color: "green", marginRight: 5, width: 77, padding: 2 }} onClick={() => {this.updateBillAction(bill) }}> EDIT </Button> &nbsp;
      <Button style={{ backgroundColor: "transparent", borderColor: 'red', color: "red", width: 90, padding: 2 }} onClick={() => {this.setBillId(bill); this.toggleDanger(); }}> REMOVE </Button>
      </span>
    // return new ReUseComponents.loadDropDown(bill, this.setBillId, this.toggleDanger, this.updateBillAction);
  }

  //this method calls the delete model
  deleteBillModel = () => {
   let billDeleteItem = this.state.deleteBillName.deletBillDescription ? this.state.deleteBillName.deletBillDescription
                                                                      : this.state.deleteBillName.deletBillCategoryName;
    return <DeleteModel danger={this.state.danger} toggleDanger={this.toggleDanger} headerMessage="Delete Bill" bodyMessage={billDeleteItem}
        delete={this.deleteBillAction} cancel={this.toggleDanger} >bill</DeleteModel>
  }
}
export default Bills;