import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Col, Row, Alert, FormGroup, Card, CardHeader } from "reactstrap";
import Lables from "./Bill";
import BillApi from "../../services/BillApi";
import Select from 'react-select';
import {colourStyles} from '../../data/colourStyles';

class UpdateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor : "#000000",
      content : '',
      updateSuccess : false,
      profileId : props.pid,
      collapse : false,
      labels : props.lables,
      categories : props.categories,
      bill : props.bill,
      labelOption : props.bill.labelIds,
      categoryOptionUpdate : false,
      labelOptionUpdate : false,
      categoryOption : props.bill.categoryId
     };
  }
 
  //this method handle form submission values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, categoryOptionUpdate, labelOptionUpdate } = this.state 
    const  newData = {...values,"categoryId":categoryOptionUpdate ? categoryOption.value : categoryOption,"labelIds":labelOption===null?[]:( labelOptionUpdate ? labelOption.map(opt=>{return opt.value}): labelOption ),"version": this.props.bill.version}
    if (errors.length === 0) { this.handleUpdate(event, newData); }
  }

  handleUpdate = (e, data) => {
     new BillApi().updateBill(this.successCall, this.errorCall, data, this.state.profileId, this.props.bill.id)
  };

  //This method called when Bill is Successfully updated
  successCall = json => {
    this.callAlertTimer("success", "Bill Updated Successfully... ");
  };

  //This method shows the Api Error messages if any 
  errorCall = err => {
    this.callAlertTimer("danger", "Something went wrong, Please Try Again... ");
  };

  //this method shows the response messages for user
  callAlertTimer = (alertColor, content) =>  {
    this.setState({ alertColor, content }); 
    setTimeout(() => {
      this.setState({ name : '', alertColor : '', updateSuccess : true });
    }, 2000);
  };

  labelSelected = (labelOption) =>{
    this.setState({ labelOption, labelOptionUpdate : true})
  }

  categorySelected = (categoryOption) =>{
    this.setState({categoryOption, categoryOptionUpdate : true})
  }
    
  render() {
    const { alertColor, content, updateSuccess, labels, categories, bill } = this.state;
    return <div>{updateSuccess ? <Lables /> : this.loadUpdatingLabel(alertColor, content, labels, categories, bill)}</div>
  }

  loadHeader = () => <CardHeader><strong>Update Bill</strong></CardHeader>

  //this method call when updating profile
  loadUpdatingLabel=(alertColor,content,labels,categories,bill)=>{
    return( 
      <div className="animated fadeIn" >
        <Card>
          {this.loadHeader()}
          <h5 style={{paddingTop:20}}><b><center>EDIT BILL</center></b></h5>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <br />
            <Alert color={alertColor}>{content}</Alert>
              <AvForm onSubmit={this.handleSubmitValue}>
                <Row>
                  <Col sm={2}>
                    <AvField type="select" name="currencgetProfileIdy" value={bill.currency} errorMessage="Select Any One Category" required>
                      <option value="EUR">€</option>
                      <option value="USD">$</option>
                      <option value="INR">₹</option>
                    </AvField>
                  </Col>
                  <Col>
                    <AvField name="amount" value={bill.amount} placeholder="Amount" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required />
                  </Col>
                </Row>
                <Row>
                  <Col> {this.categoryOptions(categories, bill)}</Col>
                </Row><br />
                <Row>
                  <Col><AvField name="billDate" label="Bill Date" value={bill.billDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
                  <Col><AvField name="dueDate" label="Due Date" value={bill.dueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
                </Row>
                <Row>
                  <Col> <AvField name="notes" type="text" value={bill.notes} list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes " required /></Col>
                </Row>
                <Row>
                  <Col> {this.lablesOptions(labels, bill)}</Col>
                </Row><br />
                <FormGroup>
                  <Button color="info"> Update </Button> &nbsp;&nbsp;
                  <a href='/listBills'><Button type="button">Cancel</Button></a>
                </FormGroup>
              </AvForm>
            </Col>
          </Card>
        </div>)
  }

  categoryOptions = (categories,bill) =>{
    const options = [];
    categories.map(category=>{
           if(category.subCategories !== null){
             options.push({label:<b>{category.name}</b>, color:category.color ===null ?"#000000": category.color,value:category.id})
             category.subCategories.map(subCategory=>{
               return options.push({label:<span style={{paddingLeft:15}}>{subCategory.name}</span> , color:subCategory.color ===null ?"#000000": subCategory.color,value:subCategory.id})
             })
           }else{
             return options.push({value: category.id, label: category.name, color: category.color ===null ?"#000000" :category.color })
           }
           return 0;
       })
    return <Select options={options}  defaultValue={options.filter(item=>{return item.value===bill.categoryId})} styles={colourStyles}  placeholder="Select Categories " onChange={this.categorySelected} required/> ;
 }
  
  lablesOptions = (labels, bill) =>{
    const options = [];
    labels.map(label=>{
            if(label.subLabels !== null){
              options.push({label:label.name, color:label.color ===null ?"#000000": label.color,value:label.id})
              label.subLabels.map(subLabel=>{
                return options.push({label:label.name+"/"+subLabel.name, color:subLabel.color ===null ?"#000000": subLabel.color,value:subLabel.id})
              })
            }else{
              return options.push({value: label.id, label: label.name, color:label.color ===null ?"#000000" :label.color })
            }
            return 0;
        })
    const data =  bill.labelIds===null ?'': bill.labelIds.map(id=>{return options.filter(item =>{return item.value===id})}).flat();
    return <Select isMulti options={options}  defaultValue={data} styles={colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.labelSelected}/> ;
  }
}

export default UpdateBill;
