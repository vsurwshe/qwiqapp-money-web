import React, { Component } from "react";
import { Button,Col, Input, Alert ,FormGroup,Card,CardHeader,Label,Collapse,FormText} from "reactstrap";
import Lables from "./Bill";
import BillApi from "../../services/BillApi";
class UpdateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: "#000000",
      content: "",
      updateSuccess: false,
      profileId:this.props.pid,
      collapse: false,
      labels:this.props.lables,
      catagoery : this.props.catagoery,
      id : this.props.bill.id,
      userAmount : this.props.bill.amount,
      userBillDate : this.props.bill.billDate,
      userDueDate : this.props.bill.dueDate,
      userCategoryId : this.props.bill.categoryId,
      userNotes : this.props.bill.notes,
      userContactId : this.props.bill.contactId,
      userLabelsId : this.props.bill.labelIds,
      uerTax : this.props.bill.tax,
      userType : this.props.bill.type,
      version : this.props.bill.version
    };
  }
  handleUpdate = () => {
    let data = { 
      amount : this.state.userAmount,
      billDate : this.state.userBillDate,
      dueDate : this.state.userDueDate,
      categoryId : this.state.userCategoryId,
      notes : this.state.userNotes,
      labelIds : this.state.userLabelsId,
      contactId : this.state.userContactId,
      type : this.state.userType,
      tax : this.state.userTax,
      version : this.state.version };
    new BillApi().updateBill(this.SuccessCall, this.errorCall, data,this.state.profileId, this.state.id )
  };
  //this called When Componets Calling SucessFully
  SuccessCall = json => {
     this.callAlertTimer( "success", "Bill Updated Successfully... ");
  };
 //when any api goto the api executions failed then called this method 
  errorCall = err => {
    this.callAlertTimer( "danger", "Something went wrong, Please Try Again... ");
  };
//this  method show the on page alert
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content});
    setTimeout(() => {this.setState({ name: '', alertColor: '',updateSuccess: true });
    }, 2000);
  };
  //this method make lable as main lable
  changeParentId=()=>{
    this.setState({parentId:""});
  }
  //this method makes true or false for the collapse
  toggle=()=> {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { name,notes, alertColor, content, updateSuccess,userColor } = this.state;
    return <div>{updateSuccess ?<Lables />:this.loadUpdatingLable(name,notes,alertColor,content,userColor)}</div>
  }
  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Update Bill</strong>
      </CardHeader>
    )
  }

  //this method call when updating profile
  loadUpdatingLable=(name,notes,alertColor,content,userColor)=>{
     return( 
       <div className="animated fadeIn" >
         <Card>
          {this.loadHeader()}
           <Col sm="12" md={{ size: 5, offset: 4 }}>
           <br/>
             <Alert color={alertColor}>{content}</Alert>
             <h5><b>EDIT BILL</b></h5>
             <FormGroup>
            <Input name="userAmount" value={this.state.userAmount} type="number" placeholder="Enter Your Amount" autoFocus={true} onChange={e => this.handleInput(e)} /><br />
            <Input name="userBillDate" value={this.state.userBillDate} type="date" placeholder="Choose Bill Date" autoFocus={true} onChange={e => this.handleInput(e)} />
            <FormText color="muted">Choose Bill Date</FormText><br />
            <Input type="select" name="userCategoryId" id="userCategoryId" value={this.state.userCategoryId} onChange={(event) => this.setState({ userCategoryId: event.target.value })} bsSize="lg">
              <option value="null">Please select Catagoery</option>
              {this.state.catagoery.map((catagoery, key) => {
                return (<option key={key} value={catagoery.id}>{catagoery.name}</option>)
              })}
            </Input><br/>
            <Input name="userDueDate" value={this.state.userDueDate} type="date" placeholder="Choose Bill Due Date" autoFocus={true} onChange={e => this.handleInput(e)} />
            <FormText color="muted">Choose Bill Due Date</FormText><br />
            <Input name="userNotes" value={this.state.userNotes} type="text" list="colors" placeholder="Enter Notes Releated Bill" autoFocus={true} onChange={e => { this.handleInput(e) }} /><br />
            <FormGroup check className="checkbox">
              <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
              <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
            </FormGroup><br />
            {this.loadCollapse()}
            <br />
            <Button color="info" disabled={!this.state.userAmount && !this.state.userBillDate && !this.state.userCategoryId && !this.state.userNotes } onClick={e => this.handleUpdate(e)} > Update Bill </Button>
            <a href="/listBills" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
          </FormGroup>
           
           </Col>
         </Card>
       </div>)
  }
  //This Method Called When Sublables Makes Enable true.
  loadCollapse = () => {
    return (
    <Collapse isOpen={this.state.collapse}>
      <Input type="select" name="userLabelsId" id="userLabelsId" onChange={(event) => this.setState({ userLabelsId: event.target.value })} bsSize="lg">
        <option value="null">Please select Parent Lables</option>
        {this.state.labels.map((label, key) => {
          return (
            <option key={key} value={label.id}>{label.name}
            </option>
          )
        })}
      </Input><br/>
      <Input name="userTax" value={this.state.userTax} type="text" placeholder="Enter User Tax" autoFocus={true} onChange={e => this.handleInput(e)} /><br />
    </Collapse>);
  }

}

export default UpdateBill;
