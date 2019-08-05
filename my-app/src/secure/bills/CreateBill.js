import React, {Component} from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Alert, Button, Card, FormGroup, Col, Row } from "reactstrap";
import Select from 'react-select';
import BillApi from "../../services/BillApi";
import Bills from "./Bills";
import Data from '../../data/SelectData'
import Config from "../../data/Config";
import GeneralApi from "../../services/GeneralApi";

class CreateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: props.label,
      contacts:props.contacts,
      categories : props.categories, 
      billCreated : false,
      profileId : props.pid,
      alertColor : "",
      content : "",
      labelOption: [],
      categoryOption: null,
      currencies:[],
      contactOption:'',
      cancelCreateBill:false,
      doubleClick:false
     };
  }
  componentDidMount=()=>{
    new GeneralApi().getCurrencyList(this.successCurrency, this.failureCurrency)
  }
  successCurrency = currencies =>{ this.setState({ currencies }); }

  failureCurrency = err =>{ console.log(err); }

  cancelCreateBill=()=>{ this.setState({cancelCreateBill:true}) }

  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption ,contactOption} = this.state  
    if (categoryOption === null){
      this.callAlertTimer("warning", "Please Select Category...");
    } else if (errors.length === 0) { 
      let billDateValue;
      billDateValue = values.billDate.split("-")[0]+values.billDate.split("-")[1]+values.billDate.split("-")[2];
      const newData = {...values, "billDate":billDateValue, "categoryId":categoryOption.value, "contactId":contactOption.value ,"labelIds":labelOption===[] ? '': labelOption.map(opt=>{return opt.value})}
      this.handlePostData(event, newData); 
    }
  }

  //this method handle the Post method from user`
  handlePostData = async (e, data) => {
    e.persist();
    this.setState({doubleClick:true})
    await new BillApi().createBill(this.successCreate, this.errorCall, this.state.profileId, data);
  };

  //this method call when lables created successfully
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

  render() {
    const { alertColor, content, categories, cancelCreateBill, contacts, billCreated } = this.state;
    if (cancelCreateBill) {
      return <Bills/>
    } else {
      return <div>{billCreated ? <Bills /> : this.selectLabels(alertColor, content, categories, contacts)}</div>
    }
  }
  
  selectLabels = (alertColor, content, categories, contacts) =>{
    return this.loadCreatingBill(alertColor, this.state.labels, content, categories,contacts);
  }
  
  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (alertColor, labels, content, categories,contacts) => {
    return (
      <div className="animated fadeIn" >
        <Card>
          <h4 style={{ paddingTop: 20 }}><b><center>CREATE BILL</center></b></h4>
          <Col sm="12" md={{ size: 7, offset: 3 }}>
            <Alert color={alertColor}>{content}</Alert>
            <AvForm onSubmit={this.handleSubmitValue}>
              <Row>
                <Col sm={3}>
                  <AvField type="select" id="symbol" name="currency" label="Currency" errorMessage="Select Currency" required>
                    <option value="">Select</option>
                    {this.state.currencies.map((currencies, key) => { return <option key={key} value={currencies.code}
                     data={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option> })}
                  </AvField>
                </Col>
                <Col sm={9}>
                  <AvField name="amount" id="amount" label="Amount" placeholder="Amount" type="number" errorMessage="Invalid amount"
                    validate={{ required: { value: true }, pattern: { value: '^([0-9]*[.])?[0-9]+$' } }} required />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AvField name="tax" id="tax" placeholder="tax"  value='0' label="Tax" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required/>
                </Col>
              </Row>
              <Row>
                <Col> 
                <label >Category</label>
                <Select options={Data.categories(categories)} styles={Data.singleStyles} placeholder="Select Categories " onChange={this.categorySelected} required /></Col>
              </Row>
              <br />
              <Row>
                <Col><AvField name="billDate" label="Bill Date" value={this.state.userBillDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' }, 
                      dateRange: {format: 'YYYY/MM/DD', start: {value: '1900/01/01'}, end: {value: '9999/12/31'}}, 
                      required: { value: true } }} /></Col>
                <Col><AvField name="dueDays" label="Due Days" value={this.state.userDueDate} type="number" errorMessage="Invalid Days" /></Col>
              </Row>
              <Row>
                <Col>
                <label >Description/Notes</label>
                 <AvField name="description" type="text" list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes " /></Col>
              </Row>
              <Row>
                <Col>
                <label >Select Labels</label>
                <Select isMulti options={Data.labels(labels)} styles={Data.colourStyles} placeholder="Select Lables " onChange={this.labelSelected} /></Col>
              </Row><br />
              <Row>
                <Col>
                <label >Contact Name</label>
                  <Select options={Data.contacts(contacts)}  placeholder="Select Contact " onChange={this.contactSelected} /></Col>
              </Row><br />
              <FormGroup >
                <Button color="success" disabled={this.state.doubleClick}> Save  </Button> &nbsp;&nbsp;
                <Button type="button" onClick={this.cancelCreateBill}>Cancel</Button>
              </FormGroup>
            </AvForm>
          </Col>
        </Card>
      </div>);
  }

  labelSelected = (labelOption) =>{
    this.setState({ labelOption })
  }

  categorySelected = (categoryOption) =>{
    this.setState({ categoryOption, alertColor : '', content : ''})
  }
  
  contactSelected = (contactOption) =>{
    this.setState({ contactOption})
  }

}
export default CreateBill;
