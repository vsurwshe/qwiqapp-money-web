import React, { Component } from "react";
import { AvField } from 'availity-reactstrap-validation';
import { Alert, Card, Col, Row, Container, Input, Collapse } from "reactstrap";
import Select from 'react-select';
import BillApi from "../../services/BillApi";
import Bills from "./Bills";
import Data from '../../data/SelectData'
import Config from "../../data/Config";
import Store from "../../data/Store";
import { BillFormUI } from "../utility/FormsModel";
import '../../css/style.css';
import { ShowServiceComponet } from "../utility/ShowServiceComponet";

class BillForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: props.labels,
      contacts: props.contacts,
      categories: props.categories,
      bill: props.bill,
      billCreated: false,
      profileId: props.pid,
      alertColor: "",
      alertMessage: "",
      currencies: [],
      cancelCreateBill: false,
      doubleClick: false,
      categoryOptionUpdate: false,
      labelOptionUpdate: false,
      contactOptionUpdate: false,
      notifyDate: props.bill ? ShowServiceComponet.customDate(props.bill.notifyDate_) : '',
      dueDays: props.bill ? props.bill.dueDays : 0,
      dueDate: props.bill ? ShowServiceComponet.customDate(props.bill.dueDate_) : '',
      billDate: props.bill ? ShowServiceComponet.customDate(props.bill.billDate) : '',
      amount: props.bill ? this.setBillAmount(props.bill.amount) : 0,
      contactOption: props.bill ? props.bill.contactId : '',
      categoryOption: props.bill ? props.bill.categoryId : null,
      labelOption: props.bill ? props.bill.labelIds : null,
      checked: props.bill ? this.props.bill.notificationEnabled : false,
      taxAmtChanged: false,
      taxPercent: props.bill ? props.bill.taxPercent : 0,
      taxAmount: props.bill ? this.setBillAmount(props.bill.taxAmount_) : 0,
      notifyDays: props.bill ? props.bill.notifyDays : 0,
      billType: props.bill ? (props.bill.amount < 0 ? '-' : '+') : '',
      moreOptions: this.handleMoreOptios(props.bill),
    };
  }

  handleMoreOptios = (bill) =>{
    const {taxPercent, contactId, labelIds, notificationEnabled } = bill ? bill : ""
    if (bill && (taxPercent || contactId || labelIds || notificationEnabled)) {
      return true
    } else {
      return false
    }
  }

  componentDidMount = () => {
    const currencies = Store.getCurrencies();
    this.setState({ currencies })
  }

  setBillAmount = (amount) => {
    let splitVal = ("" + amount).split('-')
    if (splitVal.length === 1) {
      return splitVal[0];
    } else {
      return splitVal[1];
    }
  }

  //this method handle form submit values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, contactOption, labelOptionUpdate, contactOptionUpdate } = this.state
    if (categoryOption === null) {
      this.callAlertTimer("warning", "Please Select Category...");
    } else if (errors.length === 0) {
      let custData = {
        ...values,
        "billDate": Data.datePassToAPI(values.billDate),
        "categoryId": categoryOption.value,
        "contactId": contactOptionUpdate ? contactOption.value : (contactOption ? contactOption.value : ''),
        "amount": values.amount,
        "type": values.label === "-" ? "EXPENSE_PAYABLE" : "INCOME_RECEIVABLE",
        "notificationEnabled": this.state.checked,
        "taxPercent": values.taxPercent ? values.taxPercent : 0,
        "labelIds": !labelOption || labelOption === [] ? null :
          (labelOptionUpdate || this.props.bill === undefined ? labelOption.map(opt => { return opt.value }) : labelOption),
      }
      if (this.props.bill) {
        let newData = {
          ...custData,
          "version": this.props.bill.version
        }
        this.handleUpdateBill(event, newData);
      } else {
        this.handleCreateBillPost(event, custData);
      }
    }
  }

  //this method handle the Post method from user`
  handleCreateBillPost = async (e, data) => {
    e.persist();
    this.setState({ doubleClick: true })
    if (this.state.profileId) {
      await new BillApi().createBill(this.successCreateBill, this.errorCall, this.state.profileId, data);
    } else {
      this.errorCall("profile Id undefined")
    }
  };

  handleUpdateBill = (e, data) => {
    e.persist();
    this.setState({ doubleClick: true })
    if (this.state.profileId) {
      new BillApi().updateBill(this.successUpdateBill, this.errorCall, this.state.profileId, this.props.bill.id, data)
    } else {
      this.errorCall("profile Id undefined")
    }
  };

  //this method call when labels created successfully
  successCreateBill = (response) => {
    this.callAlertTimer("success", "New Bill Created....");
  }
  // updated bill
  successUpdateBill = response => {
    this.callAlertTimer("success", "Bill Updated Successfully !! ");
  };

  //this handle the error response the when api calling
  errorCall = err => {
    console.log(err);
    this.callAlertTimer("danger", "Unable to Process Request, Please try Again....");
  };

  cancelCreateBill = () => { this.setState({ cancelCreateBill: true }) }

  //this method Notifies the user after every request
  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage, doubleClick: false });
    if (alertColor === "success") {
      setTimeout(() => {
        this.setState({ name: "", billCreated: true });
      }, Config.apiTimeoutMillis);
    }
  };

  handleSetAmount = e => {
    e.preventDefault()
    this.setState({ amount: e.target.value });
    this.handleTax(e.target.value, this.state.taxPercent, null);
  }

  handleTaxAmount = (e) => {
    e.preventDefault()
    this.handleTax(this.state.amount, e.target.value, null );
  }

  handleTax = (amount, taxPercent, taxAmount ) => {
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
    this.setState({ taxAmount: result.taxAmount, taxPercent: result.taxPercent });
  }

  handleTaxPercent = (e) => {
    e.preventDefault()
    this.handleTax(this.state.amount, null, e.target.value);
  }

  handleBillDate = async (e) => {
    await this.setState({ billDate: e.target.value });
    if (this.props.bill) {
      this.setDate(this.state.billDate, this.state.dueDays);
    }
  }

  handleDate = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    this.setDate(this.state.billDate, e.target.value, e.target.name)
  }

  setDate = (billDate, days, type) => {
    if (billDate && days>0) {
      if (this.state.alertColor) { this.setState({ alertColor: '', alertMessage: '' }) }
      let billDate = new Date(this.state.billDate);
      if (parseInt(days) === 0) {
        billDate.setDate(billDate.getDate())
      }
      else {
        billDate.setDate(billDate.getDate() + parseInt(days - 1))
      }
      let date = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(billDate);
      type === 'dueDays' ? this.setState({ dueDate: date }) : this.setState({ notifyDate: date })
    } else {
      if (!this.state.billDate) {
        this.callAlertTimer("danger", "Please enter Bill Date... ");
      } else if (type === 'dueDays') {
        this.setState({dueDate: ""});
        this.callAlertTimer("danger", "Please enter valid Due days... ");
      } else {
        this.setState({notifyDate: ""});
        this.callAlertTimer("danger", "Please enter Notify Days... ");
      }
    }
  }

  labelSelected = (labelOption) => {
    this.props.bill ? this.setState({ labelOption, labelOptionUpdate: true }) : this.setState({ labelOption })
  }

  categorySelected = (categoryOption) => {
    this.props.bill ? this.setState({ categoryOption, alertColor: '', alertMessage: '', categoryOptionUpdate: true }) : this.setState({ categoryOption, alertColor: '', alertMessage: '' })
  }

  contactSelected = (contactOption) => {
    this.props.bill ? this.setState({ contactOption, contactOptionUpdate: true }) : this.setState({ contactOption });
  }

  toggleCustom = () => { this.setState({ moreOptions: !this.state.moreOptions }) }

  handleNotificationCheck = () => { this.setState({ checked: !this.state.checked }) }

  render() {
    const { alertColor, alertMessage, cancelCreateBill, billCreated } = this.state;
    const { labels, contacts, categories } = this.props;
    if (cancelCreateBill) {
      return <Bills />
    } else {
      return <div>{billCreated ? <Bills /> : this.selectLabels(alertColor, alertMessage, labels, categories, contacts)}</div>
    }
  }

  selectLabels = (alertColor, alertMessage, labels, categories, contacts) => {
    return this.billFormField(alertColor, labels, alertMessage, categories, contacts);
  }

  billFormField = (alertColor, labels, alertMessage, categories, contacts) => {
    const { currencies, billDate, dueDate, moreOptions, doubleClick, taxPercent, taxAmount, checked, billType, amount, dueDays } = this.state
    const { bill } = this.props
    let FormData = {
      bill: bill,
      billDate: billDate,
      amount: amount,
      currencies: currencies,
      categories: categories,
      labels: labels,
      contacts: contacts,
      moreOptions: moreOptions,
      dueDays: dueDays,
      dueDate: dueDate,
      doubleClick: doubleClick,
      taxPercent: taxPercent,
      taxAmount: taxAmount,
      checked: checked,
      billType: billType
    }
    let headerMessage = this.props.bill ? "Update Bill " : "Create Bill"
    return this.loadBillForm(FormData, alertColor, alertMessage, headerMessage)
  }

  loadBillForm = (formData, alertColor, alertMessage, headerMessage) => {
    return <div className="animated fadeIn" >
      <Card>
        <h4 className="padding-top"><b><center>{headerMessage}</center></b></h4>
        <Container>
          <Col>
            <Alert color={alertColor}>{alertMessage}</Alert>
            <BillFormUI data={formData}
              handleSubmitValue={this.handleSubmitValue}
              handleSetAmount={this.handleSetAmount}
              handleBillDate={this.handleBillDate}
              handleDate={this.handleDate}
              toggleCustom={this.toggleCustom}
              loadMoreOptions={this.loadMoreOptions}
              cancel={this.cancelCreateBill}
              labelSelected={this.labelSelected}
              contactSelected={this.contactSelected}
              categorySelected={this.categorySelected}
              buttonText={this.props.bill ? "Update Bill " : "Create Bill"}
            />
          </Col>
        </Container>
      </Card>
    </div>;
  }

  loadMoreOptions = (labels, contacts) => {
    let labelName, contactName;
    if (this.props.bill) {
      const options = Data.labels(this.props.labels);

      labelName = this.props.bill.labelIds === null ? '' : this.props.bill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat();
      contactName = Data.contacts(this.props.contacts).filter(item => { return item.value === this.props.bill.contactId })
    }
    return <Collapse isOpen={this.state.moreOptions} data-parent="#exampleAccordion" id="exampleAccordion1">
      <Row>
        <Col>
          <AvField name="taxPercent" id="taxPercent" value={this.state.taxPercent} placeholder={0}
            label="Tax (in %)" type="number" onChange={(e) => { this.handleTaxAmount(e) }} />
        </Col>
        <Col>
        {/* value={Math.round(this.state.taxAmount * 100) / 100} */}
          <AvField name='dummy' label="Tax Amount" value={Math.round(this.state.taxAmount * 100) / 100} placeholder="0" type="number" onChange={(e) => { this.handleTaxPercent(e) }} />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Labels loading in select options filed */}
          <label>Select Labels</label>
          <Select isMulti options={Data.labels(this.props.labels)} styles={Data.colourStyles} defaultValue={labelName} placeholder="Select Labels " onChange={this.labelSelected} /></Col>
        <Col>
          {/* Contacts loading in select options filed */}
          <label>Select Contacts</label>
          <Select options={Data.contacts(contacts)} defaultValue={contactName} placeholder="Select Contacts" onChange={this.contactSelected} /></Col>
      </Row><br />
      <Row style={{ marginLeft: 7 }}>
        <Col>
          <Input name="check" type="checkbox" checked={this.state.checked} value={this.state.checked}
            onChange={this.handleNotificationCheck} />Notification enabled</Col>
      </Row> <br />
      {this.state.checked &&
        <Row>
          <Col><AvField name="notifyDays" label="Notify Days" value={this.state.notifyDays} placeholder="Ex: 2" type="number" onChange={(e) => { this.handleDate(e) }} errorMessage="Invalid notify-days" /></Col>
          <Col><AvField name="notifyDate" label="notify Date" disabled value={this.state.notifyDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} /></Col>
        </Row>
      }
    </Collapse>
  }
}
export default BillForm;