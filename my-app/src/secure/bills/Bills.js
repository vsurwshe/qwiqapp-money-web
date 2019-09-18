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
      value: '',
      showPaymentOptions: false,
      billPayments: [],
      paidAmount :0,
      reqViewPayments : []
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
      if(this.props.paid){
        await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId, "True");
      } else{
        await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId);
      }
    
    }
  };

  // bills response
  successCallBill = async bills => {
    let newBills;
    if (bills.length === 0) {
      this.setState({ bills: [] })
    }
    else {
      if (this.props.match.params.value) {
        switch (this.props.match.params.value) {
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
      await this.getBillPayments()
      this.loadCollapse();
    }
  }

  getBillPayments = async () => {
    let previousPayments = [];
    this.state.bills.map(async (bill, key) => {
      this.getPayments(bill.id, previousPayments)
    })
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

  // category name color append to bills
  billsWithcategoryNameColor = (bills) => {
    const prevState = bills;
    const state = prevState.map((bill, index) => {
      return { ...bill, categoryName: this.displayCategoryName(bill.categoryId) }
    });
    this.setState({ bills: state });
  }

  loadCollapse = async () => {
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

  createBillAction = () => { this.setState({ createBillRequest: true }) }

  updateBillAction = updateBill => {
    this.setState({ updateBillRequest: true, updateBill })
  };

  deleteBillAction = () => {
    this.setState({ deleteBillRequest: true })
  };

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

  handleRemoveDependents = () => {
    this.setState({ removeDependents: !this.state.removeDependents });
  }

  setValue = () => {
    this.setState({ value: '' })
  }

  handleShowPayment = (bill) => {
    let lastPaid = this.calculateLastPaid(bill.id, bill.amount);
    if(lastPaid){
      this.setState({ showPaymentOptions: !this.state.showPaymentOptions, requiredBill: bill, paidAmount : lastPaid.paidAmount , reqViewPayments : lastPaid.payments });
    }
    this.setState({ showPaymentOptions: !this.state.showPaymentOptions, requiredBill: bill });
  }

  handleAddPayment = () => { this.setState({ addPayment: true }); }
  handleMarkAsPaid = () => { this.setState({ markPaid: true }); }
  handleViewPayment = () => { this.setState({ viewPayment: !this.state.viewPayment, showPaymentOptions: false }); }

  calculateLastPaid = (billId, billAmount) => {
    if (this.state.billPayments.length > 0) {
      // Filtering billpayments according to billId
      let filteredBillPayment = this.state.billPayments.filter(billPayment => billPayment.billId === billId);
      if (filteredBillPayment !== undefined && filteredBillPayment.length && filteredBillPayment[0].payments.length) {
        let paidAmount=0, paid;
        // Calculating the total paidAmount of all billpayments
        filteredBillPayment[0].payments.forEach((payment)=>{
          if(payment.amount < 0 ){
            payment.amount= -(payment.amount)
          }
          paidAmount += payment.amount;
        })
        if(paidAmount === billAmount){
          paid = true
        } else{
          paid= false
        }
        let lastPaid = {
          payments: filteredBillPayment[0].payments, //  Getting payments list of a specific bill
          date: filteredBillPayment[0].payments.sort()[0].date,  // Sorting and getting last payment date
          paymentAmt: filteredBillPayment[0].payments.sort()[0].amount,  // Sorting and getting last payment amount
          paidAmount : paidAmount,   // setting the total paid amount
          paid : paid 
        }
        return lastPaid;
      }
    }
  }

  render() {
    const { bills, createBillRequest, updateBillRequest, id, deleteBillRequest, visible, profileId, updateBill, spinner, labels, categories, contacts, danger, paidAmount, requiredBill, markPaid ,reqViewPayments } = this.state;
    if (!profileId) {
      return <ProfileEmptyMessage />
    } else if (bills.length === 0 && !createBillRequest) {  // Checks for bills not there and no bill create Request, then executes
      return <div>
        {/*  If spinner is true and bills are there, it shows the loader function, until bills are loaded */}
        {(spinner && bills.length !== 0) ? <>{visible && <Alert isOpen={visible} color={this.state.color}>{this.state.content}</Alert>} {this.loadLoader()} </>
          :
          // If bills not there, it will show Empty message
          (bills.length === 0 ? this.emptyBills() : "")}</div>
    } else if (createBillRequest) {
      return <BillForm pid={profileId} labels={labels} categories={categories} contacts={contacts} />
    } else if (updateBillRequest) {
      return <BillForm pid={profileId} bill={updateBill} labels={labels} categories={categories} contacts={contacts} />
    } else if (deleteBillRequest) {
      return <DeleteBill id={id} pid={profileId} removeDependents={this.state.removeDependents} />
    } else if (this.state.addPayment || this.state.markPaid) {
      return <BillPayment bill={requiredBill} markPaid={markPaid} paidAmount={paidAmount} profileId={profileId} />
    } else if (this.state.viewPayment) {
      return <ViewPayment bill={this.state.requiredBill}  profileId={profileId} payments={reqViewPayments} cancel={this.handleViewPayment} />
    } else {
      return <div>{this.displayAllBills(visible, bills)}{danger && this.deleteBillModel()}{this.state.showPaymentOptions && this.loadPaymentModel(bills)}</div>
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
    return <tr onPointerEnter={(e) => this.onHover(e, key)} onPointerLeave={(e) => this.onHoverOff(e, key)} width={50} key={key}>
      <td>{ShowServiceComponet.customDate(bill.dueDate_, true)}</td>
      <td>{ShowServiceComponet.customDate(bill.billDate, true)}</td>
      <td>{bill.description ? bill.description : bill.categoryName.name}</td>
      <td>{ShowServiceComponet.billTypeAmount(bill.currency,bill.amount) }</td>
      <td>
        <p>Last paid: {ShowServiceComponet.billTypeAmount(bill.currency,0)}</p>
      </td>
      <td><h6>{this.loadDropDown(bill, key)}</h6></td>
    </tr>
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
      <ModalHeader toggle={this.handleShowPayment}>Payments</ModalHeader>
      <ModalBody>
        <FormGroup check >
          <Label check>
            <Input type="radio" name="radio2" value="true" onChange={this.handleAddPayment} checked={this.state.addPayment} />{' '}
            Add Payment
          </Label> <br />
          <Label check>
            <Input type="radio" name="radio2" value="false" onChange={this.handleMarkAsPaid} checked={this.state.markPaid} />{' '}
            Mark as paid
          </Label><br />
          <Label check>
            <Input type="radio" name="radio2" value="false" onChange={this.handleViewPayment} checked={this.state.viewPayment} />{' '}
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