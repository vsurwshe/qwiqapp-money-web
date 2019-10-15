
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Alert, Table, FormGroup, Label, Input, UncontrolledDropdown, Button, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import Loader from 'react-loader-spinner';
import { FaUndoAlt } from 'react-icons/fa';
import BillForm from "./BillForm";
import BillApi from "../../services/BillApi";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import LabelApi from "../../services/LabelApi";
import DeleteBill from "./DeleteBill";
import ContactApi from '../../services/ContactApi';
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { DeleteModel } from "../utility/DeleteModel";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";
import Config from "../../data/Config";
import BillPayment from "./billPayment/ BillPayment";
import ViewPayment from "./billPayment/ViewPayment";
import PaymentApi from "../../services/PaymentApi";
import '../../css/style.css';

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
      profileId: "",
      danger: false,
      onHover: false,
      spinner: false,
      selectedOption: '',
      searchName: false,
      removeDependents: true,
      billPayments: [],
      paidAmount: 0,
      filter: false,
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  componentWillReceiveProps = () => {
    if (this.state.categories !== undefined && this.state.categories.length <= 0) {
      this.setProfileId();
    } else {
      this.props.match.params.value = undefined;
      this.successCallBill(Store.getBills());
    }

  }

  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id });
      // This condition checking whether api call first time or reptely 
      this.state.categories !== undefined && this.state.categories.length <= 0 ? this.getCategory() : this.forceUpdate();
    }
  }

  // This Method execute the Category API Call
  getCategory = () => {
    new CategoryApi().getCategories(this.successCallCategory, this.errorCall, this.state.profileId);
  }

  // Handle Categories response
  successCallCategory = async categories => {
    if (categories.length === 0 && this.state.categories !== undefined) {
      this.setState({ categories: undefined })
    } else {
      await this.setState({ categories: categories })
    }
    this.getLabel()
  };

  // This Method execute the Label API Call
  getLabel = async () => {
    new LabelApi().getSublabels(this.successCallLabel, this.errorCall, this.state.profileId);
  }

  // Handle Label response
  successCallLabel = async (label) => {
    this.setState({ spinner: true })
    if (label.length === 0 && this.state.labels !== undefined) {
      this.setState({ labels: undefined })
    } else {
      await this.setState({ labels: label });
    }
    this.getContacts();
  };

  // This Method execute the Contacts API Call
  getContacts = () => {
    new ContactApi().getContacts(this.successCallContact, this.errorCall, this.state.profileId);
  }

  // Handle Contacts response
  successCallContact = async (contacts) => {
    this.setState({ spinner: true })
    if (contacts.length === 0 && this.state.contacts !== undefined) {
      this.setState({ contacts: undefined })
    } else {
      await this.setState({ contacts });
    }
    this.getBills();
  };

  // This Method execute the Bill API Call
  getBills = async () => {
    if (this.props.paid) {
      await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId, "True");
    } else {
      await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId);
    }
  }

  // bills response
  successCallBill = async bills => {
    let newBills;
    const { value } = this.props.match.params
    if (bills.length === 0) {
      this.setState({ bills: [] })
    } else {
      if (value) {
        switch (value) {
          case "upcoming":
            newBills = bills.filter(bill => (!bill.paid && this.loadDateFormat(bill.dueDate_) >= new Date()));
            break;
          case "overdue":
            newBills = bills.filter(bill => (!bill.paid && this.loadDateFormat(bill.dueDate_) < new Date()));
            break;
          case "paid":
            newBills = bills.filter(bill => bill.paid);
            break;
          case "unpaid":
            newBills = bills.filter(bill => !bill.paid);
            break;
          default:
            newBills = bills;
            break;
        }
      }
      else {
        newBills = bills;
      }
      await this.billsWithcategoryNameColor(newBills);
    }
  }

  // category name color append to bills
  billsWithcategoryNameColor = (bills) => {
    let previousPayments = [];
    const prevState = bills;
    const state = prevState.map((bill, index) => {
      this.getPayments(bill.id, previousPayments)
      return { ...bill, categoryName: this.displayCategoryName(bill.categoryId) }
    });
    this.setState({ bills: state });
  }

  getPayments = async (billId, previousPayments) => {
    await new PaymentApi().getBillPayments((payments) => {
      let newRespData = {
        payments: payments,
        billId: billId
      }
      this.successCallPayments(newRespData, previousPayments)
    }, err => { console.log("error") }, this.state.profileId, billId)
  }

  successCallPayments = async (payments, previousPayments) => {
    previousPayments.push(payments)
    return await this.setState({ billPayments: previousPayments })
  }

  handleMarkAsUnPaid = () => {
    new BillApi().markAsUnPaid(this.successUnpaidBill, this.errorCall, this.state.profileId, this.state.requiredBill.id);
  }

  successUnpaidBill = () => { this.callAlertTimer("success", "Your bill succefully made as unpaid bill") }

  // This method handle Error Call of API 
  errorCall = (err) => {
    if (err.response && (err.response.status === 500 && err.response.data.error.debugMessage)) {
      this.setState({ visible: true, color: 'danger', content: 'Something went wrong, unable to fetch bills...' });
      setTimeout(() => {
        this.setState({ visible: false, spinner: true });
      }, Config.apiTimeoutMillis);
    } else {
      this.setState({ color: 'danger', content: 'Unable to Process Request, Please try Again....' });
    }
  }

  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  // This Method Execute the Bill Form Executions.
  createBillAction = () => { this.setState({ createBillRequest: true }) }
  updateBillAction = updateBill => { this.setState({ updateBillRequest: true, updateBill }) };
  deleteBillAction = () => { this.setState({ deleteBillRequest: true }) };

  setBillId = (bill) => {
    let data = {
      "deletBillDescription": bill.description,
      "deletBillCategoryName": bill.categoryName.name
    }
    this.setState({ id: bill.id, deleteBillName: data });
    this.toggleDanger();
  }

  callAlertTimer = (visible) => {
    if (visible) {
      setTimeout(() => {
        this.setState({ visible: false });
      }, Config.apiTimeoutMillis)
    }
  };

  handleRemoveDependents = () => { this.setState({ removeDependents: !this.state.removeDependents }); }

  handleShowPayment = (bill) => {
    let lastPaid = this.calculateLastPaid(bill);
    if (lastPaid) {
      this.setState({ requiredBill: bill, paidAmount: lastPaid.paidAmount });
    }
    this.setState({ requiredBill: bill });
  }

  handleAddPayment = () => {
    this.setState({ addPayment: true });
  }
  handleMarkAsPaid = () => { this.setState({ markPaid: true }); }
  handleViewPayment = () => { this.setState({ viewPayment: !this.state.viewPayment }); }
  handleMarkAsUnpaidPayment = () => { this.setState({ markAsUnPaid: true }) }

  calculateLastPaid = (bill) => {
    if (this.state.billPayments.length > 0) {
      // Filtering billpayments according to billId
      let filteredBillPayment = this.state.billPayments.filter(billPayment => billPayment.billId === bill.id);
      let paidAmount = bill.amount;
      if (filteredBillPayment && filteredBillPayment.length && filteredBillPayment[0].payments.length) {
        // Calculating the total paidAmount of all billpayments
        filteredBillPayment[0].payments.forEach((payment) => {
          paidAmount = paidAmount - (payment.amount);
        })
        let sortedPayment = filteredBillPayment[0].payments.sort((a, b) => (a.date > b.date ? -1 : 1))[0]
        let lastPaid = {
          payments: filteredBillPayment[0].payments, //  Getting payments list of a specific bill
          date: sortedPayment.date,  // Sorting and getting last payment date
          paymentAmt: sortedPayment.amount,  // Sorting and getting last payment amount
          paidAmount: paidAmount,   // setting the total paid amount
        }
        return lastPaid;
      }
    }
  }

  setBillsForFilter = (bill, filteredBills, id) => {
    let difference = new Date(ShowServiceComponent.customDate(bill.billDate)) - new Date(this.state.filterDate);
    let daysDifference = difference / (1000 * 60 * 60 * 24);
    if (daysDifference >= 0) {
      if (this.state.yearSelected) { // This for all the bills in current year
        let billDate = ShowServiceComponent.customDate(bill.billDate)
        let currentDate = new Date().getFullYear();
        if (new Date(billDate).getFullYear() === currentDate) {
          filteredBills.push(bill);
        }
      } else if (daysDifference === 0) { // This for all the bills of today
        filteredBills.push(bill);
      } else if (daysDifference <= this.state.filterValue) { // This for all the bills of last 7days (or) 30Days
        filteredBills.push(bill);
      }
    }
    return 0;
  }

  handleDateFilter = (dateFilter) => {
    let filterDate = new Date();
    switch (dateFilter) {
      case 7:
        filterDate.setDate(filterDate.getDate() - 7)
        this.setState({ filterValue: 7 });
        break;
      case 30:
        filterDate.setDate(filterDate.getDate() - 30)
        this.setState({ filterValue: 30 });
        break;
      case 'year':
        filterDate = new Date(filterDate.getFullYear(), 0, 1)
        this.setState({ yearSelected: true });
        break;
      case 'today':
        this.setState({ filterValue: 'today' });
        break;
      default:
        filterDate = null;
        break;
    }
    if (filterDate) {
      this.setState({ filterDate: ShowServiceComponent.loadDateFormat(filterDate) });
    } else {
      this.setState({ filterDate: '' });
    }
  }

  render() {
    const { bills, createBillRequest, updateBillRequest, id, deleteBillRequest, visible, profileId, updateBill, spinner, labels, categories, contacts, danger, paidAmount, requiredBill, markPaid } = this.state;
    if (!profileId) {
      return <ProfileEmptyMessage />
    } else if (bills.length === 0 && !createBillRequest) {  // Checks for bills not there and no bill create Request, then executes
      return <div>
        {/*  If spinner is true and bills are there, it shows the loader function, until bills are loaded */}
        {(spinner && bills.length !== 0) ? <>{visible && <Alert isOpen={visible} color={this.state.color}>{this.state.content}</Alert>} {this.loadLoader()}
        </> : bills.length === 0 && this.emptyBills() // If bills not there, it will show Empty message 
        }
      </div>
    } else if (createBillRequest) {
      return <BillForm pid={profileId} labels={labels} categories={categories} contacts={contacts} />
    } else if (updateBillRequest) {
      return <BillForm pid={profileId} bill={updateBill} labels={labels} categories={categories} contacts={contacts} />
    } else if (deleteBillRequest) {
      return <DeleteBill id={id} pid={profileId} removeDependents={this.state.removeDependents} />
    } else if (this.state.addPayment || this.state.markPaid) {
      return <BillPayment bill={requiredBill} markPaid={markPaid} paidAmount={paidAmount} profileId={profileId} />
    } else if (this.state.viewPayment) {
      return <ViewPayment bill={this.state.requiredBill} paidAmount={paidAmount} profileId={profileId} cancel={this.handleViewPayment} />
    } else {
      return <div>
        {this.displayAllBills(visible, bills)}{danger && this.deleteBillModel()}
        {this.state.markAsUnPaid && this.handleMarkAsUnPaid()}
      </div>
    }
  }

  searchSelected = (e) => {
    this.setState({ selectedOption: e.target.value });
  }

  searchingFor = (searchTerm) => {
    return function (bill) {
      return ((bill.description ? bill.description.toLowerCase() : '' + bill.amount + bill.categoryName.name ? bill.categoryName.name.toLowerCase() : '').includes(searchTerm.toLowerCase())) || !searchTerm
    }
  }

  loadHeader = (bills) => {
    return new ShowServiceComponent.loadHeaderWithSearch("BILLS", bills, this.searchSelected, "Search Bills.....", this.createBillAction, true, this.handleDateFilter);
  }

  loadLoader = () => <div className="animated fadeIn">
    <Card>
      {this.loadHeader("")}
      <center className="padding-top" >
        <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
      </center>
    </Card>
  </div>

  // when bills is empty. 
  emptyBills = () => <div className="animated fadeIn">
    <Card>
      {this.loadHeader("")}
      <center className="padding-top" >
        <CardBody><h5><b>You don't have any {this.props.match.params.value ? this.props.match.params.value : ' '} Bills ... </b></h5><br /></CardBody>
      </center>
    </Card>
  </div>

  // Displays all the Bills one by one
  displayAllBills = (visible, bills) => {
    const color = this.props.color;
    if (color) {
      this.callAlertTimer(visible)
    }
    let filteredBills = [];
    this.state.filterDate && bills.map((bill, id) => {
      return this.setBillsForFilter(bill, filteredBills, id);
    });
    return <div className="animated fadeIn">
      <Card>
        {this.state.filterDate ? (filteredBills.length ? this.loadHeader(filteredBills) : this.loadHeader()) : this.loadHeader(bills)}
        <br />
        <div className="header-search">
          <h6>{visible && <Alert isOpen={visible} color={color}>{this.props.content}</Alert>}</h6>
          <CardBody className="card-align">
            <Table striped frame="box" style={{ borderColor: "#DEE9F2" }}>
              <thead className="table-header-color" >
                <tr>
                  <th>Due Date</th>
                  <th>Bill Date</th>
                  <th>Description</th>
                  <th>Bill Amount</th>
                  <th>Status</th>
                  <th>Last Transcation</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.filterDate ? this.loadFilterAndNonFilteredBills(filteredBills) : this.loadFilterAndNonFilteredBills(bills)}
              </tbody>
            </Table>
          </CardBody>
        </div>
      </Card>
    </div>
  }

  loadFilterAndNonFilteredBills = (bills) => {
    return bills.filter(this.searchingFor(this.state.selectedOption)).map((bill, key) => {
      return this.loadSingleBill(bill, key);
    })
  }

  // Show the Single Bill 
  loadSingleBill = (bill, key) => {
    let strike = bill.paid
    let lastPaid = this.calculateLastPaid(bill, bill.amount);
    let billDescription = bill.description ? bill.description : bill.categoryName.name
    return <tr width={50} key={key}>
      <td>{strike ? <strike>{ShowServiceComponent.customDate(bill.dueDate_, true)}</strike> : ShowServiceComponent.customDate(bill.dueDate_, true)}</td>
      <td>{strike ? <strike> {ShowServiceComponent.customDate(bill.billDate, true)} </strike> : ShowServiceComponent.customDate(bill.billDate, true)}</td>
      <td>{strike ? <strike> {billDescription} </strike> : billDescription}</td>
      <td>{strike ? <strike>{this.handleSignedBillAmount(bill)}</strike> : this.handleSignedBillAmount(bill)}</td>
      <td style={{color: bill.paid ? 'green' : 'red'}}> {strike ? <strike>Paid</strike> : 'Unpaid' } </td>
      <td> {strike ? <strike>{this.loadPaidStatus(bill, lastPaid)} </strike> : <>{this.loadPaidStatus(bill, lastPaid)}</>} </td>
      <td><h6>{this.loadDropDown(bill, key)}</h6></td>
    </tr>
  }

  loadPaidStatus = (bill, lastPaid) => {
    return <>
      {lastPaid && <span style={{color:'#0080ff'}}>Last paid:  {ShowServiceComponent.billDateFormat(lastPaid.date)} &nbsp;&nbsp;
       {ShowServiceComponent.billTypeAmount(bill.currency, lastPaid.paymentAmt, true)}
      </span>}
    </>
  }

  handleSignedBillAmount = (bill) => {
    return bill.amount < 0 ? <span className="text-color"> -({ShowServiceComponent.billTypeAmount(bill.currency, bill.amount)})</span> : <span className="bill-amount-color">{ShowServiceComponent.billTypeAmount(bill.currency, bill.amount)}</span>
  }

  loadPaymentDateAndAmount = (bill, lastPaid) => {
    return <> <b>Last paid</b> {this.dateFormat(lastPaid.date)} &nbsp; {this.loadBillAmount(bill.currency, lastPaid.paymentAmt)} </>
  }

  loadBillAmount = (currency, amount) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount) }

  dateFormat = (userDate) => {
    let date = "" + userDate
    let dateString = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8)
    const formatDate = ShowServiceComponent.billDateFormat(new Date(dateString));
    return formatDate;
  }

  loadDateFormat = (dateParam) => {
    let toStr = "" + dateParam
    let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
    let date = new Date(dateString);
    return date;
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
  loadDropDown = (bill, key) => <span className="float-right" style={{ marginTop: -8, marginBottom: -9 }} >
    {bill.recurId ? <FaUndoAlt /> : ''} &nbsp;
      <Button className="rounded" style={{ backgroundColor: "transparent", borderColor: '#ada397', color: "green", width: 67 }} onClick={() => this.updateBillAction(bill)}>Edit</Button> &nbsp;
      <UncontrolledDropdown group>
        <DropdownToggle caret onClick={() => this.handleShowPayment(bill)}> More ... </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.handleAddPayment} >Add Payment</DropdownItem>
          <DropdownItem onClick={this.handleViewPayment}>View Payment</DropdownItem>
          {!bill.paid ? <DropdownItem onClick={this.handleMarkAsPaid}>Mark As Paid</DropdownItem> :
            <DropdownItem onClick={this.handleMarkAsUnpaidPayment}>Mark As Unpaid</DropdownItem>}
          <DropdownItem onClick={() => this.setBillId(bill)}>Delete</DropdownItem>
        </DropdownMenu>
    </UncontrolledDropdown>
  </span>

  //this method calls the delete model
  deleteBillModel = () => {
    let billDeleteItem = this.state.deleteBillName.deletBillDescription ? this.state.deleteBillName.deletBillDescription
      : this.state.deleteBillName.deletBillCategoryName;
    return <DeleteModel danger={this.state.danger} toggleDanger={this.toggleDanger} headerMessage="Delete Bill" bodyMessage={billDeleteItem}
      delete={this.deleteBillAction} cancel={this.toggleDanger} loadDeleteOptions={this.loadDeleteOptions}>bill</DeleteModel>
  }

  loadDeleteOptions = () => <FormGroup check >
    <Label check>
      <Input type="radio" name="radio2" value="true" onChange={this.handleRemoveDependents} checked={this.state.removeDependents === true} />
      Delete this Bill along with the Recurring bills associated with it ?
          </Label>
    <Label check>
      <Input type="radio" name="radio2" value="false" onChange={this.handleRemoveDependents} checked={this.state.removeDependents === false} />
      Delete this Bill without deleting the associated Recurring bills ?
          </Label>
  </FormGroup>
}

export default withRouter(Bills);