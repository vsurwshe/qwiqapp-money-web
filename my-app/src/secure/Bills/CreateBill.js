import React, {Component} from "react";
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
      userAmount : "",
      userBillDate : "",
      userDueDate : "",
      userCategoryId : "",
      userNotes : "",
      userContactId : "",
      userLabelsId : null,
      uerTax : ""
    };
  }
  //this method handle input from user given
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  //this method handle the submition from user
  handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      amount : this.state.userAmount,
      billDate : this.state.userBillDate,
      dueDate : this.state.userDueDate,
      categoryId : this.state.userCategoryId,
      notes : this.state.userNotes,
      labelIds : this.state.userLabelsId,
      contactId : this.state.userContactId,
      tax : this.state.userTax
    };
    await new BillApi().createBill(this.successCreate, this.errorCall, this.state.profileId, data);
  };
  //this method call when lables created successfully
  successCreate = () => {
    this.callAlertTimer("success", "New Bill Created....");
  }
  //this handel the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", err); };
  //this method show the message wait some times
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "", billCreated: true });
    }, 2000);
  };
  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { alertColor, content } = this.state;
    return <div>{this.state.billCreated ? <Bills /> : this.loadCreatingBill(alertColor, content)}</div>
  }

  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Create Bills</strong>
      </CardHeader>
    )
  }
  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (alertColor, content) => {
    return (<div className="animated fadeIn" >
      <Card>
        {this.loadHeader()}
        <Col sm="12" md={{ size: 5, offset: 4 }}>
          <br />
          <Alert color={alertColor}>{content}</Alert>
          <h5><b>CREATE BILL</b></h5>
          <FormGroup>
            <Input name="userAmount" value={this.state.userAmount} type="number" placeholder="Enter Your Amount" autoFocus={true} onChange={e => this.handleInput(e)} /><br />
            <Input name="userBillDate" value={this.state.userBillDate} type="date" placeholder="Choose Bill Date" autoFocus={true} onChange={e => this.handleInput(e)} />
            <FormText color="muted">Choose Bill Date</FormText><br />
            <Input type="select" name="userCategoryId" id="userCategoryId" onChange={(event) => this.setState({ userCategoryId: event.target.value })} bsSize="lg">
              <option value="null">Please select Catagoery</option>
              {this.state.catagoery.map((catagoery, key) => {
                return (<option key={key} value={catagoery.id}>{catagoery.name}</option>)
              })}
            </Input><br/>
            <Input name="userDueDate" value={this.state.userDueDate} type="date" placeholder="Choose Bill Due Date" autoFocus={true} onChange={e => this.handleInput(e)} />
            <FormText color="muted">Choose Bill Due Date</FormText><br />
            <Input name="userNotes" type="text" list="colors" placeholder="Enter Notes Releated Bill" autoFocus={true} onChange={e => { this.handleInput(e) }} /><br />
            <FormGroup check className="checkbox">
              <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
              <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
            </FormGroup><br />
            {this.loadCollapse()}
            <br />
            <Button color="info" disabled={!this.state.userAmount && !this.state.userBillDate && !this.state.userCategoryId && !this.state.userNotes } onClick={e => this.handleSubmit(e)} > Save Bill </Button>
            <a href="/listBills" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
          </FormGroup>
        </Col>
      </Card>
    </div>);
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

export default CreateBill;
