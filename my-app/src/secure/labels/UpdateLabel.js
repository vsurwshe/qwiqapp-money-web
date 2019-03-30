import React, { Component } from "react";
import { Button,Col, Input, Alert ,FormGroup,Card,CardHeader,Label,Collapse} from "reactstrap";
import LabelApi from "../../services/LabelApi";
class UpdateLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.label.id,
      name: this.props.label.name,
      notes:this.props.label.notes,
      version:this.props.label.version,
      ucolor:this.props.label.color,
      parentId:this.props.label.parentId,
      color: "",
      content: "",
      updateSuccess: false,
      profileId:this.props.pid,
      collapse: false,
      labels:this.props.lables
    };
  }
  handleUpdate = () => {
    let data = { color:this.state.ucolor,name: this.state.name,notes:this.state.notes,parentId:this.state.parentId,version:this.state.version };
    new LabelApi().updateLabel(this.SuccessCall, this.errorCall, data,this.state.profileId, this.state.id )
  };
  //this called When Componets Calling SucessFully
  SuccessCall = json => {
    this.setState({ updateSuccess: true });
  };
 //when any api goto the api executions failed then called this method 
  errorCall = err => {
    this.callAlertTimer( "danger", "Something went wrong, Please Try Again... ");
  };
//this  method show the on page alert
  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {this.setState({ name: '', color: ''});
    }, 4000);

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
    const { name,notes, color, content, updateSuccess } = this.state;
    if (updateSuccess) {
      return <div>{this.loadUpdateMessage()}</div>
    } else {
      return <div>{this.loadUpdatingLable(name,notes,color,content)}</div>
    }
  }

  //this method call after successfully updtaed profile
  loadUpdateMessage=()=>{
    return(<div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Label</strong>
          </CardHeader>
          <center style={{ paddingTop: '20px' }}>
            <h5><b>Your Label Updated Successfully !!</b><br /><br />
              <a href="/label/labels">View Label</a></h5>
          </center>
        </Card>
      </div>)
  }
  //this method call when updating profile
  loadUpdatingLable=(name,notes,color,content,ucolor)=>{
     return( 
       <div className="animated fadeIn" >
         <Card>
           <CardHeader>
             <strong>Label</strong>
           </CardHeader>
           <Col sm="12" md={{ size: 5, offset: 4 }}>
             <Alert color={color}>{content}</Alert>
             <FormGroup>
               <h5><b>EDIT LABEL</b></h5>
                 <Input type="text" name="Label name" value={name} style={{ fontWeight: 'bold', color: '#000000' }} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }} /><br />
                 <Input type="text" name="Label Notes" value={notes} style={{ fontWeight: 'bold', color: '#000000' }} onChange={e => { this.setState({ notes: e.target.value }) }} /><br/>
                 <Input type="color" name="Label Color" value={ucolor} style={{ fontWeight: 'bold', color: '#000000' }} onChange={e => { this.setState({ ucolor: e.target.value }) }} /><br/>
                 {this.state.parentId !== null ?this.loadSublabelMakeParentLabel() : this.loadParentLableMakeSubLable()}
                 {this.loadCollapse()}
                <br />
               <Button color="success" disabled={!name} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
                <a href="/label/labels" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
             </FormGroup>
           
           </Col>
         </Card>
       </div>)
  }
  loadSublabelMakeParentLabel=()=>{
    return(<FormGroup check className="checkbox">
    <Input className="form-check-input" type="checkbox"   onClick={this.changeParentId}  value=" " />
    <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Enable this for Make as  Parent-Label</Label>
  </FormGroup>)
  }

  loadParentLableMakeSubLable=()=>{
    return(<FormGroup check className="checkbox">
    <Input className="form-check-input" type="checkbox"   onClick={this.toggle}  value=" " />
    <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Enable this for Make as Sub-Label</Label>
  </FormGroup>)
  }

  loadCollapse=()=>{
    return (<Collapse isOpen={this.state.collapse}>
        <Input type="select" name="selectLg" id="selectLg" onChange={(event)=>this.setState({parentId:event.target.value})} bsSize="lg">
          <option value="null">Please select Parent Lables</option>
          {this.state.labels.map((labels) => {return( this.state.id===labels.id ? '': <option key={labels.id} value={labels.id}>{labels.name}</option>)})}
         </Input>
      </Collapse>);
  }


}

export default UpdateLabel;
