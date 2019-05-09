import React, {Component} from "react";
import chroma from 'chroma-js';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import {Alert,Button,Card,CardHeader,FormGroup,Col,Row} from "reactstrap";
import Select from 'react-select';
import BillApi from "../../services/BillApi";
import Bills from "./Bill";


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

class CreateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: this.props.label,
      categories :this.props.categories, 
      billCreated : false,
      collapse : false,
      profileId : this.props.pid,
      alertColor : "",
      content : "",
      labelOption:[],
      categoryOption:''
     };
  }

  labelSelected=(labelOption)=>{
    this.setState({labelOption})
    console.log(labelOption)
   }

   categorySelected=(categoryOption)=>{
    this.setState({categoryOption})
    console.log(categoryOption)
   }

  //this method makes true or false for the collapse
  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }
  
  //this method handle form submitons values and errors
  handleSubmitValue = (event, errors, values) => {
    const {labelOption,categoryOption}=this.state 
    
    if(categoryOption===null)
    {alert('Plese Select Catgory')}
    else{
      const  newData = {...values,"categoryId":categoryOption.value,"labelIds":labelOption===[]?'':labelOption.map(opt=>{return opt.value})}
      if (errors.length === 0) { this.handlePostData(event, newData); }
    } 
   
  }

  //this method handle the Post method from user
  handlePostData = async (e, data) => {
    e.persist();
    console.log("data = ", data)
    await new BillApi().createBill(this.successCreate, this.errorCall, this.state.profileId, data);
  };

  //this method call when lables created successfully
  successCreate = () => {
    this.callAlertTimer("success", "New Bill Created....");
  }

  //this handel the error response the when api calling
  errorCall = err => { this.callAlertTimer("danger", "Something went Worng"); };

  //this method show the message wait some times
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: "", content: "", alertColor: "", billCreated: true });
    }, 2000);
  };


  render() {
    const { alertColor, content, categories } = this.state;
    return <div>{this.state.billCreated ? <Bills /> : this.selectLabels(alertColor, content,categories)}</div>
  }

  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Create Bills</strong>
      </CardHeader>
    ) 
  }
  
  selectLabels = (alertColor, content, categories) =>{
  return  this.loadCreatingBill(alertColor,this.state.labels,content,categories,colourStyles);
  }
  
  //this Method Call when Label Creation in porceess.
  loadCreatingBill = (alertColor,lables, content, categories, options) => {
    return (<div className="animated fadeIn" >
      <Card>
        {this.loadHeader()}
        <Col sm="12" md={{ size: 5, offset: 4 }}>
          <br />
          <Alert color={alertColor}>{content}</Alert>
          <h5><b>CREATE BILL {options.length}</b></h5>
          <AvForm onSubmit={this.handleSubmitValue}>
          <Row>
          <Col sm={1.6}>
            <AvField type="select" name="currency" errorMessage="Select Any One Category" required>
              <option value="EUR">€</option>
              <option value="USD">$</option>
              <option value="INR">₹</option>
            </AvField>
            </Col>
          <Col>
            <AvField name="amount" value={this.state.userAmount} placeholder="Amount" type="text" errorMessage="Invalid amount" validate={{ required: { value: true }, pattern: { value: '^[0-9]+$' } }} required />
          </Col>
          </Row>
          <Row>
          <Col> {this.categoryOptions(categories)}</Col>
           </Row><br/>  
            <Row>
            <Col><AvField name="billDate" label="Bill Date" value={this.state.userBillDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
            <Col><AvField name="dueDate" label="Due Date" value={this.state.userDueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'DD/MM/YYYY' }, required: { value: true } }} /></Col>
            </Row>
            <Row>
             <Col> <AvField name="notes" type="text" list="colors" errorMessage="Invalid Notes" placeholder="Enter Notes " required /></Col>
            </Row>
            <Row>
            <Col> {this.lablesOptions(lables)}</Col>
            </Row><br/>
            <FormGroup>
              <Button color="info"> Save Bill </Button> &nbsp;&nbsp;
              <a href='/listBills'><Button type="button">Cancel</Button></a>
            </FormGroup>
          </AvForm>
        </Col>
      </Card>
    </div>);
  }

  categoryOptions = (categories) =>{
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
   return <Select options={options} styles={colourStyles}  placeholder="Select Categories " onChange={this.categorySelected} required/> ;
 }
  
  lablesOptions = (labels) =>{
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
    return <Select isMulti options={options} styles={colourStyles} placeholder="Select Lables " onChange={this.labelSelected}/> ;
  }




}
export default CreateBill;
