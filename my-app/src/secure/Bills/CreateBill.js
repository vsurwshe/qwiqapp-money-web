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
    let gst_amount=  (amount * tax_amount) /100;
    this.setState({userAmount :amount+gst_amount })
 }
cancelCreateBill=()=>{
  this.setState({cancelCreateBill:true})
}
  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption } = this.state 
    if (categoryOption === null){
      this.setState({ alertColor : "warning", content : "Please Select Category..."})
    } else{
      const  newData = {...values,"categoryId":categoryOption.value,"labelIds":labelOption===[] ? '': labelOption.map(opt=>{return opt.value})}
      if (errors.length === 0) { this.handlePostData(event, newData); }
    } 
  }

  //this method handle the Post method from user
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
                  <AvField name="userAmount" id="amount" label="Amount" placeholder="Amount" type="number" errorMessage="Invalid amount"
                    validate={{ required: { value: true }, pattern: { value: '^([0-9]*[.])?[0-9]+$' } }} required
                    onChange={() => this.handleChange()} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AvField name="tax" id="tax" placeholder="tax" label="Tax" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required
                    onChange={() => this.handleChange()} />
                </Col>
                <Col md={6}>
                  <AvField name="amount" disabled={true} value={this.state.userAmount} label="Gross Amount" placeholder="Gross Amount" type="text" errorMessage="Invalid amount" validate={{ required: { value: true } }} required />
                </Col>
              </Row>
              <Row>
                <Col> 
                <label >Category</label>
                <Select options={Data.categories(categories)} styles={Data.singleStyles} placeholder="Select Categories " onChange={this.categorySelected} required /></Col>
              </Row><br />

              <Row>
                <Col><AvField name="billDate" label="Bill Date" value={this.state.userBillDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/mm/yyyy' }, required: { value: true } }} /></Col>
                <Col><AvField name="dueDate" label="Due Date" value={this.state.userDueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/mm/yyyy' }, required: { value: true } }} /></Col>
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
