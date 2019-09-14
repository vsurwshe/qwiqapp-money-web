import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Alert, Card, Col, Row, Input, Container, Button, FormGroup} from "reactstrap";
import RecurringBillsApi from "../../services/RecurringBillsApi";
import Config from "../../data/Config";
import GeneralApi from "../../services/GeneralApi";
import RecurringBills from "./RecurringBills";
import Store from "../../data/Store";
import Select from 'react-select';
import Data from "../../data/SelectData";

class CreateRecurringBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      labelOption: [],
      categoryOption: null,
      contactOption: '',
      billCreated: false,
      cancelCreateBill: false,
      doubleClick: false,
      alertColor: "",
      alertMessage: "",
      notifyRecurBill: false,
      billType: "EXPENCE_PAYABLE",
      billTypeReq: false,
      billTypecolor: "red",
      selectRepeatEvery: "DAY"
    };
  }

  componentDidMount = () => {
    new GeneralApi().getCurrencyList(this.successCurrency, this.failureCurrency)
  }

  successCurrency = (currencies) => { this.setState({ currencies }); }

  failureCurrency = (err) => { console.log(err); }

  cancelCreateBill = () => { this.setState({ cancelCreateBill: true }) }

  handleSubmitValue = (event, errors, values) => {
    let actualBillDate, recurBillDate;
    const { labelOption, categoryOption, contactOption, notifyRecurBill, billType } = this.state
    if (categoryOption === null) {
      this.callAlertTimer("warning", "Please Select Category...");
    } else if (errors.length === 0) {
      actualBillDate = values.billDate.split("-")[0] + values.billDate.split("-")[1] + values.billDate.split("-")[2] // crearte bill date
      recurBillDate = values.recurBillDate.split("-")[0] + values.recurBillDate.split("-")[1] + values.recurBillDate.split("-")[2]; // create recurBill date
      let endsonDate = values.endsOn.split("-")[0] + values.endsOn.split("-")[1] + values.endsOn.split("-")[2]
      const newData = {
        ...values,
        "billDate": recurBillDate, //Recurring Bill BillDate
        "actualBillDate": actualBillDate, // Actual Bill BillDate
        "notificationEnabled": notifyRecurBill,
        "type": billType,
        "endsOn": endsonDate,
        "categoryId": categoryOption.value,
        "contactId": contactOption.value,
        "labelIds": labelOption === [] ? '' : labelOption.map(opt => { return opt.value })
      }
      this.handlePostData(event, newData);
    }
  }

  //this method handle the Post method from user`
  handlePostData = async (e, data) => {
    e.persist();
    this.setState({ doubleClick: true })
    await new RecurringBillsApi().createRecurringBill(this.successCreate, this.errorCall, this.props.profileId, data);
  };

  //this method call when labels created successfully
  successCreate = (recurringBill) => {
    this.callAlertTimer("success", "New recuring bill created....!!");
  }

  //this handle the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", "Unable to process request, Please try later...."); };

  //this method Notifies the user after every request
  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    if (alertColor === "success") {
      setTimeout(() => {
        this.setState({ name: "", alertMessage: "", alertColor: "", billCreated: true });
      }, Config.apiTimeoutMillis);
    }
  };

  handleBillType = async () => {
    this.setState({ billTypeReq: !this.state.billTypeReq });
    await this.billTypeText()
  }

  billTypeText = async () => {
    const { billTypeReq } = this.state
    if (billTypeReq) {
      await this.setState({ billType: "EXPENSE_PAYABLE", billTypecolor: "red" });
    } else {
      await this.setState({ billType: "INCOME_RECEIVABLE", billTypecolor: "green" });
    }
  }

  handleSetAmount = e => {
    this.setState({ amount: e.target.value });
  }

  handleTaxAmount = (e) => {
    const { amount } = this.state;
    let taxPercent = parseInt(e.target.value);
    let taxAmount;
    if (amount && taxPercent >= 0) {
      taxAmount = amount - (amount * 100) / (taxPercent + 100);
      this.setState({ taxAmount: taxAmount, taxPercent: taxPercent });
    } else if (!taxPercent) {
      this.setState({ taxAmount: 0 })
    }
  }

  handleTaxPercent = (e) => {
    const { amount } = this.state;
    let taxAmount = parseInt(e.target.value);
    let taxPercent;
    if (amount && taxAmount >= 0) {
      taxPercent = (amount * 100) / (amount - taxAmount) - 100;
      this.setState({ taxAmount: taxAmount, taxPercent: taxPercent });
    } else if (!amount) {
      this.setState({ taxAmount: 0 })
    }
  }

  handleBillDate = (e) => {
    this.setState({ userBillDate: e.target.value });;
  }

  handleNotifyDate = (e) => {
    let value = e.target.value;
    if (this.state.userBillDate && value) {
      if (this.state.alertColor) { this.setState({ alertColor: '', alertMessage: '' }) }
      let billDate = new Date(this.state.userBillDate);
      billDate.setDate(billDate.getDate() + parseInt(value))
      let notifyDate = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(billDate);
      this.setState({ notifyDate });
    } else {
      if (!this.state.userBillDate) {
        this.callAlertTimer("danger", "Please enter Bill Date... ")
      } else {
        this.callAlertTimer("danger", "Please enter Notify days... ")
      }
    }
  }

  handleDueDate = (e) => {
    let value = e.target.value;
    if (this.state.userBillDate && value) {
      if (this.state.alertColor) { this.setState({ alertColor: '', alertMessage: '' }) }
      let billDate = new Date(this.state.userBillDate);
      billDate.setDate(billDate.getDate() + parseInt(value))
      let dueDate = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(billDate);
      this.setState({ dueDate });
    } else {
      if (!this.state.userBillDate) {
        this.callAlertTimer("danger", "Please enter Bill Date... ")
      } else {
        this.callAlertTimer("danger", "Please enter Due days... ")
      }
    }
  }

  setDate = (repeatEveryValue, repeatEveryCal) => {
    let currentDate = new Date(this.state.userBillDate);
    if (repeatEveryValue && repeatEveryCal) {
      switch (repeatEveryCal) {
        case "WEEK":
          currentDate.setDate(currentDate.getDate() + parseInt(repeatEveryValue) * 7);
          break;
        case "MONTH":
          currentDate.setMonth(currentDate.getMonth() + parseInt(repeatEveryValue));
          break;
        case "DAYOFMONTH":
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(parseInt(repeatEveryValue))
          break;
        case "YEAR":
          currentDate.setYear(currentDate.getFullYear() + parseInt(repeatEveryValue));
          break;
        default:
          currentDate.setDate(currentDate.getDate() + parseInt(repeatEveryValue));
          break;
      }
      let dates = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(currentDate);
      this.setState({ recurrBillDate: dates });
    } else {
      this.callAlertTimer("danger", "please select repeat every");
    }
  }

  render() {
    const { alertColor, alertMessage, cancelCreateBill, billCreated } = this.state;
    if (cancelCreateBill) {
      return <RecurringBills />
    } else {
      return <div>{billCreated ? <RecurringBills /> : this.selectLabels(alertColor, alertMessage)}</div>
    }
  }

  selectLabels = (alertColor, alertMessage) => {
    return this.recurBillForm(alertColor, alertMessage);
  }


  loadNotifications = () => {
    return <Row>
      <Col><AvField name="notifyDays" label="Notify Days" placeholder="Ex: 2" type="number"
        onChange={(e) => { this.handleNotifyDate(e) }} errorMessage="Invalid notify-days" /></Col>
      <Col><AvField name="notifyDate" label="notify Date" disabled value={this.state.notifyDate} type="date"
        errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} /></Col>
    </Row>
  }

  recurBillEvery = (e) => {
    let recurBillEvery = e.target.name = e.target.value;
    this.setState({ type: recurBillEvery, alertColor: "", alertMessage: "" });
    if (this.state.userBillDate) {
      this.setDate(e.target.value, this.state.selectRepeatEvery);
    } else {
      this.setState({ userBillDate: "" });
      this.callAlertTimer("danger", "please select bill date")
    }

  }


  recurBillOption = (e) => {
    let recurrBillOption = e.target.value;
    this.setState({ selectRepeatEvery: recurrBillOption, alertColor: "", alertMessage: "" });
    this.setDate(this.state.type, recurrBillOption)
  }


  recurBillForm = (alertColor, alertMessage) => {
  let categoryName,labelName,contactName;
  const {currencies, taxPercent, taxAmount, userBillDate, dueDays, dueDate, description, recurBill, updateAmount, currencyCode, billType, doubleClick} = this.state
  const { categories, label, contacts } = this.props

  if (recurBill) {
    const options = Data.labels(label);
    categoryName = Data.categories(categories).filter(item => { return item.value === recurBill.categoryId })
    labelName = recurBill.labelIds === null ? '' : recurBill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat();
    contactName = Data.contacts(contacts).filter(item => { return item.value === recurBill.contactId })
  }


    return (
      <div className="animated fadeIn" >
        <Card>
          <h4 className="padding-top"><b><center>Create recurring bill</center></b></h4>
          <Container>
            <Alert color={alertColor} >{alertMessage}</Alert>
            <Col>
            <AvForm onSubmit={this.handleSubmitValue}>
                <Row>
                  <Col sm={3}>
                    <AvField type="select" id="symbol" name="currency" value={currencyCode} label="Currency" errorMessage="Select Currency" required>
                      <option value="">Select</option>
                      {currencies.map((currencies, key) => {
                        return <option key={key} value={currencies.code}
                          data={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option>
                      })}
                    </AvField>
                  </Col>
                  <Col sm={3}>
                    <AvField type="select" name="label" label="Type of Bill" value={billType} errorMessage="Select Type of Bill" required>
                      <option value="">Select Type of Bill</option>
                      <option value="-">Payable</option>
                      <option value="+">Receivable</option>
                    </AvField>
                  </Col>
                  <Col sm={6}>
                    <AvField name="amount" id="amount" label="Amount" value={updateAmount} placeholder="Amount" type="number" errorMessage="Invalid amount"
                      onChange={e => { this.handleSetAmount(e) }} required />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <AvField name="taxPercent" id="taxPercent" value={taxPercent} placeholder={0} label="Tax (in %)" type="number" onChange={(e) => { this.handleTaxAmount(e) }} />
                  </Col>
                  <Col>
                    <AvField name='dummy' label="Tax Amount" value={taxAmount} placeholder="0" type="number" onChange={(e) => { this.handleTaxPercent(e) }} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {/* Categories loading in select options filed */}
                    <label >Category</label>
                    <Select options={Data.categories(categories)} defaultValue={categoryName} styles={Data.singleStyles} placeholder="Select Categories " onChange={this.categorySelected} required /></Col>
                </Row>
                <br />
                <Row>
                  <Col><AvField name="billDate" label="Bill Date" value={userBillDate} type="date"
                    onChange={(e) => { this.handleBillDate(e) }} errorMessage="Invalid Date" validate={{
                      date: { format: 'dd/MM/yyyy' },
                      dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                      required: { value: true }
                    }} /></Col>
                  <Col><AvField name="dueDays" label="Due Days" placeholder="No.of Days" onChange={e => { this.handleDueDate(e) }} value={dueDays} type="number" errorMessage="Invalid Days" /></Col>
                </Row>
                <Row>
                  <Col><AvField name="dueDate" label="Due Date" disabled value={dueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} /></Col>
                  <Col>
                    <label >Description/Notes</label>
                    <AvField name="description" type="text" list="colors" value={description} placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
                </Row>
                <Row>
                  <Col>
                    {/* Labels loading in select options filed */}
                    <label >Select Labels</label>
                    <Select isMulti options={Data.labels(label)} defaultValue={labelName} styles={Data.colourStyles} placeholder="Select Labels " onChange={this.labelSelected} /></Col>
                </Row><br />
                <Row>
                  <Col>
                    {/* Contacts loading in select options filed */}
                    <label >Contact Name</label>
                    <Select options={Data.contacts(contacts)} defaultValue={contactName} placeholder="Select Contact " onChange={this.contactSelected} /></Col>
                </Row><br />
                {this.loadCheckbox()}
                <FormGroup >
                  <center><Button color="success" disabled={doubleClick}> Save Bill </Button> &nbsp;&nbsp;
                  <Button type="button" onClick={this.cancelBill}>Cancel</Button></center>
                </FormGroup>
            </AvForm>
            </Col>
          </Container>
        </Card>
      </div>);
  }

  loadCheckbox = () => {
    return <>
      <Row>
        <Col><Input name="check" type="checkbox" checked={this.state.checked} value={this.state.checked}
          onChange={() => this.setState({ checked: !this.state.checked })} />Notification enabled</Col>
      </Row> <br />
      {this.state.checked && this.loadNotifications()}
      {Store.getProfile().type > 0 && this.loadRecurringBills()}<br />
    </>
  }

  loadRecurringBills = () => {
    return <><Row>
      <Col sm={3}>
        <AvField name="every" label="Repeats Every" placeholder="Ex: 1" type="number" onChange={(e) => { this.recurBillEvery(e) }}
          errorMessage="Invalid day" />
      </Col>
      <Col sm={3}>
        <AvField type="select" name="repeatType" value={"DAY"} label="Select Every" onChange={(e) => { this.recurBillOption(e) }}
          errorMessage="Select any Option" required>
          <option value="DAY">Day(s)</option>
          <option value="WEEK">Week(s)</option>
          <option value="MONTH">Month(s)</option>
          <option value="DAYOFMONTH">DayOfMonth(s)</option>
          <option value="YEAR">Year(s)</option>
        </AvField>
      </Col>
      <Col sm-={3}>
        <Row>
          <Col>
            <AvField name="recurBillDate" label="Next bill date" value={this.state.recurrBillDate} type="date" errorMessage="Invalid Date" disabled
              validate={{
                date: { format: 'dd/MM/yyyy' },
                dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                required: { value: true }
              }} /></Col>
          <Col md={6}>
            <AvField name="endsOn" label="Ends On" value={this.state.userBillDate} type="date" errorMessage="Invalid Date" validate={{
              date: { format: 'dd/MM/yyyy' },
              dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
              required: { value: true }
            }} />
          </Col>
        </Row>
      </Col>
    </Row>
    {/* <Row>
    <Col><Input name="check" type="checkbox" checked={this.state.endDateReq} value={this.state.endDateReq}
          // onChange={() => this.setState({ endDateReq: !this.state.endDateReq })} />Endson date</Col>
          onChange={this.setEndsOnDate} />Repeat until</Col>
    </Row>
    {this.state.endDateReq && <Col md={6}>
            <AvField name="endsOn" label="Ends On" value={this.state.endDate} type="date" errorMessage="Invalid Date" validate={{
              date: { format: 'dd/MM/yyyy' },
              dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
              required: { value: true }
            }} />
          </Col>} */}
    </>
  }
  setEndsOnDate = () => {
    this.setState({ endDateReq: !this.state.endDateReq })
    console.log(this.state.userBillDate)
    
    if (this.state.userBillDate) {
      let endDate = new Date(this.state.userBillDate);
      endDate.setMonth(endDate.getMonth()+2);
      this.setState({ endDate: new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(endDate)})
    }
  }
  
  labelSelected = (labelOption) => {
    this.setState({ labelOption })
  }

  categorySelected = (categoryOption) => {
    this.setState({ categoryOption, alertColor: '', alertMessage: '' })
  }

  contactSelected = (contactOption) => {
    this.setState({ contactOption })
  }

}
export default CreateRecurringBill;
