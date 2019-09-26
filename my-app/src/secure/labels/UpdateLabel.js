import React, { Component } from "react";
import { Button, Col, Input, Alert, FormGroup, Card, CardHeader, Label, Collapse } from "reactstrap";
import LabelApi from "../../services/LabelApi";
import Lables from "./Labels";
import Config from "../../data/Config";

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
      cancelUpdateLabel: false,
      doubleClick: false,
      index: props.index
    };
  }

  handleUpdate = () => {
    const { userColor, name, notes, parentId, version, profileId, id } = this.state;
    let data = {
      color: userColor,
      name: name,
      notes: notes,
      parentId: parentId,
      version: version
    };
    this.setState({ doubleClick: true });
    new LabelApi().updateLabel(this.successCall, this.errorCall, data, profileId, id)
  };

  cancelUpdateLabel = () => {
    this.setState({ cancelUpdateLabel: true });
  }

  //this called When Componets Calling SucessFully
  successCall = json => {
    this.callAlertTimer("success", "Label Updated Successfully... ");
  };

  //when any api goto the api executions failed then called this method 
  errorCall = err => {
    this.callAlertTimer("danger", "Unable to Process Your Request, Please Try Again... ");
  };

  //this  method show the on page alert
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: '', alertColor: '', updateSuccess: true });
    }, Config.notificationMillis);
  };

  //this method make lable as main lable
  changeParentId = () => {
    this.setState({ parentId: "" });
  }

  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { name, notes, alertColor, content, updateSuccess, userColor, cancelUpdateLabel, index } = this.state;
    if (cancelUpdateLabel) {
      return <Lables />
    } else {
      return <div>{updateSuccess ? <Lables index={index} /> : this.loadUpdatingLable(name, notes, alertColor, content, userColor)}</div>
    }
  }

  //This method shows the fields to update a Lable
  loadUpdatingLable = (name, notes, alertColor, content, userColor) => {
    return (
      <div className="animated fadeIn" >
        <Card>
          <CardHeader><strong>Label</strong> </CardHeader>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <br />
            <Alert color={alertColor}>{content}</Alert>
            <FormGroup>
              <h5><b>EDIT LABEL</b></h5>
              <Input type="text" name="Label name" value={name} style={{ fontWeight: 'bold', color: '#000000' }} autoFocus={true} onChange={e => { this.setState({ name: e.target.value }) }} /><br />
              <Input type="text" name="Label Notes" placeholder="Label notes" value={notes} style={{ fontWeight: 'bold', color: '#000000' }} onChange={e => { this.setState({ notes: e.target.value }) }} /><br />
              <Input type="color" name="Label Color" list="Colors" value={userColor} style={{ fontWeight: 'bold', color: '#000000' }} onChange={e => { this.setState({ userColor: e.target.value }) }} /><br />
              {this.props.label.parentId ? this.loadSublabelMakeParentLabel() : this.state.labels.length <= 1 ? "" : this.loadParentLableMakeSubLable()}
              {this.state.labels.length <= 1 ? "" : this.loadCollapse()}
              <br />
              <Button color="success" disabled={!name && this.state.doubleClick} onClick={this.handleUpdate} >Edit  </Button>&nbsp;&nbsp;&nbsp;
             <Button active color="light" aria-pressed="true" onClick={this.cancelUpdateLabel}>Cancel</Button>
            </FormGroup>
          </Col>
        </Card>
      </div>)
  }
  // sub label as parent action
  loadSublabelMakeParentLabel = () => {
    return <FormGroup check className="checkbox">
      <Input className="form-check-input" type="checkbox" onClick={this.changeParentId} value=" " />
      <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Make as Parent-Label</Label>
    </FormGroup>
  }

  loadParentLableMakeSubLable = () => {
    return <FormGroup check className="checkbox">
      <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
      <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest label under</Label>
    </FormGroup>
  }

  loadCollapse = () => {
    return <Collapse isOpen={this.state.collapse}>
      <Input type="select" name="selectLg" id="selectLg" onChange={(event) => this.setState({ parentId: event.target.value })} bsSize="lg">
        <option value="null">Please select Parent Lables</option>
        {this.state.labels.map((label) => { return (this.state.id === label.id ? '' : <option key={label.id} value={label.id}>{label.name}</option>) })}
      </Input>
    </Collapse>;
  }
}

export default UpdateLabel;