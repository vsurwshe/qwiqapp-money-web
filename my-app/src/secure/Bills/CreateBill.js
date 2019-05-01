import React, {Component} from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import {Alert,Button,Input,Card,CardHeader,FormGroup,Col,Collapse,Label,FormText} from "reactstrap";
import "default-passive-events";
import BillApi from "../../services/BillApi";
import Bills from "./Bill";
class CreateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: this.props.label,
      catagoery :this.props.catagoery, 
      billCreated : false,
      collapse : false,
      profileId : this.props.pid,
      alertColor : "",
      content : "",
     };
  }

  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }
  
  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    console.log(values)
    if (errors.length === 0) { this.handlePostData(event, values); }
  }

  //this method handle the Post method from user
  handlePostData = async (e, data) => {
    e.preventDefault();
    await new BillApi().createBill(this.successCreate, this.errorCall, this.state.profileId, data);
  };

  //this method call when lables created successfully
  successCreate = () => {
    this.callAlertTimer("success", "New Bill Created....");
  }

  //this handel the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", "Something went Worng"); };

  //this method show the message wait some times
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "", billCreated: true });
    }, 2000);
  };


  render() {
    const { alertColor, content } = this.state;
    const labelData=this.state.labels.map((label, key) => {
      return (<option key={key} value={label.id}>{label.name}</option>)
    });
    const catagoeryData=this.state.catagoery.map((catagoery, key) => {
      return (<option key={key} value={catagoery.id}>{catagoery.name}</option>)
    });
    return <div>{this.state.billCreated ? <Bills /> : this.loadCreatingBill(alertColor, content,labelData,catagoeryData)}</div>
  }

  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Create Bills</strong>
      </CardHeader>
    )
  }

  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (alertColor, content,labels,catagoerys) => {
    return (<div className="animated fadeIn" >
      <Card>
        {this.loadHeader()}
        <Col sm="12" md={{ size: 5, offset: 4 }}>
          <br />
          <Alert color={alertColor}>{content}</Alert>
          <h5><b>CREATE BILL</b></h5>
          <AvForm onSubmit={this.handleSubmitValue}>
            <AvField name="amount" value={this.state.userAmount} placeholder="Enter Your Amount" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required />
            <AvField type="select" name="currency" id="userCurrency" errorMessage="Select Any One Catagoery" validate={{ required: { value: true } }} bsSize="lg">
              <option value="null">Please select Currency</option>
              <option value="USD">$</option>
              <option value="EUR">€</option>
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
            <AvField name="billDate" value={this.state.userBillDate} placeholder="Choose Bill Date" type="date" errorMessage="Invalid Date" validate={{ date: { format: 'MM/DD/YYYY' }, required: { value: true } }} />
            <FormText color="muted">Choose Bill Date</FormText><br />
            <AvField type="select" name="categoryId" id="userCategoryId" onChange={(event) => this.setState({ userCategoryId: event.target.value })} errorMessage="Select Any One Catagoery" validate={{ required: { value: true } }} bsSize="lg">
              <option value="null">Please select Catagoery</option>{catagoerys}
             </AvField><br />
            <AvField name="dueDate" value={this.state.userDueDate} type="date" placeholder="Choose Bill Due Date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} />
            <FormText color="muted">Choose Bill Due Date</FormText><br />
           
            <AvField name="notes" type="text" list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes Releated Bill" required /><br />
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
    </div>);
  }

  loadCancleButton = () => {
    return (<a href='/listBills'>
        <Button type="button">Cancle</Button>
      </a>)
  }

  //This Method Called When Sublables Makes Enable true.
  loadCollapse = (label) => {
    return (<Collapse isOpen={this.state.collapse}>
        <AvField type="select" name="labelIds" id="labelIds"  bsSize="lg" multiple>
          <option value="null">Please select Parent Lables</option>{label}
        </AvField><br />
        <AvField name="tax" type="text" placeholder="Enter User Tax"  /><br />
      </Collapse>);
  }
}
export default CreateBill;
