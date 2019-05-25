import React, { Component } from "react";
import { Alert, Button, Input, Card, CardHeader, FormGroup, Col, Collapse, Label  } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import LabelApi from "../../services/LabelApi";
import Lables from './Label';
import Config from "../../data/Config";
class CreateLable extends Component {
  constructor(props){
    super(props);
    this.state = {
      labels: props.label,
      parentId: '',
      alertColor: "",
      content: "",
      labelCreated: false,
      collapse: false,
      profileId: props.pid,
      cancelCreateLabel: false,
      doubleClick: false
     };
  }

  //this method handle the successfull response form geting api
  successCall = json => {
    if (json === []) {
      this.setState({ labels: [0] })
    }else {
      this.setState({ labels: json })}
  };
 
  handleSubmitValue=(event, errors, values)=> {
    if(errors.length ===0)
   this.handlePostData(event,values);
  }
  cancelCreateLabel=()=>{
    this.setState({ cancelCreateLabel: true });
  }
  // handle the submission from user
  handlePostData = async (e,data) => {
    this.setState({ doubleClick: true });
    e.persist();
    const newData={...data,"parentId":this.state.parentId}
    await new LabelApi().createLabel( this.successCreate, this.errorCall, this.state.profileId, newData);
  };
  // call when lables created successfully
  successCreate=(response)=>{
     this.callAlertTimer("success", "New Label Created....");
  }

  // handle the error response from api 
  errorCall = err => { this.callAlertTimer("danger", "Unable to Process Request, Please try again! ");};

  //this method show the success/error message and after 2 sec clear it off
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content});
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "",labelCreated: true });
     }, Config.notificationMillis);
  };
  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse : !this.state.collapse });
  }
  
  render() {
    const { alertColor, content, cancelCreateLabel, doubleClick} = this.state;
    if (cancelCreateLabel) {
      return <Lables/>
    } else {
      return <div>{this.state.labelCreated?<Lables />:this.loadCreatingLable(alertColor,content, doubleClick)}</div>  
    }
  }

  //this Method shows the input fields to Create a Label.
  loadCreatingLable = (alertColor, content, doubleClick) => {
    return (<div className="animated fadeIn" >
      <Card>
        <CardHeader>
          <strong>Label</strong>
        </CardHeader>
        <Col sm="12" md={{ size: 5, offset: 4 }}>
          <br />
          {alertColor === "" ? "" : <Alert color={alertColor}>{content}</Alert>}
          <h5><b>CREATE LABEL</b></h5>
          <AvForm onSubmit={this.handleSubmitValue}>
            <AvField name="name" type="text" errorMessage="Label Name Required" placeholder="Enter Label name" required />
            <AvField name="notes" value={this.state.notes} type="text" placeholder="Enter Label notes" />
            <AvField name="color" type="color" list="colors" placeholder="Enter Label Color" />
            {this.state.labels.length !==0 ?
            <FormGroup check className="checkbox">
              <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
              <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
            </FormGroup> : ""}
            <br />
            {this.loadCollapse()}<br />
            <FormGroup>
              <Button color="primary" disabled={doubleClick} > Save</Button>&nbsp;&nbsp;&nbsp;
              <Button className="label" active color="light" type="button" aria-pressed="true" onClick={this.cancelCreateLabel}>Cancel</Button>
            </FormGroup>
          </AvForm>
        </Col>
      </Card>
    </div>);
  }
  
  //This Method Called When Sublables Makes Enable true.
  loadCollapse=()=>{
    return (<Collapse isOpen={this.state.collapse}>
        <Input type="select" name="selectLg" id="selectLg" onChange={(event)=>this.setState({parentId:event.target.value})} bsSize="lg">
          <option value="null">Please select Parent Lables</option>
          {this.state.labels.length===0 ?'': this.state.labels.map((label,key) => {return(<option key={key} value={label.id}>{label.name}</option>)})}
        </Input>
      </Collapse>);
  }
}

export default CreateLable;
