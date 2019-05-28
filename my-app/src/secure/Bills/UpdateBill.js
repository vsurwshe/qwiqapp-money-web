import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Col, Row, Alert, FormGroup, Card, CardHeader } from "reactstrap";
import Lables from "./Bill";
import BillApi from "../../services/BillApi";
import Select from 'react-select';
import Data from '../../data/SelectData';

class UpdateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor : "#000000",
      content : '',
      updateSuccess : false,
      profileId : props.pid,
      collapse : false,
      labels : props.lables,
      categories : props.categories,
      bill : props.bill,
      labelOption : props.bill.labelIds,
      categoryOptionUpdate : false,
      labelOptionUpdate : false,
      categoryOption : props.bill.categoryId,
      currencies:[],
      userAmount:props.bill.amount,
      netAmount:0,
    };
  }

  componentDidMount=async ()=>{
    await Data.currencies().then(data=>{this.setState({currencies:data})})
    this.calculateNetAmount();
   }

  handleChange=() =>{
    let tax_amount= isNaN(parseInt(document.getElementById("tax").value)) ? 0 : parseInt(document.getElementById("tax").value)
    let amount=isNaN(parseInt(document.getElementById("amount").value)) ?  0 : parseInt(document.getElementById("amount").value)
    let gst_amount=  (amount * tax_amount) /100;
      this.setState({userAmount :amount+gst_amount })
 }
 calculateNetAmount=() =>{
   let tax_amount= isNaN(parseInt(document.getElementById("tax").value)) ? 0 : parseInt(document.getElementById("tax").value)
  let amount=isNaN(parseInt(document.getElementById("grossAmount").value)) ?  0 : parseInt(document.getElementById("grossAmount").value)
   // GST Amount = Original Cost - [Original Cost x {100/(100+GST%)}]
  let gst_amount=  (amount -[amount*(100/(100+tax_amount))])
  this.setState({netAmount :amount-gst_amount })
}
  //this method handle form submission values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, categoryOptionUpdate, labelOptionUpdate } = this.state 
    const  newData = {...values,"categoryId":categoryOptionUpdate ? categoryOption.value : categoryOption,"labelIds":labelOption===null || labelOption===[]?[]:( labelOptionUpdate ? labelOption.map(opt=>{return opt.value}): labelOption ),"version": this.props.bill.version}
    if (errors.length === 0) { this.handleUpdate(event, newData); }
  }

  handleUpdate = (e, data) => {
     new BillApi().updateBill(this.successCall, this.errorCall, data, this.state.profileId, this.props.bill.id)
  };

  //This method called when Bill is Successfully updated
  successCall = json => {
    this.callAlertTimer("success", "Bill Updated Successfully... ");
  };

  //This method shows the Api Error messages if any 
  errorCall = err => {
    this.callAlertTimer("danger", "Unable to process request, Please Try Again... ");
  };

  //this method shows the response messages for user
  callAlertTimer = (alertColor, content) =>  {
    this.setState({ alertColor, content }); 
    setTimeout(() => {
      this.setState({ name : '', alertColor : '', updateSuccess : true });
    }, 2000);
  };

  labelSelected = (labelOption) =>{
    console.log(labelOption)
    this.setState({ labelOption ,labelOptionUpdate : true})
  }

  categorySelected = (categoryOption) =>{
    this.setState({categoryOption, categoryOptionUpdate : true})
  }
    
  render() {
    const { alertColor, content, updateSuccess, labels, categories, bill } = this.state;
    console.log('Amount is : ',bill.amount)
    return <div>{updateSuccess ? <Lables /> : this.loadUpdatingLabel(alertColor, content, labels, categories, bill)}</div>
  }

  loadHeader = () => <CardHeader><strong>Update Bill</strong></CardHeader>

  //this method call when updating profile
  loadUpdatingLabel = (alertColor, content, labels, categories, bill) =>{
    return( 
      <div className="animated fadeIn" >
        <Card>
          {this.loadHeader()}
          <h5 style={{paddingTop:20}}><b><center>EDIT BILL</center></b></h5>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <br />
            <Alert color={alertColor}>{content}</Alert>
              <AvForm onSubmit={this.handleSubmitValue}>
              <Row>
                  <Col sm={2}>
                    <AvField type="select" id="symbol"  value={bill.currency} name="currency" errorMessage="Select Currency" required>
                      {this.state.currencies.map((currencies,key)=>{return <option key={key} value={currencies.code} h={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option>})}
                    </AvField>
                  </Col>
                  <Col>
                    <AvField name="userAmount" id="amount" value={this.state.netAmount}  onChange={()=>this.handleChange()} placeholder="Amount" type="text" errorMessage="Invalid amount" 
                    validate={{ required: { value: true }, pattern: { value: '^([0-9]*[.])?[0-9]+$' } }} required  />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <AvField name="tax" id="tax" value={bill.tax}  onChange={()=>this.handleChange()} placeholder="tax" label="Tax" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required  />
                     </Col>
                  <Col>
                    <AvField name="amount" id="grossAmount" value={this.state.userAmount} disabled={true}  label="Gross Amount" placeholder="Gross Amount" type="text" errorMessage="Invalid amount" validate={{ required: { value: true } }} required />
                  </Col>
                </Row>
                <Row>
                  <Col> <Select options={Data.categories(categories)}  defaultValue={Data.categories(categories).filter(item=>{return item.value===bill.categoryId})} styles={Data.singleStyles}  placeholder="Select Categories " onChange={this.categorySelected} required/></Col>
                </Row><br />
                <Row>
                  <Col><AvField name="billDate" label="Bill Date" value={bill.billDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/mm/yyyy' }, required: { value: true } }} /></Col>
                  <Col><AvField name="dueDate" label="Due Date" value={bill.dueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/mm/yyyy' }, required: { value: true } }} /></Col>
                </Row>
                <Row>
                  <Col> <AvField name="description" type="text" value={bill.description} list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes " required /></Col>
                </Row>
                <Row>
                  <Col> {this.lablesOptions(labels, bill)}</Col>
                </Row><br />
                <FormGroup>
                  <Button color="info"> Update </Button> &nbsp;&nbsp;
                  <a href='/listBills'><Button type="button">Cancel</Button></a>
                </FormGroup>
              </AvForm>
            </Col>
          </Card>
        </div>)
  }

  lablesOptions = (labels, bill) =>{
    const options=Data.labels(labels)
    const data =  bill.labelIds===null ?'': bill.labelIds.map(id=>{return options.filter(item =>{return item.value===id})}).flat();
    return <Select isMulti options={options}  defaultValue={data} styles={Data.colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.labelSelected}/> ;
  }
}

export default UpdateBill;
