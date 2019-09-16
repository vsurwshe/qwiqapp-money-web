import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Col, Row, Alert, Card, CardHeader, Collapse, Input, Container, FormGroup, Button } from "reactstrap";
import Select from 'react-select';
import RecurringBillsApi from "../../services/RecurringBillsApi";
import Data from '../../data/SelectData';
import Config from "../../data/Config";
import RecurringBills from "./RecurringBills";
import Store from "../../data/Store";

class UpdateRecurringBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: "#000000",
      alertMessage: '',
      labels: props.lables,
      categories: props.categories,
      contacts: props.contacts,
      recurBill: props.updateRecurBill,
      labelOption: props.updateRecurBill.labelIds,
      updateAmount: props.updateRecurBill.amount,
      contactOption: props.updateRecurBill.coontactId,
      categoryOption: props.updateRecurBill.categoryId,
      notifyDate: this.loadDateFormat(props.updateRecurBill.notifyDate_),
      notifyDays: props.updateRecurBill.notifyDays,
      nextBillDate: this.loadDateFormat(props.updateRecurBill.nextBillDate),
      endsOn: this.loadDateFormat(props.updateRecurBill.endsOn),
      dueDays: props.updateRecurBill.dueDays,
      dueDate: this.loadDateFormat(props.updateRecurBill.dueDate_),
      taxAmount: props.updateRecurBill.taxAmount_,
      taxPercent: props.updateRecurBill.taxPercent,
      checked: props.updateRecurBill.notificationEnabled,
      billType: props.updateRecurBill.amount > 0 ? "+" : "-",
      billTypecolor: props.updateRecurBill.amount > 0 ? "green" : "red",
      categoryOptionUpdate: false,
      labelOptionUpdate: false,
      contactOptionUpdate: false,
      currencies: [],
      updateSuccess: false,
      cancelUpdateBill: false,
      recurringToggle: true,
      repeatType: props.updateRecurBill.repeatType,
      repeatEvery: props.updateRecurBill.every
    };
  }

  handleBillType = async () => {
    this.setState({ billTypeReq: !this.state.billTypeReq });
    await this.billTypeText()
  }

  billTypeText = async () => {
    const { billTypeReq } = this.state
    if (!billTypeReq) {
      await this.setState({ billTypecolor: "red" });
    } else {
      await this.setState({ billTypecolor: "green" });
    }
  }

  componentDidMount = async () => {
    let splitAmount = ("" + this.state.updateAmount).split('-');
    let taxAmt = ("" + this.state.taxAmount).split('-');

    if (splitAmount.length === 1 && taxAmt.length === 1) {
      this.setState({ updateAmount: splitAmount[0], taxAmount: taxAmt[0] });
    } else {
      this.setState({ updateAmount: splitAmount[1], taxAmount: taxAmt[1] });
    }
    let currency = Store.getCurrencies("CURRENCIES");
    this.successCurrency(currency);
  }

  successCurrency = currencies => {
    this.setState({ currencies });
  }

  cancelUpdateBill = () => {
    this.setState({ cancelUpdateBill: true })
  }

  // handle form submission values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, categoryOptionUpdate, labelOptionUpdate, contactOptionUpdate, contactOption } = this.state
    if (errors.length === 0) {
      let nextBillDate = values.recurBillDate.split("-")[0] + values.recurBillDate.split("-")[1] + values.recurBillDate.split("-")[2];
      let endDate = values.endsOn.split("-")[0] + values.endsOn.split("-")[1] + values.endsOn.split("-")[2];
      const newData = {
        ...values, "nextBillDate": nextBillDate, "categoryId": categoryOptionUpdate ? categoryOption.value : categoryOption,
        "amount": values.label + values.amount, "endsOn": endDate,
        "contactId": contactOptionUpdate ? contactOption.value : contactOption, "notificationEnabled": this.state.checked,
        "labelIds": labelOption === null || labelOption === [] ? [] : (labelOptionUpdate ? labelOption.map(opt => { return opt.value }) : labelOption), "version": this.state.recurBill.version
      }
      this.handleUpdate(event, newData);
    }
  }

  handleUpdate = (e, data) => {
    new RecurringBillsApi().updateRecurringBill(this.successCall, this.errorCall, data, this.props.profileId, this.state.recurBill.id)
  };

  successCall = response => {
    this.callAlertTimer("success", "Recurring Bill Updated Successfully... ");
  };

  errorCall = err => {
    console.log(err.response, err.request);
    this.callAlertTimer("danger", "Unable to process request, Please Try Again... ");
  };

  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    if (alertColor === "success") {
      setTimeout(() => {
        this.setState({ name: '', alertColor: '', updateSuccess: true });
      }, Config.apiTimeoutMillis);
    }
  };

  labelSelected = (labelOption) => {
    this.setState({ labelOption, labelOptionUpdate: true })
  }

  categorySelected = (categoryOption) => {
    this.setState({ categoryOption, categoryOptionUpdate: true })
  }

  contactSelected = (contactOption) => {
    this.setState({ contactOption, contactOptionUpdate: true })
  }

  handleSetAmount = async (e) => {
    await this.setState({ updateAmount: e.target.value });
    this.setTaxAmt(this.state.taxPercent)
  }

  handleTaxAmount = (e) => {
    let taxPercent = parseInt(e.target.value);
    let taxAmount;
    const { updateAmount } = this.state;
    if (updateAmount && taxPercent >= 0) {
      taxAmount = updateAmount - (updateAmount * 100) / (taxPercent + 100);
      this.setState({ taxAmount: taxAmount, taxPercent: taxPercent });
    }
    else if (taxPercent === '') {
      this.setState({ taxAmount: 0 })
    }
  }

  setTaxAmt = (taxPercent) => {
    let taxAmount;
    const { updateAmount } = this.state;
    if (updateAmount && taxPercent >= 0) {
      taxAmount = updateAmount - (updateAmount * 100) / (taxPercent + 100);
      this.setState({ taxAmount: taxAmount, taxPercent: taxPercent });
    }
    else if (taxPercent === '') {
      this.setState({ taxAmount: 0 })
    }
  }

  handleTaxPercent = (e) => {
    const { updateAmount } = this.state;
    let taxAmount = parseInt(e.target.value);
    let taxPercent;
    if (updateAmount && taxAmount >= 0) {
      taxPercent = (updateAmount * 100) / (updateAmount - taxAmount) - 100;
      this.setState({ taxAmount: taxAmount, taxPercent: taxPercent });
    } else if (updateAmount || taxAmount) {
      this.setState({ taxAmount: 0 })
    }
  }

  handleBillDate = async (e) => {
    await this.setState({ nextBillDate: e.target.value });
    this.recurBillNextDate(this.state.repeatEvery, this.state.repeatType);
  }

  handleNotifyDate = async (e) => {
    let value = await e.target.value;
    if (this.state.nextBillDate && value) {
      if (this.state.alertColor) { this.setState({ alertColor: '', content: '' }) }
      let nextBillDate = new Date(this.state.nextBillDate);
      nextBillDate.setDate(nextBillDate.getDate() + parseInt(value))
      let notifyDate = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(nextBillDate);
      this.setState({ notifyDate });
    } else {
      if (!this.state.nextBillDate) {
        this.callAlertTimer("danger", "Please enter Bill Date... ")
      } else {
        this.callAlertTimer("danger", "Please enter Notify days... ")
      }
    }
  }

  handleDueDate = (e) => {
    let value = e.target.value;
    if (this.state.nextBillDate && value) {
      if (this.state.alertColor) { this.setState({ alertColor: '', content: '' }) }
      let nextBillDate = new Date(this.state.nextBillDate);
      nextBillDate.setDate(nextBillDate.getDate() + parseInt(value))
      let dueDate = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(nextBillDate);
      this.setState({ dueDate });
    } else {
      if (!this.state.nextBillDate) {
        this.callAlertTimer("danger", "Please enter Bill Date... ")
      } else {
        this.callAlertTimer("danger", "Please enter Due days... ")
      }
    }
  }

  render() {
    const { alertColor, alertMessage, cancelUpdateBill, updateSuccess, recurBill, labels, categories, contacts } = this.state;
    if (cancelUpdateBill) {
      return <RecurringBills />
    } else {
      return <div>{updateSuccess ? <RecurringBills /> : this.updateRecurringBillForm(alertColor, alertMessage, recurBill, labels, categories, contacts)}</div>
    }
  }

  loadHeader = () => <CardHeader><strong>Update Recurring Bill</strong></CardHeader>

  // when updating Form
  updateRecurringBillForm = (alertColor, alertMessage, recurBill, labels, categories, contacts) => {
    const { currencies, taxPercent, taxAmount, dueDays, dueDate, updateAmount, billType } = this.state
    let categoryName, labelName, contactName;
    if (recurBill) {
      const options = Data.labels(labels);
      categoryName = Data.categories(categories).filter(item => { return item.value === recurBill.categoryId })
      labelName = recurBill.labelIds === null ? '' : recurBill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat();
      contactName = Data.contacts(contacts).filter(item => { return item.value === recurBill.contactId })
    }

    return (
      <div className="animated fadeIn" >
        <Card>
          <h4 className="padding-top"><b><center>Edit recurring bill</center></b></h4>
          <Container>
            {alertColor === "" ? "" : <Alert color={alertColor}>{alertMessage}</Alert>}
            <Col>
              <AvForm onSubmit={this.handleSubmitValue}>
                <Row>
                  <Col sm={3}>
                    <AvField type="select" id="symbol" name="currency" value={recurBill.currency} label="Currency" errorMessage="Select Currency" required>
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
                  <Col><AvField name="nextBillDate" label="Bill Date" value={this.state.nextBillDate} type="date"
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
                    <AvField name="description" type="text" list="colors" value={recurBill.description} placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
                </Row>
                <Row>
                  <Col>
                    {/* Labels loading in select options filed */}
                    <label >Select Labels</label>
                    <Select isMulti options={Data.labels(labels)} defaultValue={labelName} styles={Data.colourStyles} placeholder="Select Labels " onChange={this.labelSelected} /></Col>
                </Row><br />
                <Row>
                  <Col>
                    {/* Contacts loading in select options filed */}
                    <label >Contact Name</label>
                    <Select options={Data.contacts(contacts)} defaultValue={contactName} placeholder="Select Contact " onChange={this.contactSelected} /></Col>
                </Row><br />
                {this.loadCheckbox()}
                <FormGroup >
                  <center><Button color="success" > Edit </Button> &nbsp;&nbsp;
      <Button type="button" onClick={this.cancelUpdateBill}>Cancel</Button></center>
                </FormGroup>
              </AvForm>

            </Col>
          </Container>
        </Card>
      </div>)
  }

  loadDateFormat = (dateParam) => {
    let toStr = "" + dateParam
    let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
    let date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);  //finalDate;
  }

  lablesOptions = (labels, recurBill) => {
    const options = Data.labels(labels)
    const data = recurBill.labelIds === null ? '' : recurBill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat();
    return <Select isMulti options={options} defaultValue={data} styles={Data.colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.labelSelected} />;
  }

  // This Functions load the Checkbox 
  loadCheckbox = () => {
    return <>
      <Row>
        <Col><Input name="check" type="checkbox" checked={this.state.checked} value={this.state.checked} onChange={() => this.setState({ checked: !this.state.checked })} />Notification enabled</Col>
      </Row> <br />
      {this.state.checked && this.loadNotifications()}
      {Store.getProfile().type > 0 &&
        <Row>
          <Col><Input name="check" type="checkbox" checked={this.state.recurringToggle} value={this.state.recurringToggle} onChange={() => this.setState({ recurringToggle: !this.state.recurringToggle })} />Make as Recurring Bills </Col>
        </Row>
      }<br />
      {this.state.recurringToggle && this.loadRecurringBills()}
    </>
  }


  // This Fucntion load the Notifications
  loadNotifications = () => {
    return <Row>
      <Col><AvField name="notifyDays" label="Notify Days" placeholder="Ex: 2" type="number" value={this.state.notifyDays} onChange={(e) => { this.handleNotifyDate(e) }} errorMessage="Invalid notify-days" /></Col>
      <Col><AvField name="notifyDate" label="notify Date" disabled value={this.state.notifyDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} /></Col>
    </Row>
  }

  // This Function load the Create Recurring Bills
  loadRecurringBills = () => {
    return <Collapse isOpen={this.state.recurringToggle}>
      <Row>
        <Col sm={2}>
          <AvField name="every" label="Repeats Every" placeholder="Ex: 1" value={this.state.repeatEvery} type="number" onChange={(e) => { this.recurBillEvery(e) }} errorMessage="Invalid day" />  </Col>
        <Col sm={3}>
          <AvField type="select" name="repeatType" value={this.state.repeatType} label="Select Every" onChange={(e) => { this.recurBillOption(e) }} errorMessage="Select any Option" required>
            <option value="DAY">Day</option>
            <option value="WEEK">Week</option>
            <option value="MONTH">Month</option>
            <option value="DAYOFMONTH">Date of Month</option>
            <option value="YEAR">Year</option>
          </AvField>
        </Col>
        <Col sm-={3}>
          <Row>
            <Col md={6}>
              <AvField name="recurBillDate" label="Next bill date" value={this.state.nextBillDate} type="date" errorMessage="Invalid Date" disabled
                validate={{
                  date: { format: 'dd/MM/yyyy' },
                  dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                  required: { value: true }
                }} /></Col>
            <Col md={6}>
              <AvField name="endsOn" label="Ends On" value={this.state.endsOn} type="date" errorMessage="Invalid Date" validate={{
                date: { format: 'dd/MM/yyyy' },
                dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                required: { value: true }
              }} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Collapse>
  }

  recurBillEvery = (e) => {
    let repeatEvery = e.target.value;
    this.setState({ repeatEvery, alertColor: "", alertMessage: "" });
    this.recurBillNextDate(repeatEvery, this.state.repeatType);
  }

  recurBillOption = (e) => {
    let repeatType = e.target.value;
    this.setState({ repeatType, alertColor: "", alertMessage: "" });
    this.recurBillNextDate(this.state.repeatEvery, repeatType)
  }

  recurBillNextDate = (repeatEveryValue, repeatEveryCal) => {
    let currentDate = new Date(this.state.nextBillDate);
    if (repeatEveryValue && repeatEveryCal) {
      switch (repeatEveryCal) {
        case "WEEK":
          currentDate.setDate(currentDate.getDate() + parseInt(repeatEveryValue) * 7);
          break;
        case "MONTH": currentDate.setMonth(currentDate.getMonth() + parseInt(repeatEveryValue));
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
      this.setState({ nextBillDate: dates });
    } else {
      this.callAlertTimer("danger", "Please select Repeat Every ...");
    }
  }
}

export default UpdateRecurringBill;
