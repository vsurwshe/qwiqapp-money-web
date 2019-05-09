import React, { Component } from "react";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button,Col, Row, Alert ,FormGroup,Card,CardHeader,Label,Collapse,FormText} from "reactstrap";
import Lables from "./Bill";
import BillApi from "../../services/BillApi";
import Select from 'react-select';
import chroma from 'chroma-js';

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color );
    if(color===null || color!==null){
      return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  }
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

class UpdateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor : "#000000",
      content : "",
      updateSuccess : false,
      profileId :this.props.pid,
      collapse : false,
      labels : this.props.lables,
      categories : this.props.categories,
      bill : this.props.bill,
      labelOption:this.props.bill.labelIds,
      categoriesUpdateOptionsUdpdate:false,
      labelOptionUpdate: false,
      categoryOption:this.props.bill.categoryId
     };
  }

  labelSelected=(labelOption)=>{
    this.setState({labelOption, labelOptionUpdate:true})
    console.log(labelOption)
   }

   categorySelected=(categoryOption)=>{
    this.setState({categoryOption, categoriesUpdateOptionsUdpdate:true})
    console.log(categoryOption)
   }

  
  //this method handle input from user given
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
   
  //this method make lable as main lable
  changeParentId=()=>{
    this.setState({parentId:""});
  }
  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    const {labelOption,categoryOption, categoriesUpdateOptionsUdpdate,labelOptionUpdate}=this.state 
    
    if(categoryOption===null)
    {alert('Plese Select Catgory')}
    else{
      console.log("Lablel",labelOption)
      const  newData = {...values,"categoryId":categoriesUpdateOptionsUdpdate ?categoryOption.value : categoryOption,"labelIds":labelOption===null?[]:( labelOptionUpdate ? labelOption.map(opt=>{return opt.value}): labelOption ),"version": this.props.bill.version}
      console.log(newData)
      if (errors.length === 0) { this.handleUpdate(event, newData); }
    } 
  }

  handleUpdate = (e, data) => {
     new BillApi().updateBill(this.SuccessCall, this.errorCall, data, this.state.profileId, this.props.bill.id)
  };
  //this called When Componets Calling SucessFully
  SuccessCall = json => {
    this.callAlertTimer("success", "Bill Updated Successfully... ");
  };
  //when any api goto the api executions failed then called this method 
  errorCall = err => {
    this.callAlertTimer("danger", "Something went wrong, Please Try Again... ");
  };

  //this  method show the on page alert
  callAlertTimer = (alertColor, content) =>  {
    this.setState({ alertColor, content }); 
    setTimeout(() => {
      this.setState({ name: '', alertColor: '', updateSuccess: true });
    }, 2000);
  };

  render() {
    const {alertColor, content, updateSuccess,labels,categories,bill } = this.state;
  
    return <div>{updateSuccess ?<Lables />:this.loadUpdatingLable(alertColor,content,labels,categories,bill)}</div>
  }
  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Update Bill</strong>
      </CardHeader>
    )
  }

  //this method call when updating profile
  loadUpdatingLable=(alertColor,content,labels,categories,bill)=>{
     return( 
       <div className="animated fadeIn" >
         <Card>
           {this.loadHeader()}
           <Col sm="12" md={{ size: 5, offset: 4 }}>
             <br />
             <Alert color={alertColor}>{content}</Alert>
             <h5><b>EDIT BILL</b></h5>
             <AvForm onSubmit={this.handleSubmitValue}>
             <Row>
             <Col sm={1.6}>
               <AvField type="select" name="currency" value={bill.currency} errorMessage="Select Any One Category" required>
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
             <Col> {this.categoryOptions(categories,bill)}</Col>
              </Row><br/>  
               <Row>
               <Col><AvField name="billDate" label="Bill Date" value={bill.billDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
               <Col><AvField name="dueDate" label="Due Date" value={bill.dueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
               </Row>
               <Row>
                <Col> <AvField name="notes" type="text" value={bill.notes} list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes " required /></Col>
               </Row>
               <Row>
               <Col> {this.lablesOptions(labels,bill)}</Col>
               </Row><br/>
               <FormGroup>
                 <Button color="info"> Save Bill </Button> &nbsp;&nbsp;
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
  
  lablesOptions = (labels,bill) =>{
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
        const data=  bill.labelIds===null ?'': bill.labelIds.map(id=>{return options.filter(item =>{return item.value===id})}).flat();
        return <Select isMulti options={options}  defaultValue={data} styles={colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.labelSelected}/> ;
  }
}
export default UpdateBill;
