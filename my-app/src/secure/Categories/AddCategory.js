import React, { Component } from "react";
import { Label, Button, Input, Card, CardHeader, FormGroup, Collapse,Col, Alert } from "reactstrap";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
import "default-passive-events";
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
      code:'',
      alertColor:'',
      content: '',
      collapse:false,
      categoryCreated: false,
    }
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAppUserAccessToken() });
  }

  handleSubmit = e => {
    e.preventDefault();
    const data = { name: this.state.name, color: this.state.color,code: this.state.code, parentId: this.state.parentId };
    new CategoryApi().createCategory(this.successCall, this.errorCall, this.state.profileId, data);
  };

  successCall = () =>{
    this.callAlertTimer('success','Category Added !')
  }

  errorCall = err => {
    this.callAlertTimer('danger','Category Not Added')
  };

  toggle =() =>{
    this.setState({ collapse: !this.state.collapse  });
  }

  callAlertTimer = (alertColor,content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ categoryCreated: true});
    }, 2000);
  };
 
  render() {
    return(
    <div>{this.state.categoryCreated ? <Categories/> :this.loadAddingCategory()}</div>
    )
  }

  loadAddingCategory=()=>{
    const {name,color,alertColor,content}=this.state
    return(
          <Card >
            <CardHeader><strong>Category</strong></CardHeader><br/>
             <center>
                <FormGroup >
                  <Col sm="12" md={{ size: 3, offset: 1.5 }}>
                    <Alert color={alertColor} >{content}</Alert>
                    <h5><b>CREATE CATEGORY</b></h5><br/>
                    <Input name="name" type="text" placeholder="Category Name" value={name} onChange={e => this.handleInput(e)}  /><br/>
                    <Input name="color" type="color" list="colors" value={color} onChange={e => { this.handleInput(e) }}/><br/>
                    <Input name="check" type="checkbox" onClick={this.toggle}/><Label for="mark">Nest Category Under</Label><br/>
                    <Collapse isOpen={this.state.collapse}>
                      <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e)}}>
                        {this.state.categories.map((category,key) => { return <option key={key} value={category.id}>{category.name}</option> })}
                      </Input>
                    </Collapse>
                  </Col>
                </FormGroup>
              <center>
                <Button color="info" disabled={!this.state.name} onClick={this.handleSubmit}> Add </Button>&nbsp;&nbsp;&nbsp;
                <a href="/listCategories" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a><br/><br/>
              </center>
            </center>
          </Card>)
  }
}

export default AddCategory;
