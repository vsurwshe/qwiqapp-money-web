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
import { RECURRINGBILLSELECTION } from "./RECURRINGBILLSELECTION";

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
      billType: "EXPENSE_PAYABLE",
      billTypeReq: false,
      billTypecolor: "red",
      selectRepeatEvery: "DAY",
      endDate: this.defaultEndDateSet(true, 3),
    };
  }

  componentDidMount = () => {
    new GeneralApi().getCurrencyList(this.successCurrency, this.failureCurrency)
  }

  successCurrency = (currencies) => { this.setState({ currencies }); }

  failureCurrency = (err) => { console.log(err); }

  cancelCreateBill = () => { this.setState({ cancelCreateBill: true }) }

  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, contactOption, notifyRecurBill, billType } = this.state
    if (categoryOption === null) {
      this.callAlertTimer("warning", "Please Select Category...");
    } else if (errors.length === 0) {
      const newData = {
        ...values,
        "billDate": Data.datePassToAPI(values.billDate),
        "nextBillDate": Data.datePassToAPI(values.nextBillDate),
        "notificationEnabled": notifyRecurBill,
        "type": billType,
        "endsOn": Data.datePassToAPI(values.endsOn),
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
  errorCall = err => { 
    console.log(err)
    this.setState({ doubleClick: false });
    this.callAlertTimer("danger", "Unable to process request, Please try later...."); };

  //this method Notifies the user after every request
  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    if (alertColor === "success") {
      setTimeout(() => {
        this.setState({ name: "", alertMessage: "", alertColor: "", billCreated: true });
      }, Config.apiTimeoutMillis);
    }
  };

  // handleBillType = async () => {
  //   this.setState({ billTypeReq: !this.state.billTypeReq });
  //   await this.billTypeText()
  // }

  // billTypeText = async () => {
  //   const { billTypeReq } = this.state
  //   if (billTypeReq) {
  //     await this.setState({ billType: "EXPENSE_PAYABLE", billTypecolor: "red" });
  //   } else {
  //     await this.setState({ billType: "INCOME_RECEIVABLE", billTypecolor: "green" });
  //   }
  // }

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
        case RECURRINGBILLSELECTION.WEEK:
          currentDate.setDate(currentDate.getDate() + parseInt(repeatEveryValue) * 7);
          break;
        case RECURRINGBILLSELECTION.MONTH:
          currentDate.setMonth(currentDate.getMonth() + parseInt(repeatEveryValue));
          break;
        case RECURRINGBILLSELECTION.DAYOFMONTH:
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(parseInt(repeatEveryValue))
          break;
        case RECURRINGBILLSELECTION.YEAR:
          currentDate.setYear(currentDate.getFullYear() + parseInt(repeatEveryValue));
          break;
        default:
          currentDate.setDate(currentDate.getDate() + parseInt(repeatEveryValue));
          break;
      }
      let dates = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(currentDate);
      let diff = new Date(this.state.endDate) - new Date(dates)
      if (diff/(1000*60*60*24) >= 0) {
        this.setState({ recurrBillDate: dates });
      } else {
        this.callAlertTimer("danger", "invalid next bill date, please change end_date or nextBillDate");
      }
      
    } else {
      this.callAlertTimer("danger", "please select repeat every");
    }
  }

  defaultEndDateSet = (type, number) => {
    let endDate = new Date();
    if (type) {
      endDate.setMonth(endDate.getMonth()+ parseInt(number));
    } else {
      endDate.setFullYear(endDate.getFullYear()+ parseInt(number) )
    }
    let endDateVal = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(endDate);
    return endDateVal;
  }
  handleSelectRecurBillEndDateType = (e) =>{
    let number = e.target.value.split(',')[1];
    let type = e.target.value.includes("MONTH");    
    this.setState({ endDate: this.defaultEndDateSet(type, number) });
  }

  categorySelected = (categoryOption) => {
    this.setState({ categoryOption, alertColor: '', alertMessage: '' })
  }

  contactSelected = (contactOption) => {
    this.setState({ contactOption })
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
        onChange={(e) => { this.handleDueDate(e) }} errorMessage="Invalid notify-days" /></Col>
      <Col><AvField name="notifyDate" label="notify Date" disabled value={this.state.notifyDate} type="date"
        errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} /></Col>
    </Row>
  }

  handleEveryRecurBill = (e) => {
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
                    <AvField type="select" name="type" label="Type of Bill" value={billType} errorMessage="Select Type of Bill" required>
                    {/* <AvField type="select" name="label" label="Type of Bill" value={billType} errorMessage="Select Type of Bill" required> */}
                      {/* <option value="">Select Type of Bill</option> */}
                      <option value="EXPENSE_PAYABLE">Payable</option>
                      <option value="INCOME_RECEIVABLE">Receivable</option>
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
                      // dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
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
      {Store.getProfile().type > 0 && this.selectEveryRecurBill()}<br />
    </>
  }

  selectEveryRecurBill = () => {
    return <><Row>
      <Col sm={3}>
        <AvField name="every" label="Repeats Every" placeholder="Ex: 1" type="number" onChange={(e) => { this.handleEveryRecurBill(e) }}
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
            <AvField name="nextBillDate" label="Next bill date" value={this.state.recurrBillDate} type="date" errorMessage="Invalid Date" disabled
              validate={{
                date: { format: 'dd/MM/yyyy' },
                dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                required: { value: true }
              }} /></Col>
                 {/* EndDate dependents on end's months/year's   */}
          <Col> 
          <AvField type="select" name="endRecurDate" value={RECURRINGBILLSELECTION.ONE_MONTH} label="Select Every" onChange={(e) => { this.handleSelectRecurBillEndDateType(e) }}
          errorMessage="Select any Option" required>
          <option value={RECURRINGBILLSELECTION.ONE_MONTH}>One month</option>
          <option value={RECURRINGBILLSELECTION.TWO_MONTHS}>Two months</option>
          <option value={RECURRINGBILLSELECTION.THREE_MONTHS}>Three months</option>
          <option value={RECURRINGBILLSELECTION.FOUR_MONTHS}>Four month</option>
          <option value={RECURRINGBILLSELECTION.FIVE_MONTHS}>Five months</option>
          <option value={RECURRINGBILLSELECTION.SIX_MONTHS}>Six months</option>
          <option value={RECURRINGBILLSELECTION.ONE_YEAR}>One year</option>
          <option value={RECURRINGBILLSELECTION.EIGHTEEN_MONTHS}>Eighteen months</option>
          <option value={RECURRINGBILLSELECTION.TWO_YEARS}>Two years</option>
          <option value={RECURRINGBILLSELECTION.THREE_YEARS}>Three years</option>
          <option value={RECURRINGBILLSELECTION.FOUR_YEARS}>Four years</option>
          <option value={RECURRINGBILLSELECTION.FIVE_YEARS}>Five years</option>
          <option value={RECURRINGBILLSELECTION.TEN_YEARS}>Ten years</option>
        </AvField>
        </Col>
        <Col md={6}>
            <AvField name="endsOn" label="Ends On" value={this.state.endDate} type="date" errorMessage="Invalid Date" validate={{
              date: { format: 'dd/MM/yyyy' },
              dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
              required: { value: true }
            }} />
          </Col>
        </Row>
      </Col>
    </Row>
    </>
  }
}
export default CreateRecurringBill;
