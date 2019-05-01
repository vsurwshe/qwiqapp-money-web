import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button,Col, Input, Alert ,FormGroup,Card,CardHeader,Label,Collapse,FormText} from "reactstrap";
import Lables from "./Bill";
import BillApi from "../../services/BillApi";
class UpdateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor : "#000000",
      content : "",
      updateSuccess : false,
      profileId :this.props.pid,
      collapse : false,
      labels : this.props.lables,
      catagoery : this.props.catagoery,
      id : this.props.bill.id,
     };
  }
  
  //this method handle input from user given
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
   
  //this method make lable as main lable
  changeParentId=()=>{
    this.setState({parentId:""});
  }
  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    console.log(values)
    if (errors.length === 0) { this.handleUpdate(event, values); }
  }

  handleUpdate = (e, data) => {
    let newData = {...data,version: this.props.bill.version};
    console.log(newData);
    new BillApi().updateBill(this.SuccessCall, this.errorCall, newData, this.state.profileId, this.state.id)
  };
  //this called When Componets Calling SucessFully
  SuccessCall = json => {
    this.callAlertTimer("success", "Bill Updated Successfully... ");
  };
  //when any api goto the api executions failed then called this method 
  errorCall = err => {
    this.callAlertTimer("danger", "Something went wrong, Please Try Again... ");
  };

  //this  method show the on page alert
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: '', alertColor: '', updateSuccess: true });
    }, 2000);
  };

  render() {
    const {alertColor, content, updateSuccess} = this.state;
    const labelData=this.state.labels.map((label, key) => {
      return (<option key={key} value={label.id}>{label.name}</option>)
    });
    const catagoeryData=this.state.catagoery.map((catagoery, key) => {
      return (<option key={key} value={catagoery.id}>{catagoery.name}</option>)
    });
    return <div>{updateSuccess ?<Lables />:this.loadUpdatingLable(alertColor,content,labelData,catagoeryData)}</div>
  }
  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Update Bill</strong>
      </CardHeader>
    )
  }

  //this method call when updating profile
  loadUpdatingLable=(alertColor,content,labels,catagoerys)=>{
     return( 
       <div className="animated fadeIn" >
         <Card>
           {this.loadHeader()}
           <Col sm="12" md={{ size: 5, offset: 4 }}>
             <br />
             <Alert color={alertColor}>{content}</Alert>
             <h5><b>EDIT BILL</b></h5>
             <AvForm onSubmit={this.handleSubmitValue}>
               <AvField name="amount" value={this.props.bill.amount} placeholder="Enter Your Amount" type="text" errorMessage="Invalid name" autoFocus={true} validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required />
               <AvField type="select" name="currency" id="userCurrency" value={this.props.bill.currency} errorMessage="Select Any One Catagoery" validate={{ required: { value: true } }} bsSize="lg">
                 <option value="null">Please select Currency</option>
                 <option value="USD">$</option>
                 <option value="EUR">€</option>
                 <option value="CRC">₡</option>
                 <option value="GBP">£</option>
                 <option value="ILS">₪</option>
                 <option value="INR">₹</option>
                 <option value="JPY">¥</option>
                 <option value="KRW">₩</option>
                 <option value="NGN">₦</option>
                 <option value="PHP">₱</option>
                 <option value="PLN">z</option>
                 <option value="PYG">₲</option>
                 <option value="THB">฿</option>
                 <option value="UAH">₴</option>
                 <option value="VND">₫</option>
               </AvField><br />
               <AvField name="billDate" value={this.props.bill.billDate} placeholder="Choose Bill Date" type="date" errorMessage="Invalid Date" validate={{ date: { format: 'MM/DD/YYYY' }, required: { value: true } }} />
               <FormText color="muted">Choose Bill Date</FormText><br />
               <AvField type="select" name="categoryId" id="categoryId" autoFocus={true} value={this.props.bill.categoryId} errorMessage="Select Any One Catagoery" validate={{ required: { value: true } }} bsSize="lg">
               <option value="null">Please select Catagoery</option>{catagoerys}
               </AvField><br />
               <AvField name="dueDate" value={this.props.bill.dueDate} type="date" placeholder="Choose Bill Due Date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} />
               <FormText color="muted">Choose Bill Due Date</FormText><br />
               <AvField name="notes" value={this.props.bill.notes} type="text" list="colors" placeholder="Enter Notes Releated Bill" required /><br />
               <FormGroup check className="checkbox">
                 <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
                 <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
               </FormGroup><br />
               {this.loadCollapse(labels)}
               <br />
               <FormGroup>
                 <Button color="info"> Save Bill </Button> &nbsp;&nbsp;
            {this.loadCancleButton()}
               </FormGroup>
             </AvForm>

           </Col>
         </Card>
       </div>)
  }

  loadCancleButton = () => {
    return (<a href='/listBills'>
        <Button type="button">Cancle</Button>
      </a>)
  }
  //This Method Called When Sublables Makes Enable true.
  loadCollapse = (label) => {
    return (
    <Collapse isOpen={this.state.collapse}>
      <AvField type="select" name="labelIds" id="labelIds"  bsSize="lg" multiple>
          <option value="null">Please select Parent Lables</option>{label}
        </AvField><br />
      <AvField name="tax" value={this.props.bill.tax} type="text" placeholder="Enter User Tax" /><br />
    </Collapse>);
  }
}
export default UpdateBill;
