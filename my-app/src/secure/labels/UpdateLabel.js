import React, { Component } from "react";
import { Button,Col, Input, Alert ,FormGroup,Card,CardHeader,Label,Collapse} from "reactstrap";
import LabelApi from "../../services/LabelApi";
import Lables from "./Label";
class UpdateLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.label.id,
      name: props.label.name,
      notes: props.label.notes,
      version: props.label.version,
      userColor: props.label.color,
      parentId: props.label.parentId,
      profileId: props.pid,
      labels: props.lables,
      alertColor: "#000000",
      content: "",
      updateSuccess: false,
      collapse: false,
      cancelUpdateLabel:false,
    };
  }
  handleUpdate = () => {
    let data = { color:this.state.userColor,
      name: this.state.name,
      notes:this.state.notes,
      parentId:this.state.parentId,
      version:this.state.version };
    new LabelApi().updateLabel(this.SuccessCall, this.errorCall, data,this.state.profileId, this.state.id )
  };
  cancelUpdateLabel=()=>{
this.setState({ cancelUpdateLabel:true  });
  }
  //this called When Componets Calling SucessFully
  SuccessCall = json => {
     this.callAlertTimer( "success", "Label Updated Successfully... ");
  };
 //when any api goto the api executions failed then called this method 
  errorCall = err => {
    this.callAlertTimer( "danger", "Unable to Process Your Request, Please Try Again... ");
  };
//this  method show the on page alert
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content});
    setTimeout(() => {this.setState({ name: '', alertColor: '',updateSuccess: true });
    }, 1500);
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
    const { name, notes, alertColor, content, updateSuccess, userColor,cancelUpdateLabel } = this.state;
    if(cancelUpdateLabel){
      return <Lables/>
    }else{
    return <div>{ updateSuccess ? <Lables /> : this.loadUpdatingLable(name,notes,alertColor,content,userColor) }</div>
   }
}
  //This method shows the fields to update a Lable
  loadUpdatingLable = (name, notes, alertColor, content, userColor) =>{
    return( 
      <div className="animated fadeIn" >
        <Card>
          <CardHeader><strong>Label</strong> </CardHeader>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <br/>
            <Alert color={alertColor}>{content}</Alert>
            <FormGroup>
              <h5><b>EDIT LABEL</b></h5>
              <Input type="text" name="Label name" value={name} style={{ fontWeight: 'bold', color: '#000000' }} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }} /><br />
              <Input type="text" name="Label Notes" placeholder="Label notes" value={notes} style={{ fontWeight: 'bold', color: '#000000' }} onChange={e => { this.setState({ notes: e.target.value }) }} /><br/>
              <Input type="color" name="Label Color" list="Colors" value={userColor} style={{ fontWeight: 'bold', color: '#000000' }} onChange={e => { this.setState({ userColor: e.target.value }) }} /><br/>
              {this.state.parentId !== null ?this.loadSublabelMakeParentLabel() : this.loadParentLableMakeSubLable()}
              {this.loadCollapse()}
              <br />
              <Button color="success" disabled={!name} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
             <Button active color="light" aria-pressed="true" onClick={this.cancelUpdateLabel}>Cancel</Button>
            </FormGroup>
          </Col>
        </Card>
      </div>)
  }
  loadSublabelMakeParentLabel=()=>{
    return(<FormGroup check className="checkbox">
    <Input className="form-check-input" type="checkbox"   onClick={this.changeParentId}  value=" " />
    <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Make as Parent-Label</Label>
  </FormGroup>)
  }

  loadParentLableMakeSubLable=()=>{
    return(<FormGroup check className="checkbox">
    <Input className="form-check-input" type="checkbox"   onClick={this.toggle}  value=" " />
    <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under</Label>
  </FormGroup>)
  }

  loadCollapse=()=>{
    return (<Collapse isOpen={this.state.collapse}>
        <Input type="select" name="selectLg" id="selectLg" onChange={(event)=>this.setState({parentId:event.target.value})} bsSize="lg">
          <option value="null">Please select Parent Lables</option>
          {this.state.labels.map((label) => {return( this.state.id===label.id ? '': <option key={label.id} value={label.id}>{label.name}</option>)})}
        </Input>
      </Collapse>);
  }


}

export default UpdateLabel;