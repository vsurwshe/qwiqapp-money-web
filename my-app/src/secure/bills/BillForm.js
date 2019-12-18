import React, { Component } from "react";
import { AvField } from 'availity-reactstrap-validation';
import { Alert, Col, Row, Input, Collapse, Modal, ModalBody, ModalHeader } from "reactstrap";
import Select from 'react-select';
import BillApi from "../../services/BillApi";
import Bills from "./Bills";
import Data from '../../data/SelectData'
import Config from "../../data/Config";
import Store from "../../data/Store";
import { BillFormUI } from "../utility/FormsModel";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";
import RecurringBillsApi from "../../services/RecurringBillsApi";
import { profileFeature, billType, billRepeatType, recurBillType } from "../../data/GlobalKeys";
import ContactForm from "../contacts/ContactForm";
import LabelForm from "../labels/LabelForm";
import '../../css/style.css';

class BillForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: props.labels,
      contacts: props.contacts,
      categories: props.categories,
      bill: props.bill,
      profileId: props.profileId,
      currencies: Store.getCurrencies() ? Store.getCurrencies() : [],
      notifyDate: props.bill ? ShowServiceComponent.customDate(props.bill.notifyDate_) : ShowServiceComponent.loadDateFormat(new Date()),
      dueDays: props.bill ? props.bill.dueDays : 0,
      repeatType: billRepeatType.DAY,
      endDate: this.setRepeatUntilDate(new Date(), 2),
      recurId: props.bill ? props.bill.recurId : '',
      dueDate: props.bill ? ShowServiceComponent.customDate(props.bill.dueDate_) : ShowServiceComponent.loadDateFormat(new Date()),
      billDate: props.bill ? ShowServiceComponent.customDate(props.bill.billDate) : ShowServiceComponent.loadDateFormat(new Date()),
      amount: props.bill ? this.setBillAmount(props.bill.amount) : 0,
      contactOption: props.bill ? props.bill.contactId : '',
      categoryOption: props.bill ? props.bill.categoryId : null,
      labelOption: props.bill ? props.bill.labelIds : null,
      checked: props.bill ? this.props.bill.notificationEnabled : false,
      taxPercent: props.bill ? props.bill.taxPercent : 0,
      taxAmount: props.bill ? this.setBillAmount(props.bill.taxAmount_) : 0,
      notifyDays: props.bill ? props.bill.notifyDays : 0,
      type: props.bill ? props.bill.amountType : billType.PAYABLE,
      moreOptions: this.handleMoreOptions(props.bill),
      recurConfig: props.bill && props.bill.recurId ? true : false //bills
    };
  }

  componentDidMount = () => {
    if (this.props.bill && this.props.bill.recurId) {
      new RecurringBillsApi().getRecurringBillById(this.succesCallRecurById, this.errorCallRecurById, this.state.profileId, this.props.bill.recurId)
    }
  }

  succesCallRecurById = (recurBill) => {
    this.setState({
      recurBillConfig: recurBill, // recurbill
      endDate: ShowServiceComponent.customDate(recurBill.endDate),
      repeatEvery: recurBill.every,
      nextBillDate: ShowServiceComponent.customDate(recurBill.nextBillDate),
      repeatType: recurBill.repeatType,
      recurBillForever: recurBill.endDate ? true : false,
      recurBillVersion: recurBill.version
    })
  }

  errorCallRecurById = (error) => {
    console.log(error);
  }

  handleMoreOptions = (bill) => {
    const { taxPercent, contactId, labelIds, notificationEnabled, recurId } = bill ? bill : ""
    //In update bill, if any of these has value, then we need to enable MoreOptions by returning true.
    if (bill && (taxPercent || contactId || labelIds || notificationEnabled || recurId)) {
      return true
    } else {
      return false
    }
  }

  setRepeatUntilDate = (nextDate, number) => {
    let date = new Date(nextDate);
    date.setMonth(date.getMonth() + parseInt(number));
    return ShowServiceComponent.loadDateFormat(date)
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
  handleSubmitValue = async (event, errors, values) => {
    const { labelOption, categoryOption, contactOption, labelOptionUpdate, contactOptionUpdate } = this.state
    if (categoryOption === null) {
      this.callAlertTimer("warning", "Please Select Category...");
    } else if (errors.length === 0) {
      let custData = {
        ...values,
        "billDate": Data.datePassToAPI(values.billDate),
        "categoryId": categoryOption.value ? categoryOption.value : categoryOption,
        "contactId": contactOptionUpdate ? contactOption.value : (contactOption ? contactOption : ''),
        "notificationEnabled": this.state.checked,
        "taxPercent": values.taxPercent ? values.taxPercent : 0,
        "labelIds": !labelOption || labelOption === [] ? null :
          (labelOptionUpdate || this.props.bill === undefined ? labelOption.map(opt => { return opt.value }) : labelOption),
      }
      //  This condtions decied to create a bill or update bill
      if (this.props.bill) {
        let newData = { ...custData, "version": this.props.bill.version }
        let data;
        if (!this.state.recurConfig && this.props.bill.recurId) {  // update Bill With Recuredid null
          data = {
            ...newData,
            "recurId": null
          }
          this.handleUpdateBill(event, data);
        } else if (this.state.recurConfig) {
          data = {
            ...newData,
            "nextBillDate": Data.datePassToAPI(values.nextBillDate),
            "endDate": Data.datePassToAPI(this.state.endDate)
          }
          if (!this.props.bill.recurId) {
            this.handleCreateRecurBill(event, data, true, this.props.bill.id)  // update Normal Bill with Recur Configuration Added
          } else {
            let result = { ...data, "version": this.state.recurBillVersion, "billVersion": this.props.bill.version }
            this.handleUpdateRecurBill(event, result);
          }
        } else {
          this.handleUpdateBill(event, newData)
        }
      }
      // This part is creating bill
      else {
        if (this.state.recurConfig) {
          const data = {
            ...custData,
            "nextBillDate": Data.datePassToAPI(values.nextBillDate),
            "endDate": Data.datePassToAPI(this.state.endDate)
          }
          this.handleCreateRecurBill(event, data)
        } else {
          this.handleCreateBillPost(event, custData);
        }
      }
    }
  }

  handleUpdateRecurBill = async (event, data) => {
    event.persist();
    this.setState({ doubleClick: true });
    await new RecurringBillsApi().updateRecurringBill(this.successUpdateBill, this.errorCall, data, this.state.profileId, this.props.bill.recurId, null, this.props.bill.id)
  }

  handleCreateRecurBill = async (event, data, billAction, billId) => {
    event.persist();
    this.setState({ doubleClick: true });
    await new RecurringBillsApi().createRecurringBill(this.successCreate, this.errorCall, this.state.profileId, data, billAction, billId);
  }

  //this method handle the Post method from user`
  handleCreateBillPost = async (e, data) => {
    e.persist();
    this.setState({ doubleClick: true });
    await new BillApi().createBill(this.successCreateBill, this.errorCall, this.state.profileId, data);
  };

  handleUpdateBill = (e, data) => {
    e.persist();
    this.setState({ doubleClick: true });
    new BillApi().updateBill(this.successUpdateBill, this.errorCall, this.state.profileId, this.props.bill.id, data)
  };

  //this method call when labels created successfully
  successCreateBill = () => {
    this.callAlertTimer("success", "New Bill Created....");
    this.timerForBillsList()
  }

  timerForBillsList = () => {
    setTimeout(() => { // Solved Bills component load issue in 
      if (this.props.activeTab && this.props.activeTab !==1 && this.props.updateBill) {
        this.props.updateBill(null, true, true);
      } 
      this.props.cancelButton(null, true);
    }, Config.apiTimeoutMillis);
  }

  // updated bill
  successUpdateBill = () => {
    // activeTab={this.props.activeTab} updateBill={updateBill}
    this.callAlertTimer("success", "Bill Updated Successfully !! ");
    this.timerForBillsList()
  };

  //this method call when labels created successfully
  successCreate = () => { this.callAlertTimer("success", "New recuring bill created....!!"); this.timerForBillsList() }

  //this handle the error response the when api calling
  errorCall = err => {
    this.callAlertTimer("danger", "Unable to Process Request, Please try Again....");
    this.timerForBillsList()
  };

  cancelCreateBill = () => {
    this.setState({ cancelCreateBill: true })
  }

  //this method Notifies the user after every request
  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage, doubleClick: false });
    if (alertColor === "success") {
      setTimeout(() => {
        this.setState({ billCreated: true });
      }, Config.apiTimeoutMillis);
    }
  };

  handleSetAmount = e => {
    e.preventDefault()
    this.setState({ amount: e.target.value });
    const data = ShowServiceComponent.handleTax(e.target.value, this.state.taxPercent, null)
    this.setState({ taxAmount: data.taxAmount, taxPercent: data.taxPercent });
  }

  handleTaxAmount = (e) => {
    e.preventDefault()
    const data = ShowServiceComponent.handleTax(this.state.amount, e.target.value, null)
    this.setState({ taxAmount: data.taxAmount, taxPercent: data.taxPercent });
  }

  handleTaxPercent = (e) => {
    e.preventDefault()
    const data = ShowServiceComponent.handleTax(this.state.amount, null, e.target.value)
    this.setState({ taxAmount: data.taxAmount, taxPercent: data.taxPercent });
  }

  handleBillDate = async (e) => {
    await this.setState({ billDate: e.target.value });
    if (this.state.dueDays) {
      this.setDueOrNotifyDate(this.state.billDate, this.state.dueDays, "dueDays");
    }
    if (this.state.notifyDays) {
      this.setDueOrNotifyDate(this.state.billDate, this.state.notifyDays, "notifyDays");
    }
  }

  handleDate = (e) => {
    this.setState({ [e.target.name]: e.target.value })
    this.setDueOrNotifyDate(this.state.billDate, e.target.value, e.target.name)
  }

  setDueOrNotifyDate = (billDate, value, type) => {
    if (billDate && value) {
      if (this.state.alertColor) { this.setState({ alertColor: '', alertMessage: '' }) }
      let newDate = new Date(billDate);
      parseInt(value) === 0 ? newDate.setDate(newDate.getDate()) : newDate.setDate(newDate.getDate() + parseInt(value - 1))
      let date = ShowServiceComponent.loadDateFormat(newDate)
      type === 'dueDays' ? this.setState({ dueDate: date }) : this.setState({ notifyDate: date })
    } else {
      if (!billDate) {
        this.callAlertTimer("danger", "Please enter Bill Date... ")
      } else {
        if (type === 'dueDays') {
          this.setState({ dueDate: '' });
          this.callAlertTimer("danger", "Please enter Due days... ")
        } else {
          this.setState({ notifyDate: '' });
          this.callAlertTimer("danger", "Please enter Notify days... ")
        }
      }
    }
  }

  labelSelected = (labelOption) => {
    this.props.bill ? this.setState({ labelOption, labelOptionUpdate: true }) : this.setState({ labelOption })
  }

  categorySelected = (categoryOption) => {
    this.props.bill ? this.setState({ categoryOption, alertColor: '', alertMessage: '', categoryOptionUpdate: true })
      : this.setState({ categoryOption, alertColor: '', alertMessage: '' })
  }

  contactSelected = (contactOption) => {
    this.props.bill ? this.setState({ contactOption, contactOptionUpdate: true }) : this.setState({ contactOption });
  }

  toggleCustom = () => { this.setState({ moreOptions: !this.state.moreOptions }) }

  handleRecurBillCheck = () => { this.setState({ recurConfig: !this.state.recurConfig }) }
  handleNotificationCheck = () => { this.setState({ checked: !this.state.checked }) }
  handlRecurBillForever = () => { this.setState({ recurBillForever: !this.state.recurBillForever }) }

  handleEveryRecurBill = (e) => {
    this.setState({ repeatEvery: e.target.value, alertColor: "", alertMessage: "" });
    this.setNextBillDate(e.target.value, this.state.repeatType);
  }

  recurBillOption = (e) => {
    this.setState({ repeatType: e.target.value, alertColor: "", alertMessage: "" });
    this.setNextBillDate(this.state.repeatEvery, e.target.value)
  }

  setNextBillDate = (repeatEvery, repeatEveryType) => {
    let date = this.state.billDate ? this.state.billDate : new Date();
    let billDate = new Date(date);
    if (repeatEvery && repeatEveryType) {
      const { WEEK, MONTH, DAYOFMONTH, YEAR } = recurBillType;
      switch (repeatEveryType) {
        case WEEK:
          billDate.setDate(billDate.getDate() + parseInt(repeatEvery) * 7);
          break;
        case MONTH:
          billDate.setMonth(billDate.getMonth() + parseInt(repeatEvery));
          break;
        case DAYOFMONTH:
          billDate.setMonth(billDate.getMonth() + 1);
          billDate.setDate(parseInt(repeatEvery))
          break;
        case YEAR:
          billDate.setYear(billDate.getFullYear() + parseInt(repeatEvery));
          break;
        default:
          billDate.setDate(billDate.getDate() + parseInt(repeatEvery));
          break;
      }
      let dates = ShowServiceComponent.loadDateFormat(billDate);
      this.setState({ nextBillDate: dates, endDate: this.setRepeatUntilDate(dates, 2) });
    } else {
      this.callAlertTimer("danger", "Please select repeat every");
    }
  }

  handleNextDate = (e) => {
    this.setState({ nextBillDate: e.target.value, endDate: this.setRepeatUntilDate(e.target.value, 2) });
  }

  handleEndDate = (e) => {
    this.setState({ endDate: e.target.value, doubleClick: false });
    this.validateEndDate(e.target.value)
  }

  validateEndDate = (endDate) => {
    if (this.state.nextBillDate) {
      let diffEndDateAndNxtBillDate = new Date(endDate) - new Date(this.state.nextBillDate);
      if ((diffEndDateAndNxtBillDate / (1000 * 60 * 60 * 24)) < 0) {
        this.setState({ doubleClick: true })
        this.callAlertTimer("danger", "end date should be after the next bill date");
      }
    }
  }

  toggleCreateModal = (item, success) => {
    this.setState({ createModal: !this.state.createModal });
    item && this.setState({ createItem: item });
    if (success) {
      this.state.createItem === 'Contacts' ? this.props.getContacts(true) : this.props.getLabels(true)
    }
  }

  render() {
    const { alertColor, alertMessage, cancelCreateBill, billCreated } = this.state;
    const { labels, contacts, categories } = this.props;
    // console.log(this.props.activeTab, "cancelCreateBill", cancelCreateBill, "billCreated", billCreated)
    if (cancelCreateBill) {
      return <Bills />
    } else {
      return <div>{billCreated ? <Bills /> : this.billFormField(alertColor, alertMessage, labels, categories, contacts)}</div>
    }
  }

  billFormField = (alertColor, alertMessage, labels, categories, contacts) => {
    const { currencies, billDate, dueDate, moreOptions, doubleClick, taxPercent, taxAmount, checked, type, amount, dueDays } = this.state
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
      type: type
    }
    let headerMessage = this.props.bill ? " " : " New Bill Details "
    return <>
      {this.loadBillForm(FormData, alertColor, alertMessage, headerMessage)}
      {this.state.createModal && this.loadCreateModal()}
    </>
  }

  loadBillForm = (formData, alertColor, alertMessage, headerMessage) => {
    return <div className="animated fadeIn" >
      <h4 ><b><center>{headerMessage}</center></b></h4>
      <Col><br />
        {alertColor && <Alert color={alertColor}>{alertMessage}</Alert>}
        <BillFormUI data={formData}
          handleSubmitValue={this.handleSubmitValue}
          handleSetAmount={this.handleSetAmount}
          handleBillDate={this.handleBillDate}
          handleDate={this.handleDate}
          toggleCustom={this.toggleCustom}
          loadMoreOptions={this.loadMoreOptions}
          cancel={this.props.cancelButton}
          labelSelected={this.labelSelected}
          contactSelected={this.contactSelected}
          categorySelected={this.categorySelected}
          buttonText="Save Bill"
        />
      </Col>
    </div>;
  }

  loadMoreOptions = () => {
    const featureRecurring = Store.getProfile().features.includes(profileFeature.RECURRING);
    const { labels, contacts, bill } = this.props;
    let labelName, contactName;
    if (bill) {
      const options = Data.categoriesOrLabels(labels);
      labelName = bill.labelIds ? bill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat() : '';
      contactName = Data.contacts(contacts).filter(item => { return item.value === bill.contactId })
    }
    return <Collapse isOpen={this.state.moreOptions} data-parent="#exampleAccordion" id="exampleAccordion1">
      {this.loadHorizontalLine()}
      <Row>
        <Col>
          <Row>
            <Col sm={3}> <label>Tax (in %)</label></Col>
            <Col><AvField name="taxPercent" id="taxPercent" value={this.state.taxPercent} placeholder={0}
              label="" type="number" onChange={(e) => { this.handleTaxAmount(e) }} /></Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col sm={3}> <label>Tax amount</label></Col>
            <Col><AvField name='dummy' value={Math.round(this.state.taxAmount * 100) / 100} placeholder="0" type="number" onChange={(e) => { this.handleTaxPercent(e) }} /> </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col sm={3}> <label>Labels</label></Col>
            <Col>{labels ? <>
              <Select isMulti options={Data.categoriesOrLabels(labels)} styles={Data.colourStyles} defaultValue={labelName} placeholder="Select Labels" onChange={this.labelSelected} /></>
              : <p style={{ paddingTop: contacts && "10px", textDecoration: "none" }} onClick={() => this.toggleCreateModal("Labels")}>You don't have Labels, <u>Click here</u> to Create </p>}
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col sm={3}> <label>Contacts</label></Col>
            <Col>{contacts ? <>
              <Select options={Data.contacts(contacts)} defaultValue={contactName} placeholder="Select Contacts" onChange={this.contactSelected} /></>
              : <p style={{ paddingTop: labels && "10px", textDecoration: "none" }} onClick={() => this.toggleCreateModal("Contacts")}> You don't have Contacts, <u>Click here</u> to  Create</p>}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
      </Row><br />
      <Row style={{ paddingLeft: 38 }}>
        <Input name="check" type="checkbox" checked={this.state.checked} value={this.state.checked} onChange={this.handleNotificationCheck} />Enable notification
          {this.state.checked && <>&nbsp;  from  &nbsp; <AvField name="notifyDays" style={{ all: 'unset', borderBottom: '1px solid', width: 50 }}
          value={this.state.notifyDays} placeholder="0" type="number" onChange={(e) => { this.handleDate(e) }} errorMessage="Invalid notify-days" />
          &nbsp;days of Bill Date &nbsp;({this.state.notifyDate} &nbsp;onwards)
            </>}
      </Row> <br />
      {/* This checks the profile feature Recurring and shows Recurring Configuration logic if the feature exists */}
      {featureRecurring && <>
        <Row style={{ paddingLeft: 38 }}>
          <Input name="check" type="checkbox" checked={this.state.recurConfig} value={this.state.recurConfig} onChange={this.handleRecurBillCheck} /> Recurring Bill {this.state.recurConfig && <p style={{ paddingLeft: 5 }}>USING BELOW RECURRING CONFIGURATION: </p>}
        </Row>
        <br />
        {this.state.recurConfig ? this.loadRecurBill() : ''}</>}
    </Collapse>
  }

  // It loads the model if contacts/labels are Empty, then creating..  
  loadCreateModal = () => {
    const { createItem, createModal, profileId } = this.state
    const { labels } = this.props
    return <Modal isOpen={createModal} toggle={() => this.toggleCreateModal()} style={{ paddingTop: "20%" }} backdrop={true}>
      <ModalHeader toggle={() => this.toggleCreateModal()}>{createItem}</ModalHeader>
      <ModalBody>
        {createItem === 'Labels' ? <LabelForm profileId={profileId} hideButton={true} toggleCreateModal={this.toggleCreateModal} />
          : <ContactForm lables={labels} profileId={profileId} hideButton={true} toggleCreateModal={this.toggleCreateModal} />}
      </ModalBody>
    </Modal>
  }

  loadHorizontalLine = () => <><br /> <div className="hr-main">
    <span className="hr-text">
      &nbsp; Optional &nbsp;
      </span>
  </div><br /> </>

  // This Method Load Recuring Config.
  loadRecurBill = () => {
    const { repeatEvery, repeatType, nextBillDate, endDate, recurBillForever } = this.state;
    const { DAY, WEEK, MONTH, DAYOFMONTH, YEAR } = recurBillType;
    let smValue = recurBillForever ? 3 : 5
    // activeTab={this.props.activeTab} updateBill={updateBill}
    return (
      <>
        <Row>
          <Col >
            <Row>
              <Col sm={3}><label>Repeats Every</label> </Col>
              <Col><AvField name="every" placeholder="Ex: 1" type="number" value={repeatEvery} onChange={(e) => { this.handleEveryRecurBill(e) }} errorMessage="Invalid day" /></Col>
            </Row>
          </Col>
          <Col >
            <Row>
              <Col sm={3}><label>Select Every</label> </Col>
              <Col>
                <AvField type="select" name="repeatType" value={repeatType} onChange={(e) => { this.recurBillOption(e) }}
                  errorMessage="Select any Option" required>
                  <option value={DAY}>Day(s)</option>
                  <option value={WEEK}>Week(s)</option>
                  <option value={MONTH}>Month(s)</option>
                  <option value={DAYOFMONTH}>DayOfMonth(s)</option>
                  <option value={YEAR}>Year(s)</option>
                </AvField>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col sm={3}><label>Next bill date</label> </Col>
              <Col> <AvField name="nextBillDate" value={nextBillDate} type="date" errorMessage="Invalid Date" onChange={(e) => { this.handleNextDate(e) }}
                validate={{
                  date: { format: 'dd/MM/yyyy' },
                  dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                  required: { value: true }
                }} />
              </Col>
            </Row>
          </Col>
          <Col >
            <Row>
              <Col sm={smValue}>
                <span style={{ marginLeft: 25 }} >
                  <Input name="check" type="checkbox" checked={recurBillForever === true} value={recurBillForever} onChange={this.handlRecurBillForever} />
                  {recurBillForever ? "End date" : "Repeating forever"}</span></Col>
              <br />
              <Col>
                {recurBillForever && <>
                  <AvField name="endDate" value={endDate} type="date" errorMessage="Invalid Date" onChange={(e) => { this.handleEndDate(e) }} validate={{
                    date: { format: 'dd/MM/yyyy' },
                    dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                    required: { value: true }
                  }} /></>}</Col>
            </Row>
          </Col>
        </Row>
      </>
    )
  }
}
export default BillForm;