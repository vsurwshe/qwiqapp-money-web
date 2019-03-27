import React, { Component } from "react";
import { Alert, Button, Input, Card, CardBody, CardHeader,FormGroup,Col,Collapse,Label  } from "reactstrap";
import { AppSwitch } from '@coreui/react'
import LabelApi from "../../services/LabelApi";
class CreateLable extends Component {
  constructor(props){
    super(props);
    this.state = {
      labels:[0],
      name: "",
      parentId:'',
      notes:"",
      color: "",
      content: "",
      labelCreated: false,
      collapse: false,
      profileId:this.props.pid
    };
  }
  //this method handle the successfull response form geting api
  successCall = json => {
    console.log(json);
    if (json === []) {
      this.setState({ labels: [0] })
    }else {
      this.setState({ labels: json })}
  };
  //this method handle input from user given
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  //this method handle the submition from user
  handleSubmit = e => {
    e.preventDefault();
    const data = { name: this.state.name,notes:this.state.notes,parentId:this.state.parentId };
    new LabelApi().createLabel(this.successCreate,this.errorCall,this.state.profileId,data);
  };
  //this method call when lables created successfully
  successCreate=()=>{
    this.setState({ labelCreated: true });
    this.callAlertTimer("success", "New Label Created!!");
  }
  //this handel the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", err);};
  //this method show the message wait some times
  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {this.setState({ name: "", content: "", color: "" });
    }, 2000);
  };
  //this method makes true or false for the collapse
  toggle=()=> {
    this.setState({ collapse: !this.state.collapse });
    new LabelApi().getlabels(this.successCall, this.errorCall,this.state.profileId);
  }
  
  render() {
    if (!this.state.labelCreated) {
      return <div>{this.loadCreatingProfile()}</div>
    } else {
      return <div>{this.loadCreatedMessage()}</div>
    }
  }
  //this Method Call when Label Creation in porceess.
  loadCreatingProfile=()=>{
    return(<div className="animated fadeIn">
          <Card>
            <CardHeader>
              <strong>Label</strong>
            </CardHeader>
            <Alert color={this.state.color}>{this.state.content}</Alert>
            <CardBody>
              <center>
              <FormGroup>
                <h5><b>CREATE LABEL</b></h5>
                 <Col sm="6">
                 <Input name="name" value={this.state.name} type="text" placeholder="Enter Label name" autoFocus={true} onChange={e => this.handleInput(e)} /><br/>
                 <Input name="notes" value={this.state.notes} type="text" placeholder="Enter Label notes" autoFocus={true} onChange={e => this.handleInput(e)} /><br/>
                 <FormGroup check className="checkbox">
                        <Label check className="form-check-label" htmlFor="checkbox1">Enable this for Make as Sub-Label</Label><br/>
                        <AppSwitch className={'mx-1'} color={'success'} onClick={this.toggle} outline label dataOn={'Yes'} dataOff={'No'}  />
                </FormGroup><br />
                {this.loadCollapse()}
                </Col><br />
                <Button color="info" disabled={!this.state.name || !this.state.notes } onClick={e => this.handleSubmit(e)} > Save label </Button>
                <a href="/label/labels" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a>
                </FormGroup>
              </center>
            </CardBody>
          </Card>
        </div>);
  }
  //this method calls after Successful Creation Of Label
  loadCreatedMessage=()=>{
    return(<div className="animated fadeIn">
          <Card>
            <CardHeader>
              <strong>Label</strong>
            </CardHeader>
          <center style={{paddingTop:'20px'}}>
            <h5><b>Label Created Successfully !!</b> <br /> <br />
              <b><a href="/label/labels">View Lables</a></b></h5>
          </center>
        </Card>
        </div>)
  }
  //This Method Called When Sublables Makes Enable true.
  loadCollapse=()=>{
    return (<Collapse isOpen={this.state.collapse}>
        <Input type="select" name="selectLg" id="selectLg" onChange={(event)=>this.setState({parentId:event.target.value})} bsSize="lg">
          <option value="null">Please select Parent Lables</option>
          {this.state.labels.map((labels) => {return(<option key={labels.id} value={labels.id}>{labels.name}</option>)})}
         </Input>
      </Collapse>);
  }
}

export default CreateLable;
