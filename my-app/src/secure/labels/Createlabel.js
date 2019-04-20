import React, { Component } from "react";
import { Alert, Button, Input, Card, CardHeader,FormGroup,Col,Collapse,Label  } from "reactstrap";
import LabelApi from "../../services/LabelApi";
import Lables from './Label';
import "default-passive-events";
class CreateLable extends Component {
  constructor(props){
    super(props);
    this.state = {
      labels:[0],
      name: "",
      parentId:'',
      notes:"",
      alertColor: "",
      userColor:"#000000",
      content: "",
      labelCreated: false,
      collapse: false,
      profileId:this.props.pid
    };
  }
  //this method handle the successfull response form geting api
  successCall = json => {
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
 handleSubmit =async e => {
    e.preventDefault();
    const data = {
      color:this.state.userColor,
      name: this.state.name,
      notes:this.state.notes,
      parentId:this.state.parentId };
    await new LabelApi().createLabel(this.successCreate,this.errorCall,this.state.profileId,data);
  };
  //this method call when lables created successfully
  successCreate=()=>{
     this.callAlertTimer("success", "New Label Created....");
  }
  //this handel the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", err);};
  //this method show the message wait some times
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "",labelCreated: true });
     }, 2000);
  };
  //this method makes true or false for the collapse
  toggle=()=> {
    this.setState({ collapse: !this.state.collapse });
    new LabelApi().getlabels(this.successCall, this.errorCall,this.state.profileId);
  }
  
  render() {
    const { alertColor, content} = this.state;
    return <div>{this.state.labelCreated?<Lables />:this.loadCreatingLable(alertColor,content)}</div>
    }
  //this Method Call when Label Creation in porceess.
  loadCreatingLable=(alertColor,content)=>{
    return (<div className="animated fadeIn" >
      <Card>
        <CardHeader>
          <strong>Label</strong>
        </CardHeader>
        <Col sm="12" md={{ size: 5, offset: 4 }}>
        <br/>
          <Alert color={alertColor}>{content}</Alert>
          <h5><b>CREATE LABEL</b></h5>
          <FormGroup>
            <Input name="name" value={this.state.name} type="text" placeholder="Enter Label name" autoFocus={true} onChange={e => this.handleInput(e)} /><br />
            <Input name="notes" value={this.state.notes} type="text" placeholder="Enter Label notes" autoFocus={true} onChange={e => this.handleInput(e)} /><br />
            <Input name="userColor" type="color" list="colors"  placeholder="Enter Label Color" autoFocus={true} onChange={e => {this.handleInput(e)}} /><br />
            <FormGroup check className="checkbox">
              <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
              <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
            </FormGroup><br />
            {this.loadCollapse()}
            <br />
            <Button color="info" disabled={!this.state.name} onClick={e => this.handleSubmit(e)} > Save label </Button>
            <a href="/label/labels" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
          </FormGroup>
        </Col>
      </Card>
    </div>);
  }
  //this method calls after Successful Creation Of Label
  loadCreatedMessage=()=>{
    
    return (<div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Label</strong>
        </CardHeader>
        <center style={{ paddingTop: '20px' }}>
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
          {this.state.labels.map((label,key) => {return(
            <option key={key} value={label.id}>{label.name}
              </option>
              )})}
         </Input>
      </Collapse>);
  }
}

export default CreateLable;
