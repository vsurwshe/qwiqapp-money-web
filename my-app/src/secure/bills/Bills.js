import React, { Component, Suspense } from "react";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Alert, FormGroup, Label, Input } from "reactstrap";
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
import PaymentApi from "../../services/PaymentApi";
import { profileFeature, moreOptions } from "../../data/GlobalKeys";
import { DataTable } from "../utility/DataTable";
import BillTabs from "./BillTabs";
import '../../css/style.css';
import '../../css/dataTables.fontAwesome.css';

// This importing Jquery in react.
const $ = require('jquery');

class Bills extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      bills: [],
      labels: [],
      categories: [],
      contacts: [],
      updateBill: [],
      billPayments: [],
      visible: props.visible,
      profileId: '',
      selectedOption: '',
      paidAmount: 0
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
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

  componentDidUpdate = () => {
    const { bills } = this.state
    var _ = this; //assigns the class's this keyword to _.
    if (this._isMounted) {
      // .display is css class name of datatable so we are using class name to identify which action is called.
      $('.display').on('click', '.editButton', function () {
        var row = $(this).closest('tr'); // This fetches the data of the row when we click 'edit' in dataTable
        var editData = $('.display').dataTable().fnGetData(row); //this line separates the required data from the fecthced row data.
        var updateBill = editData && bills.filter(bill => bill.id === editData[0]); // Filter the specific bill from the list of bills using id and assign to updatebill
        updateBill && _.updateBillAction(updateBill[0]) // 
      })
      $('.display').on('change', 'select', function () {
        var row = $(this).closest('tr'); // This fetches the data of the row when we click 'edit' in dataTable
        var editData = $('.display').dataTable().fnGetData(row); //this line separates the required data from the fecthced row data.
        var requiredBill = editData && bills.filter(bill => bill.id === editData[0]); // Filter the specific bill from the list of bills using id and assign to updatebill
        requiredBill && _.handleShowPayment(requiredBill[0])
        switch ($(this).val()) {
          case moreOptions.ADDPAYMENT:
            requiredBill && _.handleAddPayment();
            break;
          case moreOptions.ATTACHMENTS:
            requiredBill && _.handleBillAttachments(requiredBill[0].id)
            break;
          case moreOptions.DELETE:
            requiredBill && _.handleSetBillId(requiredBill[0])
            break;
          case moreOptions.MARKPAID:
            requiredBill && _.handleMarkAsPaid();
            break;
          case moreOptions.PAYHISTORY:
            requiredBill && _.handleViewPayment();
            break;
          case moreOptions.UNMARKPAID:
            requiredBill && _.handleMarkAsUnpaidPayment(requiredBill[0]);
            break;
          default:
            break;
        }
      })
    }
  }

  componentWillUnmount() { this._isMounted = false; }

  // This Method seting your profile id.
  setProfileId = async () => {
    let profile = Store.getProfile();
    if (profile) {
      await this.setState({ profileId: profile.id, profileFeatures: profile.features });
      // This condition checking whether api call first time or reptely 
      this.state.categories !== undefined && this.state.categories.length <= 0 ? this.getCategory() : this.forceUpdate();
    }
  }

  // This Method execute the Category API Call
  getCategory = () => {
    const { profileId } = this.state
    new CategoryApi().getCategories(this.successCallCategory, this.errorCall, profileId);
  }

  // Handle Categories response
  successCallCategory = async categories => {
    if (categories.length === 0 && this.state.categories !== undefined) {
      this.setState({ categories: undefined })
    } else {
      await this.setState({ categories: categories });
    }
    this.getLabels();
  };

  /* This Method execute the Label API Call
     callContacts is a boolean value passed from BillForm after successfully creating Labels and it determines if getContacts() is called or not */
  getLabels = async (callContacts) => {
    new LabelApi().getSublabels((labels) => this.successCallLabel(labels, callContacts), this.errorCall, this.state.profileId);
  }

  // Handle Label response
  successCallLabel = async (labels, callContacts) => {
    this.setState({ spinner: true })
    if (labels.length === 0 && this.state.labels !== undefined) {
      this.setState({ labels: undefined });
    } else {
      await this.setState({ labels });
    }
    if (!callContacts) {
      this.getContacts();
    }
  };

  /* This Method execute the Contacts API Call callBills is a boolean value passed from BillForm after successfully creating Contacts and it determines if getBills() is called or not  */
  getContacts = (callBills) => {
    new ContactApi().getContacts((contacts) => this.successCallContact(contacts, callBills), this.errorCall, this.state.profileId);
  }

  // Handle Contacts response
  successCallContact = async (contacts, callBills) => {
    this.setState({ spinner: true });
    if (contacts.length === 0 && this.state.contacts !== undefined) {
      this.setState({ contacts: undefined });
    } else {
      await this.setState({ contacts });
    }
    if (!callBills) {
      this.getBills()
    }
  };

  // This Method execute the Bill API Call
  getBills = async () => {
    const { profileId } = this.state
    if (this.props.paid) {
      await new BillApi().getBills(this.successCallBill, this.errorCall, profileId, true);
    } else {
      await new BillApi().getBills(this.successCallBill, this.errorCall, profileId);
    }
  }

  // bills response
  successCallBill = async bills => {
    let newBills;
    const { value } = this.props.match.params;
    if (bills && !bills.length) {
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

  // category name color appended to bills
  billsWithcategoryNameColor = (bills) => {
    let previousPayments = [];
    const prevState = bills;
    const state = prevState.map((bill, index) => {
      this.getPayments(bill.id, previousPayments);
      return { ...bill, categoryName: this.displayCategoryName(bill.categoryId) }
    });
    this.setState({ bills: state });
  }

  getPayments = async (billId, previousPayments) => {
    const { profileId } = this.state
    await new PaymentApi().getBillPayments((payments) => {
      let newRespData = { payments: payments, billId: billId }
      this.successCallPayments(newRespData, previousPayments)
    }, err => { console.log("error") }, profileId, billId)
  }

  successCallPayments = async (payments, previousPayments) => {
    previousPayments.push(payments)
    return await this.setState({ billPayments: previousPayments })
  }

  handleMarkAsUnPaid = () => {
    const { profileId, updateBill } = this.state
    new BillApi().markAsUnPaid(this.successUnpaidBill, this.errorCall, profileId, updateBill.id);
  }

  successUnpaidBill = () => { this.setMarkasUnpaid(); this.callTimer("success", "Your bill payments clear"); this.getBills() }

  // This method handle Error Call of API 
  errorCall = (err) => {
    if (err.response && (err.response.status === 500 && err.response.data.error.debugMessage)) {
      this.setState({ visible: true, color: 'danger', content: 'Something went wrong, unable to fetch bills...' });
      setTimeout(() => { this.setState({ visible: false, spinner: true }); }, Config.apiTimeoutMillis);
    } else {
      this.setState({ color: 'danger', content: 'Unable to Process Request, Please try Again....' });
    }
  }

  callTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    setTimeout(() => {
      this.setState({ alertColor: undefined, alertMessage: undefined });
    }, Config.apiTimeoutMillis);
  }

  //this toggle for Delete Model
  toggleDanger = () => { this.setState({ danger: !this.state.danger }); }

  // This Method Execute the Bill Form Executions.
  createBillAction = (dummy, createdSuccess) => {
    this.setState({ createBillRequest: !this.state.createBillRequest });
    if (createdSuccess) {
      this.successCallBill(Store.getBills());
    }
  }
  // createBillAction = () => { this.setState({ createBillRequest: true }) }
  updateBillAction = (updateBill, updatedSuccess) => {
    this.setState({ updateBillRequest: !this.state.updateBillRequest, updateBill });
    if (updatedSuccess) {
      this.successCallBill(Store.getBills());
    }
  };
  // updateBillAction = updateBill => { this.setState({ updateBillRequest: true, updateBill }) };
  deleteBillAction = () => { this.setState({ deleteBillRequest: true }) };

  setBillId = (bill) => {
    let data = {
      "deletBillDescription": bill.description,
      "deletBillCategoryName": bill.categoryName.name
    }
    this.setState({ billId: bill.id, deleteBillName: data });
    this.toggleDanger();
  }

  // This seting required bill when click any one options from more options
  handleShowPayment = (bill) => {
    let lastPaid = this.calculateLastPaid(bill);
    if (lastPaid) {
      this.setState({ updateBill: bill, paidAmount: lastPaid.paidAmount });
    }
    this.setState({ updateBill: bill });
  }

  // This is more options handle methods
  handleAddPayment = (callBills) => { 
    if(callBills){
      this.getBills()
    } 
    this.setState({ addPayment: !this.state.addPayment });
  }

  handleMarkAsPaid = (callBills) => {
    if(callBills){
      this.getBills()
    }  
    this.setState({ markPaid: !this.state.markPaid }); 
  }
  handleViewPayment = () => { this.setState({ viewPayment: !this.state.viewPayment }); }
  handleMarkAsUnpaidPayment = (requiredBill) => { this.setState({ markAsUnPaid: !this.state.markAsUnPaid, updateBill:requiredBill }) }
  setMarkasUnpaid = () => { this.setState({ markAsUnPaid: !this.state.markAsUnPaid}); }

  handleBillAttachments = (billId) => { 
    this.setState({ billId: billId }) 
    this.handleAttachmentAction()
  }
  handleSetBillId = (bill) => {
    let data = {
      "deletBillDescription": bill.description,
      "deletBillCategoryName": bill.categoryName.name
    }
    this.setState({ billId: bill.id, deleteBillName: data });
    this.toggleDanger();
  }

  handleAttachmentAction = () =>{
    this.setState({ attachments : !this.state.attachments })
  }

  // this method handle remove dependents while deleteing bill
  handleRemoveDependents = () => { this.setState({ removeDependents: !this.state.removeDependents }); }

  // This is method calulate last paying amount for bill
  calculateLastPaid = (bill) => {
    const { billPayments } = this.state;
    let totalPaid = 0;
    if (billPayments.length > 0 && bill) {
      // Filtering billpayments according to billId
      let filteredBillPayment = billPayments.filter(billPayment => billPayment.billId === bill.id);
      let paidAmount = bill.amount;
      if (filteredBillPayment && filteredBillPayment.length && filteredBillPayment[0].payments.length) {
        // Calculating the total paidAmount of all billpayments
        filteredBillPayment[0].payments.forEach((payment) => {
          paidAmount = paidAmount - (payment.amount);
          totalPaid = totalPaid + payment.amount
        })
        let sortedPayment = filteredBillPayment[0].payments.sort((a, b) => (a.date > b.date ? -1 : 1))[0]
        let lastPaid = {
          payments: filteredBillPayment[0].payments, //  Getting payments list of a specific bill
          date: sortedPayment.date,  // Sorting and getting last payment date
          paymentAmt: sortedPayment.amount,  // Sorting and getting last payment amount
          paidAmount: paidAmount,   // setting the total paid amount
          totalPaid: totalPaid
        }
        return lastPaid;
      }
    }
  }

  render() {
    const { bills, createBillRequest, updateBillRequest, billId, deleteBillRequest, visible, profileId, addPayment, viewPayment, attachments, removeDependents, color, content,
      markAsUnPaid, updateBill, spinner, labels, categories, contacts, danger, paidAmount, markPaid, profileFeatures } = this.state;
    let featureAttachment = profileFeatures && profileFeatures.includes(profileFeature.ATTACHMENTS) // return true/false
    // Passing required data to Tabs
    let tabData = {
      profileId: profileId,
      labels: labels,
      categories: categories,
      contacts: contacts,
      getContacts: this.getContacts,
      getLabels: this.getLabels,
      bill: updateBill
    }

    if (!profileId) {
      // If no profile then showing message 
      return <ProfileEmptyMessage />
    } else if (!bills.length && !createBillRequest) {
      // Checks for bills not there and no bill create Request, then executes
      return <div>
        {/*  If spinner is true and bills are there, it shows the loader function, until bills are loaded */}
        {(spinner && bills.length) ? <>{visible && <Alert isOpen={visible} color={color}>{content}</Alert>} {this.loadLoader()}
        </> : !bills.length && this.emptyBills() // If bills not there, it will show Empty message 
        }
      </div>
    } else if (createBillRequest) {
      var newTabData = { ...tabData, bill: null };
      // This bill tabs called for create a bill.
      return <BillTabs activeTab={1} tabData={newTabData} cancelButton={this.createBillAction} />
    } else if (updateBillRequest) {
      // This bill tabs called for bill update.
      return <BillTabs activeTab={1} tabData={tabData} cancelButton={this.updateBillAction} />
    } else if (deleteBillRequest) {
      return <DeleteBill billId={billId} profileId={profileId} removeDependents={removeDependents} />
    } else if (addPayment || markPaid) {
      let cancelHandle = addPayment ? this.handleAddPayment : this.handleMarkAsPaid
      return <Suspense fallback={<div>Loading...</div>}> <BillTabs activeTab={2} payform={true} tabData={tabData} paidAmount={paidAmount} cancelButton={cancelHandle} /></Suspense>
    } else if (viewPayment) {
      // This bill tabs called for Payments.
      return <BillTabs activeTab={2} tabData={tabData} paidAmount={paidAmount} cancelButton={this.handleViewPayment} />
    } else if (attachments) {
      // This bill tabs called for Attachments.
      return <BillTabs activeTab={3} tabData={tabData} paidAmount={paidAmount} cancelButton={this.handleAttachmentAction} />
    }
    else {
      // displaying all bills
      return <div>
        {danger && this.deleteBillModel()}
        {this.loadDataTable(bills, featureAttachment)}
        {markAsUnPaid && this.handleMarkAsUnPaid()}
      </div>
    }
  }

  loadHeader = (bills) => {
    return new ShowServiceComponent.loadHeaderWithSearch("BILLS", bills, this.searchSelected, "Search Bills.....", this.createBillAction, false, null);
  }

  loadLoader = () => <div className="animated fadeIn">
    <Card>
      {this.loadHeader("")}
      <center className="padding-top" >
        <CardBody>
          <div className="text-primary spinner-size" role="status">
            <span className="sr-only">Loading...</span>
          </div></CardBody>
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

  // This Functions Loading Jquery DataTable into bills
  loadDataTable = (bills, featureAttachment) => {
    // This array collection of header in DataTable
    let columns = [
      { title: '', visible: false },
      { title: "Due Date" },
      { title: "Bill Date" },
      { title: "Description" },
      { title: '', orderable: false },// This column used for showing currency icon
      { title: "Bill Amount" },
      { title: "Status" },
      { title: "", orderable: false }, // This column used for recuring bill icons
      { title: "", orderable: false }, // This column used for edit button
      { title: "", orderable: false } // This column used for more options
    ]
    // This is Returning DataTable Component
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader("")}
        <h6>{this.state.alertMessage && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}</h6>
        <CardBody className="card-align">
          {/* Calling jquery datatable component providing rows and columns */}
          <DataTable billData={this.loadTableRows(bills, featureAttachment)} columns={columns} />
        </CardBody>
      </Card>
    </div>
  }

  // This fucntion loading DataTable Rows.
  loadTableRows = (bills, featureAttachment) => {
    var rows = bills.map((bill, key) => { return this.loadSingleRow(bill, key, featureAttachment); })
    return rows;
  }

  // Show the Single Bill 
  loadSingleRow = (bill, key, featureAttachment) => {
    let strike = bill.paid;
    let lastPaid = this.calculateLastPaid(bill, bill.amount);
    let billDescription = bill.description ? bill.description.length > 25 ? bill.description.substring(0, 25) + "..." : bill.description : bill.categoryName.name;
    let singleRow = [
      bill.id,
      strike ? "<strike>" + ShowServiceComponent.customDate(bill.dueDate_, true) + "</strike>" : ShowServiceComponent.customDate(bill.dueDate_, true),
      strike ? "<strike>" + ShowServiceComponent.customDate(bill.billDate, false, true) + "</strike>" : ShowServiceComponent.customDate(bill.billDate, false, true),
      strike ? "<strike>" + billDescription + "</strike>" : billDescription,
      strike ? "<strike>" + this.getBillCurrency(bill.currency, bill.amount) + "</strike>" : this.getBillCurrency(bill.currency, bill.amount),
      strike ? "<strike>" + this.handleSignedBillAmount(bill.amount) + "</strike>" : "<span style='color:green'>" + this.handleSignedBillAmount(bill.amount) + "</span>",
      strike ? "<strike>" + this.loadPaidStatus(bill, lastPaid) + "</strike>" : this.loadPaidStatus(bill, lastPaid),
      strike ? "<strike>" + (bill.recurId ? "<i class='fa fa-undo bill-icon-color'/>" : '')+ "</strike>" : (bill.recurId ? "<i class='fa fa-undo bill-icon-color'/>" : ''),
      '',
      this.loadDropDown(bill, key, featureAttachment)
    ]
    return singleRow;
  }

  //This filters the currency symbol using currency code in currencies 
  getBillCurrency = (currencyCode, billAmount) => {
    const data = Store.getCurrencies();
    const result = data.filter(currenct => currenct.code === currencyCode);
    return this.handleSignedBillAmount(billAmount, result[0].symbol)
  }

  // This shows the last transaction details
  loadPaidStatus = (bill, lastPaid) => {
    return lastPaid ? "<span class='bill-amount-color'>Total paid: " + ShowServiceComponent.customDate(lastPaid.date, true) + "&nbsp;&nbsp;" + ShowServiceComponent.billTypeAmount(bill.currency, lastPaid.totalPaid, true) + "</span>" : ""
  }

  // Checks with billAmount and applies styles accordingly
  handleSignedBillAmount = (billAmount, data) => {
    let value = data ? data : billAmount;
    return billAmount < 0 ? "<span class='text-color'>" + value + "</span>" : "<span class='bill-amount-color'>" + value + "</span>";
  }

  // This converts api date into actual Date format
  loadDateFormat = (dateParam) => {
    let toStr = "" + dateParam
    let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
    let date = new Date(dateString);
    return date;
  }

  // This method is used to display category names in description for bills
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

  //this method loads Browser DropDown
  loadDropDown = (bill, key, featureAttachment) => {
    var moreOption = "<span class='float-right'> <select id='more' class='dropdown-toggle'> <option>More ... </option>" +
      "<option>" + moreOptions.ADDPAYMENT + "</option>" +
      "<option>" + moreOptions.PAYHISTORY + "</option>";
    // This Checking Bill is Paid or not according to adding mark as paid or mark as un paid
    moreOption = moreOption.concat(bill.paid ? "<option>" + moreOptions.UNMARKPAID + "</option>" : "<option>" + moreOptions.MARKPAID + "</option>");
    // This  its have feature attachment or not Checking
    moreOption = moreOption.concat(featureAttachment && "<option>" + moreOptions.ATTACHMENTS + "</option>");
    moreOption = moreOption.concat("<option>" + moreOptions.DELETE + "</option> </select> </span>");
    return moreOption;
  }

  //this method calls the delete model
  deleteBillModel = () => {
    let billDeleteItem = this.state.deleteBillName.deletBillDescription ? this.state.deleteBillName.deletBillDescription
      : this.state.deleteBillName.deletBillCategoryName;
    return <DeleteModel danger={this.state.danger} toggleDanger={this.toggleDanger} headerMessage="Delete Bill" bodyMessage={billDeleteItem}
      delete={this.deleteBillAction} cancel={this.toggleDanger} loadDeleteOptions={this.loadDeleteOptions}>bill</DeleteModel>
  }

  // This method shows the options while deleting a bill
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