import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Col, Row, Alert, FormGroup, Card, CardHeader } from "reactstrap";
import Select from 'react-select';
import Lables from "./Bills";
import BillApi from "../../services/BillApi";
import Data from '../../data/SelectData';
import Bills from "./Bills";
import Config from "../../data/Config";
import GeneralApi from "../../services/GeneralApi";

class UpdateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: "#000000",
      content: '',
      updateSuccess: false,
      profileId: props.pid,
      labels: props.lables,
      categories: props.categories,
      contacts: props.contacts,
      bill: props.bill,
      labelOption: props.bill.labelIds,
      categoryOptionUpdate: false,
      labelOptionUpdate: false,
      contactOptionUpdate: false,
      contactOption: props.bill.coontactId,
      categoryOption: props.bill.categoryId,
      currencies: [],
      userAmount: props.bill.amount,
      cancelUpdateBill: false,
    };
  }

  componentDidMount = async () => {
    new GeneralApi().getCurrencyList(this.successCurrency, this.failureCurrency)
  }

  successCurrency = currencies => {
    this.setState({ currencies });
  }

  failureCurrency = err => {
    console.log(err);
  }

  cancelUpdateBill = () => {
    this.setState({ cancelUpdateBill: true })
  }

  // handle form submission values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, categoryOptionUpdate, labelOptionUpdate, contactOptionUpdate, contactOption } = this.state
    if (errors.length === 0) {
      let billDate = values.billDate.split("-")[0] + values.billDate.split("-")[1] + values.billDate.split("-")[2];
      const newData = {
        ...values, "billDate": billDate, "categoryId": categoryOptionUpdate ? categoryOption.value : categoryOption,
        "contactId": contactOptionUpdate ? contactOption.value : contactOption,
        "labelIds": labelOption === null || labelOption === [] ? [] : (labelOptionUpdate ? labelOption.map(opt => { return opt.value }) : labelOption), "version": this.props.bill.version
      }
      this.handleUpdate(event, newData);
    }
  }

  handleUpdate = (e, data) => {
    new BillApi().updateBill(this.successCall, this.errorCall, data, this.state.profileId, this.props.bill.id)
  };

  // updated bill
  successCall = json => {
    this.callAlertTimer("success", "Bill Updated Successfully... ");
  };

  // updated bill Error messages
  errorCall = err => {
    this.callAlertTimer("danger", "Unable to process request, Please Try Again... ");
  };

  // shows the response messages for user
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: '', alertColor: '', updateSuccess: true });
    }, Config.notificationMillis);
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

  render() {
    const { alertColor, content, updateSuccess, labels, categories, bill, cancelUpdateBill, contacts } = this.state;
    if (cancelUpdateBill) {
      return <Bills />
    } else {
      return <div>{updateSuccess ? <Lables /> : this.updateFormFiled(alertColor, content, labels, categories, bill, contacts)}</div>
    }
  }

  loadHeader = () => <CardHeader><strong>Update Bill</strong></CardHeader>

  // when updating Form
  updateFormFiled = (alertColor, content, labels, categories, bill, contacts) => {
    return (
      <div className="animated fadeIn" >
        <Card>
          {this.loadHeader()}
          <Col sm="12" md={{ size: 7, offset: 3 }}>
            <br />
            {alertColor === "" ? "" : <Alert color={alertColor}>{content}</Alert>}
            <AvForm onSubmit={this.handleSubmitValue}>
              <Row>
                <Col sm={3}>
                  <AvField type="select" id="symbol" label="currency" value={bill.currency} name="currency" errorMessage="Select Currency" required>
                    <option value="">Select</option>
                    {this.state.currencies.map((currencies, key) => { return <option key={key} value={currencies.code} h={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option> })}
                  </AvField>
                </Col>
                <Col>
                  <AvField name="amount" id="amount" label="Amount" value={this.state.userAmount} placeholder="Amount" type="text" errorMessage="Invalid amount"
                    validate={{ required: { value: true }, pattern: { value: '^([0-9]*[.])?[0-9]+$' } }} required />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AvField name="tax" id="tax" value={bill.tax + ''} placeholder="Ex: 2" label="Tax" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required />
                </Col>
              </Row>
              <Row>
                <Col><label >Category</label>
                  <Select options={Data.categories(categories)} defaultValue={Data.categories(categories).filter(item => { return item.value === bill.categoryId })} styles={Data.singleStyles} placeholder="Select Categories " onChange={this.categorySelected} required /></Col>
              </Row>
              <br />
              <Row>
                <Col><AvField name="billDate" label="Bill Date" value={this.loadDateFormat(bill.billDate)} type="date" errorMessage="Invalid Date" validate={{
                  date: { format: 'yyyy/MM/dd' },
                  dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                  required: { value: true }
                }} /></Col>
                <Col><AvField name="dueDays" label="Due Days" value={bill.dueDays} type="number" placeholder="No.of Days" errorMessage="Invalid days" /></Col>
              </Row>
              <Row>
                <Col><label >Description/Notes</label>
                  <AvField name="description" type="text" value={bill.description} list="colors" errorMessage="Invalid Notes" placeholder="Ex: Recharge " /></Col>
              </Row>
              <Row>
                <Col><label >Select Labels</label>
                  {this.lablesOptions(labels, bill)}</Col>
              </Row><br />
              <Row>
                <Col><label >Select Contacts</label>
                  <Select options={Data.contacts(contacts)} defaultValue={Data.contacts(contacts).filter(item => { return item.value === bill.contactId })} placeholder="Select Contacts " onChange={this.contactSelected} required /></Col>
              </Row><br />
              <FormGroup>
                <Button color="info"> Update </Button> &nbsp;&nbsp;
                <Button type="button" onClick={this.cancelUpdateBill}>Cancel</Button>
              </FormGroup>
            </AvForm>
          </Col>
        </Card>
      </div>)
  }

  loadDateFormat = (dateParam) => {
    let toStr = "" + dateParam
    let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
    let date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);  //finalDate;
  }

  lablesOptions = (labels, bill) => {
    const options = Data.labels(labels)
    const data = bill.labelIds === null ? '' : bill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat();
    return <Select isMulti options={options} defaultValue={data} styles={Data.colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.labelSelected} />;
  }
}

export default UpdateBill;
