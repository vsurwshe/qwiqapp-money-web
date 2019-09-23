import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Alert, Table, FormGroup, Label, Input } from "reactstrap";
import Loader from 'react-loader-spinner';
import BillForm from "./BillForm";
import BillApi from "../../services/BillApi";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import LabelApi from "../../services/LabelApi";
import DeleteBill from "./DeleteBill";
import ContactApi from '../../services/ContactApi';
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { DeleteModel } from "../utility/DeleteModel";
import { ShowServiceComponet } from "../utility/ShowServiceComponet";
import '../../css/style.css';
import Config from "../../data/Config";
import BillPayment from "./billPayment/ BillPayment";
import ViewPayment from "./billPayment/ViewPayment";
import PaymentApi from "../../services/PaymentApi";

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
      showPaymentOptions: false,
      billPayments: [],
      paidAmount: 0
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  componentWillReceiveProps = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id });
      // This condition checking whether api call first time or reptely 
      this.state.categories !== undefined && this.state.categories.length <= 0 ? this.getCategory(): this.forceUpdate();
    }
  }

  // This Method execute the Category API Call
  getCategory = () => {
    new CategoryApi().getCategories(this.successCallCategory, this.errorCall, this.state.profileId);
  }

  // Handle Categories response
  successCallCategory = async categories => {
    if (categories.length === 0 && this.state.categories !== undefined) {
      this.setState({ categories: undefined})
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
    if (label.length === 0 &&  this.state.labels !== undefined) {
      this.setState({ labels: undefined })
    } else {
      await this.setState({ labels: label });
    }
    this.getContacts();
  };

  // This Method execute the Contacts API Call
  getContacts=()=>{
    new ContactApi().getContacts(this.successCallContact, this.errorCall, this.state.profileId);
  }

  // Handle Contacts response
  successCallContact = async (contacts) => {
    this.setState({ spinner: true })
    if (contacts.length === 0 && this.state.contacts !== undefined ) {
      this.setState({ contacts: undefined })
    } else {
      await this.setState({ contacts });
    }
    this.getBills();
  };

  // This Method execute the Bill API Call
  getBills= async ()=>{
    if (this.props.paid) {
      await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId, "True");
    }else{
      await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId);
    }
  }

  // bills response
  successCallBill = async bills => {
    let newBills;
    const { value } = this.props.match.params
    if (bills.length === 0) {
      this.setState({ bills: [] })
    }
    else {
      if (value) {
        switch (value) {
          case "upcoming":
            newBills = bills.filter(bill => this.loadDateFormat(bill.dueDate_) >= new Date());
            break;
          case "overdue":
            newBills = bills.filter(bill => this.loadDateFormat(bill.dueDate_) < new Date());
            break;
          case "paid":
            newBills = bills.filter(bill => bill.paid === true);
            break;
          case "unpaid":
            newBills = bills.filter(bill => bill.paid === false);
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
  
  successUnpaidBill = ()=>{this.callAlertTimer("success", "Your bill succefully made as unpaid bill")}

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
  updateBillAction = updateBill => { this.setState({ updateBillRequest: true, updateBill })};
  deleteBillAction = () => { this.setState({ deleteBillRequest: true })};

  setBillId = (bill) => {
    let data = {
      "deletBillDescription": bill.description,
      "deletBillCategoryName": bill.categoryName.name
    }
    this.setState({ id: bill.id, deleteBillName: data });
  }

  callAlertTimer = (visible) => {
    if (visible) {
      setTimeout(() => {
        this.setState({ visible: false });
      }, Config.apiTimeoutMillis)
    }
  };

  handleRemoveDependents = () => { this.setState({ removeDependents: !this.state.removeDependents });}

  handleShowPayment = (bill) => {
    let lastPaid = this.calculateLastPaid(bill);
    if (lastPaid) {
      this.setState({ showPaymentOptions: !this.state.showPaymentOptions, requiredBill: bill, paidAmount: lastPaid.paidAmount });
    }
    this.setState({ showPaymentOptions: !this.state.showPaymentOptions, requiredBill: bill });
  }

  handleAddPayment = () => { this.setState({ addPayment: true }); }
  handleMarkAsPaid = () => { this.setState({ markPaid: true }); }
  handleViewPayment = () => { this.setState({ viewPayment: !this.state.viewPayment, showPaymentOptions: false }); }
  handleMarkAsUnpaidPayment = () => { this.setState({markAsUnPaid: true, showPaymentOptions: false }) }

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

  render() {
    const { bills, createBillRequest, updateBillRequest, id, deleteBillRequest, visible, profileId, updateBill, spinner, labels, categories, contacts, danger, paidAmount, requiredBill, markPaid } = this.state;
    if (!profileId) {
      return <ProfileEmptyMessage />
    } else if (bills.length === 0 && !createBillRequest) {  // Checks for bills not there and no bill create Request, then executes
      return <div>
        {/*  If spinner is true and bills are there, it shows the loader function, until bills are loaded */}
        {(spinner && bills.length !== 0) ? <>{visible && <Alert isOpen={visible} color={this.state.color}>{this.state.content}</Alert>} {this.loadLoader()} 
               </>:bills.length === 0 && this.emptyBills() // If bills not there, it will show Empty message 
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
      return <div>{this.displayAllBills(visible, bills)}{danger && this.deleteBillModel()}{this.state.showPaymentOptions && this.loadPaymentModel()} {this.state.markAsUnPaid && this.handleMarkAsUnPaid()} </div>
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
    return new ShowServiceComponet.loadHeaderWithSearch("BILLS", bills, this.searchSelected, "Search Bills.....", this.createBillAction);
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
          <CardBody><h5><b>You don't have any {this.props.match.params.value ? this.props.match.params.value : ' '} Bills ... </b></h5><br /></CardBody>
        </center>
      </Card>
    </div>
  }
  
  // Displays all the Bills one by one
  displayAllBills = (visible, bills) => {
    const color = this.props.color;
    if (color) {
      this.callAlertTimer(visible)
    }
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader(bills)}
        <br />
        <div className="header-search">
          <h6>{visible && <Alert isOpen={visible} color={color}>{this.props.content}</Alert>}</h6>
          <CardBody className="card-align">
            <Table frame="box" style={{ borderColor: "#DEE9F2" }}>
              <thead className="table-header-color" >
                <tr>
                  <th>Due On</th>
                  <th>Bill Date</th>
                  <th>Description</th>
                  <th>Bill Amount</th>
                  <th>Paid Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bills.filter(this.searchingFor(this.state.selectedOption)).map((bill, key) => {
                  return this.loadSingleBill(bill, key);
                })}
              </tbody>
            </Table>
          </CardBody>
        </div>
      </Card>
    </div>
  }

  // Show the Single Bill 
  loadSingleBill = (bill, key) => {
    let strike = bill.paid
    let lastPaid = this.calculateLastPaid(bill, bill.amount);
    let billDescription = bill.description ? bill.description : bill.categoryName.name
    return <tr width={50} key={key}>
      <td>{strike ? <strike>{this.dateFormat(bill.dueDate_)}</strike>: this.dateFormat(bill.dueDate_)}</td>
      <td>{strike ? <strike> {this.dateFormat(bill.billDate)} </strike> : this.dateFormat(bill.billDate)}</td>
      <td>{strike ? <strike> {billDescription} </strike> : billDescription}</td>
      <td>{bill.amount > 0 ?
        <b className="bill-amount-color">
          {strike ? <strike>{this.loadBillAmount(bill.currency, bill.amount)}</strike> : this.loadBillAmount(bill.currency, bill.amount)}
        </b> :
        <b className="text-color">
          {strike ? <strike>{this.loadBillAmount(bill.currency, bill.amount)}</strike> : this.loadBillAmount(bill.currency, bill.amount)}
        </b>
      }</td>
      <td>
        {lastPaid ?
          <h6 className="bill-amount-color">
            {strike ? <strike> {this.loadPaymentDateAndAmount(bill, lastPaid)} </strike> : this.loadPaymentDateAndAmount(bill, lastPaid)}
          </h6> : ''
        }
      </td>
      <td><h6>{this.loadDropDown(bill, key)}</h6></td>
    </tr>
  }


  loadPaymentDateAndAmount = (bill, lastPaid) => {
    return <> <b>Last paid</b> {this.dateFormat(lastPaid.date)} &nbsp; { this.loadBillAmount(bill.currency, lastPaid.paymentAmt)} </>
  }

  loadBillAmount = (currency, amount) => { return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount) }

  dateFormat = (userDate) => {
    let date = "" + userDate
    let dateString = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8)
    const formatDate = new Intl.DateTimeFormat('en-gb', { month: 'short', weekday: 'short', day: '2-digit' }).format(new Date(dateString));
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
  loadDropDown = (bill, key) => {
    return <span className="float-right" style={{marginTop: 4}} >
      {ShowServiceComponet.loadEditRemoveButtons(bill, this.updateBillAction, this.setBillId, this.toggleDanger)}     
    </span>
  }

  loadPaymentModel = () => {
    return <Modal isOpen={this.state.showPaymentOptions} toggle={this.handleShowPayment} style={{ paddingTop: "20%" }} backdrop={true}>
      <ModalHeader toggle={this.handleShowPayment}>Payments {this.state.requiredBill.id}</ModalHeader>
      <ModalBody>
        <FormGroup check >
          <Label check>
            <Input type="radio" name="radio2" value="true" onChange={this.handleAddPayment} checked={this.state.addPayment} />
            Add Payment
          </Label> <br />
        {this.state.requiredBill.paid ? <Label check>
            <Input type="checkbox" name="radio2" value="false" onChange={this.handleMarkAsUnpaidPayment} checked={this.state.markAsPaid} />
            Mark As unPaid
          </Label>
          : <Label check>
          <Input type="radio" name="radio2" value="false" onChange={this.handleMarkAsPaid} checked={this.state.markPaid} />
          Mark as paid
        </Label>}<br />
          <Label check>
            <Input type="radio" name="radio2" value="false" onChange={this.handleViewPayment} checked={this.state.viewPayment} />
            View payment list
          </Label>       
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={this.handleShowPayment}>Cancel</Button>
      </ModalFooter>
    </Modal>
  }

  //this method calls the delete model
  deleteBillModel = () => {
    let billDeleteItem = this.state.deleteBillName.deletBillDescription ? this.state.deleteBillName.deletBillDescription
      : this.state.deleteBillName.deletBillCategoryName;
    return <DeleteModel danger={this.state.danger} toggleDanger={this.toggleDanger} headerMessage="Delete Bill" bodyMessage={billDeleteItem}
      delete={this.deleteBillAction} cancel={this.toggleDanger} loadDeleteOptions={this.loadDeleteOptions}>bill</DeleteModel>
  }

  loadDeleteOptions = () => {
    return <>
      <FormGroup check >
        <Label check>
          <Input type="radio" name="radio2" value="true" onChange={this.handleRemoveDependents} checked={this.state.removeDependents === true} />
          Delete this Bill along with the Recurring bills associated with it ?
          </Label>
        <Label check>
          <Input type="radio" name="radio2" value="false" onChange={this.handleRemoveDependents} checked={this.state.removeDependents === false} />
          Delete this Bill without deleting the associated Recurring bills ?
          </Label>
      </FormGroup>
    </>
  }
}

export default withRouter(Bills);