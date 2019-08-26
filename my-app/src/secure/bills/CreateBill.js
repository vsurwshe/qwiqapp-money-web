import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Alert, Button, Card, FormGroup, Col, Row, Container } from "reactstrap";
import Select from 'react-select';
import BillApi from "../../services/BillApi";
import Bills from "./Bills";
import Data from '../../data/SelectData'
import Config from "../../data/Config";
import '../../css/style.css'
import Store from "../../data/Store";


class CreateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: props.label,
      contacts: props.contacts,
      categories: props.categories,
      billCreated: false,
      profileId: props.pid,
      alertColor: "",
      content: "",
      labelOption: [],
      categoryOption: null,
      currencies: [],
      contactOption: '',
      cancelCreateBill: false,
      doubleClick: false,
      amount: 0,
      taxPercent: 0,
      taxAmount: 0
    };
  }
  
  componentDidMount = () => {
    const currencies = Store.getCurrencies();
    this.setState({ currencies }) 
  }
  
  cancelCreateBill = () => { this.setState({ cancelCreateBill: true }) }

  //this method handle form submit values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, contactOption } = this.state
    if (categoryOption === null) {
      this.callAlertTimer("warning", "Please Select Category...");
    } else if (errors.length === 0) {
      let billDateValue;
      billDateValue = values.billDate.split("-")[0] + values.billDate.split("-")[1] + values.billDate.split("-")[2];
      const newData = { ...values, "taxPercent": values.taxPercent? values.taxPercent : 0,"amount":values.label+values.amount,"billDate": billDateValue, "categoryId": categoryOption.value, "contactId": contactOption.value, "labelIds": labelOption === [] ? '' : labelOption.map(opt => { return opt.value }) }
      console.log(newData);
      this.handlePostData(event, newData);
    }
  }

  //this method handle the Post method from user`
  handlePostData = async (e, data) => {
    e.persist();
    this.setState({ doubleClick: true })
   await new BillApi().createBill(this.successCreate, this.errorCall, this.state.profileId, data);
  };

  //this method call when labels created successfully
  successCreate = () => {
    this.callAlertTimer("success", "New Bill Created....");
  }

  //this handle the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", "Unable to Process Request, Please try Again...."); };

  //this method Notifies the user after every request
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    if (alertColor === "success") {
      setTimeout(() => {
        this.setState({ name: "", content: "", alertColor: "", billCreated: true });
      }, Config.notificationMillis);
    }
  };

  handleSetAmount = e =>{
    this.setState({amount: e.target.value});
  }

  handleTaxAmount = (e) => {
    const {amount}  = this.state;
    let taxPercentVal = parseInt(e.target.value);
    let taxAmount;
    if ( amount && taxPercentVal >= 0) {
      taxAmount = amount - ( amount * 100)/(taxPercentVal +100) ;
    } 
    this.setState({taxAmount: taxAmount, taxPercent: taxPercentVal });
  }

  handleTaxPercent = (e) => {
    const {amount}  = this.state;
    let taxAmtVal = parseInt(e.target.value);
    let taxPercent;
    if ( amount && taxAmtVal >= 0) {
      taxPercent = (amount * 100)/(amount - taxAmtVal) - 100 ;
    } 
    this.setState({taxAmount: taxAmtVal, taxPercent: taxPercent });
  }

  render() {
    const { alertColor, content, categories, cancelCreateBill, contacts, billCreated } = this.state;
    if (cancelCreateBill) {
      return <Bills />
    } else {
      return <div>{billCreated ? <Bills /> : this.selectLabels(alertColor, content, categories, contacts)}</div>
    }
  }

  selectLabels = (alertColor, content, categories, contacts) => {
    return this.billFormField(alertColor, this.state.labels, content, categories, contacts);
  }

  billFormField = (alertColor, labels, content, categories, contacts) => {
    return (
      <div className="animated fadeIn" >
        <Card>
          <h4 className="padding-top"><b><center>CREATE BILL</center></b></h4>
          <Container>
          <Col>
            <Alert color={alertColor}>{content}</Alert>
            <AvForm onSubmit={this.handleSubmitValue}>
              <Row>
                <Col sm={3}>
                  <AvField type="select" id="symbol" name="currency" label="Currency" errorMessage="Select Currency" required>
                    <option value="">Select</option>
                    {this.state.currencies.map((currencies, key) => {
                      return <option key={key} value={currencies.code}
                        data={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option>
                    })}
                  </AvField>
                </Col>
                <Col sm={3}>
                  <AvField type="select"  name="label" label="Type of Bill" errorMessage="Select Type of Bill" required>
                    <option value="">Select Type of Bill</option>
                    <option value="-">Payable</option>
                    <option value="+">Receivable</option>
                  </AvField>
                </Col>
                <Col sm={6}>
                  <AvField name="amount" id="amount" label="Amount" placeholder="Amount" type="number" errorMessage="Invalid amount"
                    onChange= {e=>{this.handleSetAmount(e)}} required />
                </Col>
              </Row>
              <Row>
              <Col>
                  <AvField name="taxPercent" id="taxPercent" value={this.state.taxPercent} placeholder={this.state.taxPercent} 
                   label="Tax (in %)" type="number" onChange={(e)=>{this.handleTaxAmount(e)}}/>
              </Col>
               <Col>
                  <AvField name='dummy' label="Tax Amount" value={this.state.taxAmount} placeholder="0" type="number" onChange={(e)=>{this.handleTaxPercent(e)}}  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {/* Categories loading in select options filed */}
                  <label >Category</label>
                  <Select options={Data.categories(categories)} styles={Data.singleStyles} placeholder="Select Categories " 
                  onChange={this.categorySelected} required /></Col>
              </Row>
              <br />
              <Row>
                <Col><AvField name="billDate" label="Bill Date" value={this.state.userBillDate} type="date" errorMessage="Invalid Date" validate={{
                  date: { format: 'dd/MM/yyyy' },
                  dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                  required: { value: true }
                }} /></Col>
                <Col><AvField name="dueDays" label="Due Days" placeholder="No.of Days" value={this.state.userDueDate} type="number" errorMessage="Invalid Days" /></Col>
              </Row>
              <Row>
                <Col>
                  <label >Description/Notes</label>
                  <AvField name="description" type="text" list="colors" placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
              </Row>
              <Row>
                <Col>
                  {/* Labels loading in select options filed */}
                  <label >Select Labels</label>
                  <Select isMulti options={Data.labels(labels)} styles={Data.colourStyles} placeholder="Select Labels " onChange={this.labelSelected} /></Col>
              </Row><br />
              <Row>
                <Col>
                  {/* Contacts loading in select options filed */}
                  <label >Contact Name</label>
                  <Select options={Data.contacts(contacts)} placeholder="Select Contact " onChange={this.contactSelected} /></Col>
              </Row><br />
              <FormGroup >
                <Button color="success" disabled={this.state.doubleClick}> Save  </Button> &nbsp;&nbsp;
                <Button type="button" onClick={this.cancelCreateBill}>Cancel</Button>
              </FormGroup>
            </AvForm>
          </Col>
          </Container>
        </Card>
      </div>);
  }

  labelSelected = (labelOption) => {
    this.setState({ labelOption })
  }

  categorySelected = (categoryOption) => {
    this.setState({ categoryOption, alertColor: '', content: '' })
  }

  contactSelected = (contactOption) => {
    this.setState({ contactOption })
  }

}
export default CreateBill;
