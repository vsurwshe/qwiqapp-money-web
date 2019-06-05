import React, {Component} from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Alert, Button, Card, FormGroup, Col, Row } from "reactstrap";
import Select from 'react-select';
import BillApi from "../../services/BillApi";
import Bills from "./Bill";
import Data from '../../data/SelectData'
class CreateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: props.label,
      categories : props.categories, 
      billCreated : false,
      profileId : props.pid,
      alertColor : "",
      content : "",
      labelOption: [],
      categoryOption: null,
      currencies:[],
      userAmount:0,
      contactOption:'',
      labelUpdate: '',
      cancelCreateBill:false,
      doubleClick:false
     };
  }
  componentDidMount=()=>{
   Data.currencies().then(data=>{this.setState({currencies:data})})
   
  }
  handleChange=() =>{
    let tax_amount= isNaN(parseInt(document.getElementById("tax").value)) ? 0 : parseInt(document.getElementById("tax").value)
    let amount=isNaN(parseInt(document.getElementById("amount").value)) ?  0 : parseInt(document.getElementById("amount").value)
    // let gst_amount=  (amount * tax_amount) /100;
    let gst_amount=  (amount * 100) /(100+tax_amount);
    this.setState({userAmount :gst_amount })
 }
cancelCreateBill=()=>{
  this.setState({cancelCreateBill:true})
}
  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption } = this.state 
    if (categoryOption === null){
      this.setState({ alertColor : "warning", content : "Please Select Category..."})
    } else if (errors.length === 0) { 
        let billDateCal = new Date(values.bill_Date);
        const dueDateCal = new Date(values.due_Date);
        if ((dueDateCal-billDateCal)>=0) {
          let dueDate, billDate;
          let year= values.bill_Date.split("-")[0];
          let month= values.bill_Date.split("-")[1];
          let day= values.bill_Date.split("-")[2];
          billDate = year+month+day;
          year = values.due_Date.split("-")[0];
          month = values.due_Date.split("-")[1];
          day = values.due_Date.split("-")[2];
          dueDate = year+month+day;
          console.log(values)
          const  newData = {...values, "billDate":billDate, "dueDate":dueDate, "categoryId":categoryOption.value,"labelIds":labelOption===[] ? '': labelOption.map(opt=>{return opt.value})}
          this.handlePostData(event, newData); 
        } else{
          this.setState({ alertColor : "danger", content : "Due Date should be greater than or equal to Bill Date"})
          // this.callAlertTimer("danger", "Please Check Due Date should be greater then or equal to bill date ")
        }
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
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "", billCreated: true });
    }, 2000);
  };

  render() {
    const { alertColor, content, categories,cancelCreateBill } = this.state;
    if(cancelCreateBill){
      return <Bills/>
    }else{
    return <div>{this.state.billCreated ? <Bills /> : this.selectLabels(alertColor, content, categories)}</div>
  }
}
  
  selectLabels = (alertColor, content, categories) =>{
    return this.loadCreatingBill(alertColor, this.state.labels, content, categories);
  }
  
  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (alertColor, labels, content, categories,contact) => {
    return (
      <div className="animated fadeIn" >
        <Card>
          <h4 style={{ paddingTop: 20 }}><b><center>CREATE BILL</center></b></h4>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <Alert color={alertColor}>{content}</Alert>
            <div style={{backgroundColor:"#D2D2CB"}}>
            <AvForm onSubmit={this.handleSubmitValue}>
              <Row>
                <Col sm={2}>
                  <AvField type="select" id="symbol" name="currency" label="Currency" errorMessage="Select Currency" onChange={() => this.handleChange()} required>
                    {this.state.currencies.map((currencies, key) => { return <option key={key} value={currencies.code} h={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option> })}
                  </AvField>
                </Col>
                <Col>
                  <AvField name="amount" id="amount" label="Amount" placeholder="Amount" type="number" errorMessage="Invalid amount"
                    validate={{ required: { value: true }, pattern: { value: '^([0-9]*[.])?[0-9]+$' } }} required
                    onChange={() => this.handleChange()} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AvField name="tax" id="tax" placeholder="tax" label="Tax" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required
                    onChange={() => this.handleChange()} />
                </Col>
                {/* <Col md={6}>
                  <AvField name="amount" disabled={true} value={this.state.userAmount} label="Gross Amount" placeholder="Gross Amount" type="text" errorMessage="Invalid amount" validate={{ required: { value: true } }} required />
                </Col> */}
              </Row>
              <Row>
                <Col> 
                <label >Category</label>
                <Select options={Data.categories(categories)} styles={Data.singleStyles} placeholder="Select Categories " onChange={this.categorySelected} required /></Col>
              </Row><br />

              <Row>
                <Col><AvField name="bill_Date" label="Bill Date" value={this.state.userBillDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'yyyy/MM/dd' }, required: { value: true } }} /></Col>
                <Col><AvField name="due_Date" label="Due Date" value={this.state.userDueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'yyyy/MM/dd' }, required: { value: true } }} /></Col>
              </Row>
              <Row>
                <Col>
                <label >Description/Notes</label>
                 <AvField name="description" type="text" list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes " required /></Col>
              </Row>
              <Row>
                <Col>
                <label >Select Labels</label>
                <Select isMulti options={Data.labels(labels)} styles={Data.colourStyles} placeholder="Select Lables " onChange={this.labelSelected} /></Col>
              </Row><br />
              <Row>
                <Col>
                <label >Contact Name</label>
                  <Select placeholder="Select Contact " onChange={this.contactSelected} /></Col>
              </Row><br />
              <FormGroup >
                <Button color="success" disabled={this.state.doubleClick}> Save  </Button> &nbsp;&nbsp;
                <Button type="button" onClick={this.cancelCreateBill}>Cancel</Button>
              </FormGroup>
            </AvForm>
            </div>
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
