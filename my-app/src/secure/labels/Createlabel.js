import React, { Component } from "react";
import { Alert, Button, Input, Card, CardHeader, FormGroup, Col, Collapse, Label  } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import LabelApi from "../../services/LabelApi";
import Lables from './Label';
<<<<<<< HEAD

=======
// import "default-passive-events";
>>>>>>> 0.4: Labels color applied on selected label, sublabel showing, searchable dropdown added
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
      profileId: props.pid
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

  //this method handle the submission from user
  handlePostData = async (e,data) => {
    e.persist();
    const newData={...data,"parentId":this.state.parentId}
    await new LabelApi().createLabel( this.successCreate, this.errorCall, this.state.profileId, newData);
  };
  //this method call when lables created successfully
  successCreate=()=>{
     this.callAlertTimer("success", "New Label Created....");
  }

  //this method handle the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", "Unable to Process Request, Please try again! ");};

  //this method show the success/error message and after 2 sec clear it off
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "",labelCreated: true });
     }, 2000);
  };
  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse : !this.state.collapse });
    // new LabelApi().getlabels(this.successCall, this.errorCall, this.state.profileId);
  }
  
  render() {
    const { alertColor, content} = this.state;
    return <div>{this.state.labelCreated?<Lables />:this.loadCreatingLable(alertColor,content)}</div>
  }

  //this Method shows the input fields to Create a Label.
  loadCreatingLable = (alertColor, content) =>{
    return (<div className="animated fadeIn" >
      <Card>
        <CardHeader>
          <strong>Label</strong>
        </CardHeader>
        <Col sm="12" md={{ size: 5, offset: 4 }}>
        <br/>
          <Alert color={alertColor}>{content}</Alert>
          <h5><b>CREATE LABEL</b></h5>
          <AvForm onSubmit={this.handleSubmitValue}>
          <AvField name="name" type="text" errorMessage="Label Name Required" placeholder="Enter Label name"  required />
          <AvField name="notes" value={this.state.notes} type="text" placeholder="Enter Label notes" />
          <AvField name="color" type="color" list="colors"  placeholder="Enter Label Color" />
          <FormGroup check className="checkbox">
              <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
              <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under </Label>
            </FormGroup><br />
            {this.loadCollapse()}<br/>
            <FormGroup>
            <Button color="info" > Save label </Button>
            <a href="/label/labels" style={{ textDecoration: 'none' }}> <Button active color="light" type="button" aria-pressed="true">Cancel</Button></a>
            </FormGroup>
          </AvForm>
        </Col>
      </Card>
    </div>);
  }
  //this method calls after Successful Creation Of Label
  loadCreatedMessage = () =>{
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Label</strong></CardHeader>
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
          {this.state.labels.length===0 ?'': this.state.labels.map((label,key) => {return(<option key={key} value={label.id}>{label.name}</option>)})}
        </Input>
      </Collapse>);
  }
}

export default CreateLable;
