import React, { Component } from "react";
import { Alert, Card, CardHeader, CardBody, Col } from "reactstrap";
import LabelApi from "../../services/LabelApi";
import Lables from './Labels';
import Config from "../../data/Config";
import { CategoryLabelForm } from "../utility/FormsModel";

class LabelForm extends Component {
  _isMount = false;
  constructor(props) {
    super(props);
    this.state = {
      labels: props.lables,
      alertColor: "",
      content: "",
      labelAction: false,
      collapse: props.label ? (props.label.parentId ? true : false) : false,
      cancelLabel: false,
      doubleClick: false,
      chkMakeParent: false,
      index: props.index,
      hideCancel: props.hideButton
    };
  }

  componentDidMount(){
    this._isMount = true;
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  // handle the submission from user
  handleSubmitValue = (event, values) => {
    this.handleApiCalls(event, values);
  }

  cancelLabelAction = () => {
    this.setState({ cancelLabel: true });
  }

  // This method handel api calls
  handleApiCalls = async (event, data) => {
    const { profileId } = this.props;
    const { label } = this.props
    this.setState({ doubleClick: true });
    event.persist();
    // This condition decides its label Creation or Updation
    if (label) {
      let newData = {
        ...data,
        version: label.version,
        parentId: data.makeParent ? null : data.parentId
      }
      new LabelApi().updateLabel(this.successCall, this.errorCall, newData, profileId, label.id);
    } else {
      new LabelApi().createLabel(this.successCall, this.errorCall, profileId, data);
    }
  };

  // call when lables created successfully
  successCall = (response) => {
    if (this.props.label) {
      this.callAlertTimer("success", "Label updated successfully !");
    } else {
      this.callAlertTimer("success", "New label created successfully!");
    }
  }

  // handle the error response from api 
  errorCall = err => { this.callAlertTimer("danger", "Unable to Process Request, Please try again! "); };

  //this method show the success/error message and after 2 sec clear it off
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      if(this.state.hideCancel){
        this.setState({ hideCancel: '' })
        this.props.toggleCreateModal('', true)
      } else{
        if (this._isMount) {
          this.setState({ name: "", content: "", alertColor: "", labelAction: true });
        }
      }
    }, Config.notificationMillis);
  };

  //this method makes true or false for the collapse
  toggle = () => { this.setState({ collapse: !this.state.collapse }); }

  render() {
    const { cancelLabel, labelAction, index } = this.state;
    if (cancelLabel) {
      return <Lables index={index} />
    } else {
      return <div>{labelAction ? <Lables index={index} /> : this.loadCreatingLable()}</div>
    }
  }

  //this Method shows the input fields to Create a Label.
  loadCreatingLable = () => {
    const { alertColor, content, profileId, collapse, doubleClick, chkMakeParent, labels, hideCancel } = this.state;
    const { parentId, notes, name, color } = this.props.label ? this.props.label : ''
    let filteredLabels = this.props.label && labels.filter(label => label.id !== this.props.label.id)
    const labelFields = {
      items: this.props.label ? filteredLabels : labels,
      profileId: profileId,
      parentId: parentId,
      itemName: name,
      itemColor: color,
      collapse: collapse,
      doubleClick: doubleClick,
      chkMakeParent: chkMakeParent,
      notes: notes,
      componentType: "Label",
      updateItem: this.props.label,
      hideCancel: hideCancel
    };
    return <Card>
      {!hideCancel && 
      <CardHeader>
        <strong>Label</strong>
      </CardHeader> }
      <CardBody>
        <Col sm="1" md={{ size: 8, offset: 2 }}>
          <center><h5> <b>{!this.props.label ? "NEW LABEL" : "EDIT LABEL"}</b> </h5> </center>
          {alertColor && <Alert color={alertColor}>{content}</Alert>}
          <CategoryLabelForm
            data={labelFields}
            handleSubmitValue={this.handleSubmitValue}
            handleInput={this.handleInput}
            toggle={this.toggle}
            cancelCategory={this.cancelLabelAction}
            buttonText={this.props.label ? "Edit Label" : "Save Label"}
          />
        </Col>
      </CardBody>
    </Card>;
  }
}

export default LabelForm;
