import React, { Component } from "react";
import { Label, Button, Input, Card, CardHeader, FormGroup, Collapse, Col, Alert } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
class AddCategory extends Component {
  constructor(props){
    super(props)
    this.state={
      profileId:props.id,
      categories : props.category,
      parentId: 0,
      name: '',
      userToken: '',
      color: '',
      code: '',
      alertColor: '',
      content: '',
      collapse: false,
      categoryCreated: false,
    }
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAppUserAccessToken() });
  }

  handleSubmitValue = (event, errors, values) => {
    if(errors.length ===0){}
    this.handlePostData(event,values);
   }

  handlePostData = async (e, data) => {
    await this.generateCode()
    const newData = { ...data, parentId: this.state.parentId,code:this.state.code };
    new CategoryApi().createCategory(this.successCall, this.errorCall, this.state.profileId, newData);
  };

  successCall = () =>{
    this.callAlertTimer('success','Category Added !')
  }

  errorCall = err => {
    this.callAlertTimer('danger','Unable to Process Request, Please Try Again')
  };

  toggle = () =>{
    this.setState({ collapse: !this.state.collapse  });
  }

  callAlertTimer = (alertColor,content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ categoryCreated: true});
    }, 2000);
  };

  generateCode = () =>{
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys0123456789"
    var length = characters.length
    var i=0;
    var code = '#';
    for (i;i<3;i++){
      code = code +  characters.charAt(Math.floor(Math.random() * length));
    }
    this.setState({code})
    console.log("Code = ",code)
  } 

  render() {
    return <div>{this.state.categoryCreated ? <Categories/> :this.loadAddingCategory()}</div>
  }

  loadAddingCategory = () =>{
    const {alertColor,content}=this.state
    return(
      <Card >
        <CardHeader><strong>Category</strong></CardHeader><br />
        <center>
          <Col sm="12" md={{ size: 3, offset: 1.5 }}>
            <Alert color={alertColor} >{content}</Alert>
            <h5><b>CREATE CATEGORY</b></h5><br />
            <AvForm onSubmit={this.handleSubmitValue}>
              <AvField name="name" type="text" errorMessage="Category Name Required" placeholder="Enter Category name" required />
              <AvField name="color" type="color" list="colors" placeholder="Enter Category Color" />
              <FormGroup check className="checkbox">
                <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
                <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest Category under </Label>
              </FormGroup><br />
              <Collapse isOpen={this.state.collapse}>
                <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e) }}>
                  {this.state.categories.map((category, key) => { return <option key={key} value={category.id}>{category.name}</option> })}
                </Input>
              </Collapse><br />
              <FormGroup>
                <Button color="info" > Save Category </Button> &nbsp;&nbsp;
                <a href="/listCategories" style={{ textDecoration: 'none' }}> <Button active color="light" type="button" aria-pressed="true">Cancel</Button></a>
              </FormGroup>
            </AvForm>
          </Col>
        </center>
      </Card>)
  }
}

export default AddCategory;
