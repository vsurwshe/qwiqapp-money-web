import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Redirect } from 'react-router';
import { Card, CardBody, Alert,FormGroup, Label, Input} from "reactstrap";
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
import { profileFeature } from "../../data/GlobalKeys";
import '../../css/style.css';
import { DataTable } from "../utility/DataTabel";
// This importing Jquery in react.
const $ = require('jquery');

// Loads options for More Options in DataTable
const moreOptions = {
  ADDPAYMENT: 'Add a payment',
  PAYHISTORY: 'Payments History',
  MARKPAID: 'Mark as Paid',
  UNMARKPAID:'Mark as Un-Paid',
  ATTACHMENTS: 'Attachments',
  DELETE: 'Delete'
}

class Bills extends Component {
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
      profileId: "",
      selectedOption: '',
      paidAmount: 0
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

  componentDidUpdate = () => {
    const { bills } = this.state
    var _ = this; //this line holding the class this keyword.
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
          _.handleAddPayment();
          break;
        case moreOptions.ATTACHMENTS:
          requiredBill && _.billAttachments(requiredBill[0].id)
          break;
        case moreOptions.DELETE:
          requiredBill && _.setBillId(requiredBill[0])
          break;
        case moreOptions.MARKPAID:
          _.handleMarkAsPaid();
          break;
        case moreOptions.PAYHISTORY:
          _.handleViewPayment();
          break;
        case moreOptions.UNMARKPAID:
          _.handleMarkAsUnpaidPayment();
          break;
        default:
           break;
      }
    })
  }


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
    new CategoryApi().getCategories(this.successCallCategory, this.errorCall, this.state.profileId);
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
    new LabelApi().getSublabels((labels)=>this.successCallLabel(labels, callContacts), this.errorCall, this.state.profileId);
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

  /* This Method execute the Contacts API Call
     callBills is a boolean value passed from BillForm after successfully creating Contacts and it determines if getBills() is called or not  */
  getContacts = (callBills) => {
    new ContactApi().getContacts((contacts)=>this.successCallContact(contacts, callBills), this.errorCall, this.state.profileId);
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
    if (this.props.paid) {
      await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId, true);
    } else {
      await new BillApi().getBills(this.successCallBill, this.errorCall, this.state.profileId);
    }
  }

  // bills response
  successCallBill = async bills => {
    let newBills;
    const { value } = this.props.match.params;
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
      this.getPayments(bill.id, previousPayments);
      return { ...bill, categoryName: this.displayCategoryName(bill.categoryId) }
    });
    this.setState({ bills: state });
  }

  getPayments = async (billId, previousPayments) => {
    await new PaymentApi().getBillPayments((payments) => {
      let newRespData = { payments: payments, billId: billId }
      this.successCallPayments(newRespData, previousPayments)
    }, err => { console.log("error") }, this.state.profileId, billId)
  }

  successCallPayments = async (payments, previousPayments) => {
    previousPayments.push(payments)
    return await this.setState({ billPayments: previousPayments })
  }

  handleMarkAsUnPaid = () => { new BillApi().markAsUnPaid(this.successUnpaidBill, this.errorCall, this.state.profileId, this.state.requiredBill.id);}

  successUnpaidBill = () => { this.callAlertTimer("success", "Your bill succefully made as unpaid bill") }

  // This method handle Error Call of API 
  errorCall = (err) => {
    if (err.response && (err.response.status === 500 && err.response.data.error.debugMessage)) {
      this.setState({ visible: true, color: 'danger', content: 'Something went wrong, unable to fetch bills...' });
      setTimeout(() => { this.setState({ visible: false, spinner: true }); }, Config.apiTimeoutMillis);
    } else {
      this.setState({ color: 'danger', content: 'Unable to Process Request, Please try Again....' });
    }
  }

  //this toggle for Delete Model
  toggleDanger = () => { this.setState({ danger: !this.state.danger });}

  // This Method Execute the Bill Form Executions.
  createBillAction = () => { this.setState({ createBillRequest: true }) }
  updateBillAction = updateBill => { this.setState({ updateBillRequest: true, updateBill }) };
  deleteBillAction = () => { this.setState({ deleteBillRequest: true }) };

  setBillId = (bill) => {
    let data = {
      "deletBillDescription": bill.description,
      "deletBillCategoryName": bill.categoryName.name
    }
    this.setState({ billId: bill.id, deleteBillName: data });
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

  handleAddPayment = () => {this.setState({ addPayment: true });}
  handleMarkAsPaid = () => { this.setState({ markPaid: true }); }
  handleViewPayment = () => { this.setState({ viewPayment: !this.state.viewPayment }); }
  handleMarkAsUnpaidPayment = () => { this.setState({ markAsUnPaid: true }) }

  calculateLastPaid = (bill) => {
    const { billPayments } = this.state
    if (billPayments.length > 0) {
      // Filtering billpayments according to billId
      let filteredBillPayment = billPayments.filter(billPayment => billPayment.billId === bill.id);
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
          paidAmount: paidAmount   // setting the total paid amount
        }
        return lastPaid;
      }
    }
  }

  billAttachments = (billId) => { this.setState({ billId: billId, attachments: true }) }

  descriptionToggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  render() {
    const { bills, createBillRequest, updateBillRequest, billId, deleteBillRequest, visible, profileId,
      updateBill, spinner, labels, categories, contacts, danger, paidAmount, requiredBill, markPaid, profileFeatures } = this.state;
    let featureAttachment = profileFeatures && profileFeatures.includes(profileFeature.ATTACHMENTS) // return true/false
    if (!profileId) {
      return <ProfileEmptyMessage />
    } else if (!bills.length && !createBillRequest) {  // Checks for bills not there and no bill create Request, then executes
      return <div>
        {/*  If spinner is true and bills are there, it shows the loader function, until bills are loaded */
        (spinner && bills.length) ? <>{visible && <Alert isOpen={visible} color={this.state.color}>{this.state.content}</Alert>} {this.loadLoader()}
        </> : !bills.length && this.emptyBills() // If bills not there, it will show Empty message 
        }
      </div>
    } else if (createBillRequest) {
      return <BillForm profileId={profileId} labels={labels} categories={categories} contacts={contacts} getContacts={this.getContacts} getLabels={this.getLabels}/>
    } else if (updateBillRequest) {
      return <BillForm profileId={profileId} bill={updateBill} labels={labels} categories={categories} contacts={contacts} getContacts={this.getContacts} getLabels={this.getLabels}/>
    } else if (deleteBillRequest) {
      return <DeleteBill billId={billId} profileId={profileId} removeDependents={this.state.removeDependents} />
    } else if (this.state.addPayment || this.state.markPaid) {
      return <BillPayment bill={requiredBill} markPaid={markPaid} paidAmount={paidAmount} profileId={profileId} />
    } else if (this.state.viewPayment) {
      return <ViewPayment bill={this.state.requiredBill} paidAmount={paidAmount} profileId={profileId} cancel={this.handleViewPayment} />
    } else if (this.state.attachments) {
      let data = {
        profileId: profileId,
        billId: billId
      }
      Store.saveProfileIdAndBillId(data);
      return <Redirect to="/bills/attachments" />
    }
    else {
      return <div>
        {danger && this.deleteBillModel()}
        {this.loadDataTable(bills, featureAttachment, visible)}
        {this.state.markAsUnPaid && this.handleMarkAsUnPaid()}
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
  loadDataTable = (bills, featureAttachment, visible) => {
    const color = this.props.color;
    // This array collection of header in DataTable
    let columns = [
      { title: '', visible: false },
      { title: "Due Date" },
      { title: "Bill Date" },
      { title: "Description" },
      { title: "Bill Amount" },
      { title: "Status" },
      { title: "", orderable: false }, // This column used for edit Button
      { title: "", orderable: false } // This column used for more options
    ]
    // This is Returning DataTable Component
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader("")}
        <h6>{visible && <Alert isOpen={visible} color={color}>{this.props.content}</Alert>}</h6>
        <CardBody className="card-align">
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
    let billDescription = bill.description ? bill.description : bill.categoryName.name;
    let singleRow = [
      bill.id,
      strike ? "<strike>" + ShowServiceComponent.customDate(bill.dueDate_, true) + "</strike>" : ShowServiceComponent.customDate(bill.dueDate_, true),
      strike ? "<strike>" + ShowServiceComponent.customDate(bill.billDate, true) + "</strike>" : ShowServiceComponent.customDate(bill.billDate, true),
      strike ? "<strike>" + billDescription + "</strike>" : billDescription,
      strike ? "<strike style='color:red'>" + this.handleSignedBillAmount(bill) + "</strike>" : "<span style='color:green'>" + this.handleSignedBillAmount(bill) + "</span>",
      strike ? "<strike>"+this.loadPaidStatus(bill, lastPaid)+"</strike>" :this.loadPaidStatus(bill, lastPaid),
      this.loadEditButton(bill, key, featureAttachment),
      this.loadDropDown(bill, key, featureAttachment)
    ]
    return singleRow;
  }

  loadFilterAndNonFilteredBills = (bills, featureAttachment) => {
    return bills.filter(this.searchingFor(this.state.selectedOption)).map((bill, key) => {
      return this.loadSingleBill(bill, key, featureAttachment);
    })
  }
  
  loadPaidStatus = (bill, lastPaid) => {
    return lastPaid ? "<span style='color: #0080ff'>Last paid: " + ShowServiceComponent.billDateFormat(lastPaid.date) + "&nbsp;&nbsp;" + ShowServiceComponent.billTypeAmount(bill.currency, lastPaid.paymentAmt, true) + "</span>" : ""
  }

  handleSignedBillAmount = (bill) => {
    return bill.amount < 0 ? "<span class='text-color'>- " + ShowServiceComponent.billTypeAmount(bill.currency, bill.amount) + "</span>" : "<span class='bill-amount-color'>" + ShowServiceComponent.billTypeAmount(bill.currency, bill.amount) + "</span>";
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

  loadEditButton = () => {
    return "<span class='float-right editButton'> <Button class='rounded' style='background-color: transparent; border-color: #ada397; color: green;'>Edit</Button> &nbsp;&nbsp;&nbsp; </span>"
  }

  //this Method loads Browser DropDown
  loadDropDown = (bill, key, featureAttachment) => {
    var moreOption= "<span class='float-right'> <select id='more' class='dropdown-toggle'> <option>More ... </option>" +
    "<option>" + moreOptions.ADDPAYMENT + "</option>" +
    "<option>" + moreOptions.PAYHISTORY + "</option>";
    // This Checking Bill is Paid or not according to adding mark as paid or mark as un paid
    moreOption=moreOption.concat(bill.paid ? "<option>" + moreOptions.UNMARKPAID + "</option>" : "<option>" + moreOptions.MARKPAID + "</option>");
    // This  its have feature attachment or not Checking
    moreOption=moreOption.concat(featureAttachment ? "<option>" + moreOptions.ATTACHMENTS + "</option>" : '');
    moreOption=moreOption.concat("<option>" + moreOptions.DELETE + "</option> </select> </span>");
    return  moreOption;
  }

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