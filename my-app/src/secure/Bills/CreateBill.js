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
      categoryOption: null
     };
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
    const { alertColor, content, categories } = this.state;
    return <div>{this.state.billCreated ? <Bills /> : this.selectLabels(alertColor, content, categories)}</div>
  }
  
  selectLabels = (alertColor, content, categories) =>{
    return this.loadCreatingBill(alertColor, this.state.labels, content, categories);
  }
  
  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (alertColor, labels, content, categories) => {
    return (
      <div className="animated fadeIn" >
        <Card>
          <h4 style={{paddingTop:20}}><b><center>CREATE BILL</center></b></h4>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <Alert color={alertColor}>{content}</Alert>
              <AvForm onSubmit={this.handleSubmitValue}>
                <Row>
                  <Col sm={2}>
                    <AvField type="select" name="currency" errorMessage="Select Currency" required>
                      <option value="null">Currency</option>
                      <option value="EUR">€</option>
                      <option value="USD">$</option>
                      <option value="INR">₹</option>
                    </AvField>
                  </Col>
                  <Col>
                    <AvField name="amount" value={this.state.userAmount} placeholder="Amount" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required />
                  </Col>
                </Row>
                <Row>
                  <Col> <Select options={Data.categories(categories)} styles={Data.singleStyles}  placeholder="Select Categories " onChange={this.categorySelected} required/></Col>
                </Row><br/>  
                <Row>
                  <Col><AvField name="billDate" label="Bill Date" value={this.state.userBillDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
                  <Col><AvField name="dueDate" label="Due Date" value={this.state.userDueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
                </Row>
                <Row>
                  <Col> <AvField name="notes" type="text" list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes " required /></Col>
                </Row>
                <Row>
                  <Col><Select isMulti options={Data.labels(labels)} styles={Data.colourStyles} placeholder="Select Lables " onChange={this.labelSelected}/></Col>
                </Row><br/>
                <FormGroup >
                  <Button color="info"> Save Bill </Button> &nbsp;&nbsp;
                  <a href='/listBills'><Button type="button">Cancel</Button></a>
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
}
export default CreateBill;
