import React, { Component } from "react";
import { Button, Card, Col, Input, Alert, CardHeader, FormGroup, Label, Collapse} from "reactstrap";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";

class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      profileId : props.id,
      categoryId : props.category.id,
      parentId: props.category.parentId,
      cName: props.category.name,
      categoryColor: props.category.color=== null? '#000000': props.category.color,
      code: props.category.code,
      version : props.category.version,
      color:'',
      content: '',
      updateSuccess: false,
      collapse: true
    };
  }

  handleUpdate = () => {
    const data = { 
      name: this.state.cName,
      color: this.state.categoryColor,
      code: this.state.code, parentId:this.state.parentId, 
      version: this.state.version };
    new CategoryApi().updateCategory(this.successCall, this.errorCall, data, this.state.profileId, this.state.categoryId );
  };

  successCall = () =>{
    this.callAlertTimer('success','Category Updated!')
  }

  errorCall = err => {
    this.callAlertTimer('danger','Unable to Process Request, Please Try Again later... ');
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  callAlertTimer = (color,content) => {
    this.setState({ color,content });
    setTimeout(() => {
      this.setState({ updateSuccess: true});
    }, 2000);
  };

  toggle = () =>{
    this.setState({ collapse: !this.state.collapse, parentId:null });
  }

  render() {
    const { cName, categoryColor, color, content, updateSuccess, parentId } = this.state;
    return(
      <div>
        {updateSuccess?<Categories/>:parentId === null?<div>{this.loadCategoryToUpdate(cName,categoryColor,color,content)}</div>:<div>{this.loadSubCategoryToUpdate(cName,categoryColor,color,content)}</div>}
      </div>)
  }

  loadCategoryToUpdate = (cName, categoryColor, color, content) => {
    return( 
      <Card>
        <CardHeader><strong>Category</strong></CardHeader><br/>
        <center>
          <h5><b>EDIT CATEGORY</b></h5><br/>
          <FormGroup>
            <Col sm="12" md={{ size: 5, offset: 1.5 }}>
              <Alert color={color}>{content}</Alert>
              <Input type="text" name="cName" value={cName} style={{fontWeight:'bold',color:'#000000'}} autoFocus={true} onChange={e => { this.setState({ cName: e.target.value }) }}/>                 
              <br />
              <Input name="categoryColor" type="color" list="colors" value={`${categoryColor}`} onChange={e => { this.handleInput(e) }}/><br/>
              <Button color="success" disabled={!cName} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
              <a href="/listCategories" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a>
            </Col>
          </FormGroup>
        </center>
      </Card>)
  }

  //This method Updates SubCategory
  loadSubCategoryToUpdate = (cName,categoryColor,color,content) =>{
    return( 
      <Card>
        <CardHeader><strong>Category</strong></CardHeader><br/>
        <center>
          <h5><b>EDIT SUB-CATEGORY</b></h5><br/>
          <FormGroup>
            <Col sm="6">
              <Alert color={color}>{content}</Alert>
              <Input type="text" name="cName" value={cName} style={{fontWeight:'bold',color:'#000000'}} autoFocus={true} onChange={e => { this.setState({ cName: e.target.value }) }}/>                 
              <br />
              <Input name="categoryColor" type="color" list="colors" value={`${categoryColor}`} onChange={e => { this.handleInput(e) }}/><br/>
              <Input name="check" type="checkbox" onClick={this.toggle}/><Label for="mark">Make it a Parent Category </Label> <br/>
              <Collapse isOpen={this.state.collapse}>
                <FormGroup>
                  <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e)}}>
                    {this.state.categories.map(category => { return <option key={category.id} value={category.id}>{category.name}</option> })}
                  </Input>
                </FormGroup>
              </Collapse>
              <Button color="success" disabled={!cName} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
              <a href="/listCategories" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a>
            </Col>
          </FormGroup>
        </center>
      </Card>)
  }
}

export default EditCategory;
