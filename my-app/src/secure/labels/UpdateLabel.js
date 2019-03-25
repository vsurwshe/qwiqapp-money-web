import React, { Component } from "react";
import { Button,Col, Input, Alert ,FormGroup,Card,CardHeader} from "reactstrap";
import LabelApi from "../../services/LabelApi";
class UpdateLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: this.props.name,
      notes:this.props.notes,
      version:this.props.version,
      color: "",
      content: "",
      updateSuccess: false
    };
  }
  //This method handle Updations of Labels
  handleUpdate = () => {
    let data = { name: this.state.name,notes:this.state.notes,version:this.state.version };
    new LabelApi().updateLabel( () => {
        this.setState({ updateSuccess: true });
      }, this.errorCall, data,11, this.state.id )
  };

  errorCall = err => {
    this.callAlertTimer( "danger", "Something went wrong, Please Try Again... ");
  };

  callAlertTimer = (color, content) => {
    this.setState({ color: color, content: content });
    setTimeout(() => {
      this.setState({ name: '', color: ''});
    }, 4000);
  };

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
    return(
    <div className="animated fadeIn">
      <Card>
      <CardHeader>
        <strong>Label</strong>
      </CardHeader>
      <center style={{paddingTop:'20px'}}>
        <h5><b>Your Label Updated Successfully !!</b><br /><br />
        <a href="/label/labels">View Label</a></h5>
     </center>
     </Card>
    </div>
    )
  }

  //this method call when updating profile
  loadUpdatingLable=(name,notes,color,content)=>{
     return( 
       <div className="animated fadeIn" >
         <Card>
           <CardHeader>
             <strong>Label</strong>
           </CardHeader>
           <center>
             <Alert color={color}>{content}</Alert>
             <FormGroup>
               <h5><b>EDIT LABEL</b></h5>
               <Col sm="6">
                 <Input type="text" name="Label name" value={name} style={{ fontWeight: 'bold', color: '#000000' }} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }} /><br />
                 <Input type="text" name="Label Notes" value={notes} style={{ fontWeight: 'bold', color: '#000000' }} onChange={e => { this.setState({ notes: e.target.value }) }} />
               </Col><br />
               <Button color="success" disabled={!name} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
                <a href="/label/labels" style={{ textDecoration: 'none' }}> <Button active color="light" aria-pressed="true">Cancel</Button></a>
             </FormGroup>
           </center>
         </Card>
       </div>
      )
  }
}

export default UpdateLabel;
