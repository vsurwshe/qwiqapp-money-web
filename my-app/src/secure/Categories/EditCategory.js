import React, { Component } from "react";
import { Button, Card, Col, Input, Alert, CardHeader, FormGroup, Label, Collapse} from "reactstrap";
import CategoryApi from "../../services/CategoryApi";

class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories:props.categories,
      profileId : props.id,
      categoryId : props.category.id,
      parentId:props.category.parentId,
      cName: props.category.name,
      color: props.category.color,
      code: props.category.code,
      version : props.category.version,
      content: "",
      updateSuccess: false,
      collapse:true
    };
  }

  handleUpdate = () => {
    const data = { name: this.state.cName, color: this.state.color, code: this.state.code, parentId:this.state.parentId, version: this.state.version };
    new CategoryApi().updateCategory(this.successCall, this.errorCall, data, this.state.profileId, this.state.categoryId );
  };

  successCall =() =>{
    this.setState({ updateSuccess: true })
  }

  errorCall = err => {
    this.callAlertTimer("Something went wrong, Please Try Again later... ");
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  callAlertTimer = ( content) => {
    this.setState({ content });
    setTimeout(() => {
      this.setState({ name: ''});
    }, 4000);
  };

  toggle =() =>{
    this.setState({ collapse: !this.state.collapse, parentId:null });
  }

  render() {
    const { cName, color, content, updateSuccess, parentId } = this.state;
    if (updateSuccess) {
      return <div>{this.loadUpdatedMessage()}</div>
    } else if(parentId === null){
      return <div>{this.loadCategoryToUpdate(cName,color,content)}</div>
    }else{
      return <div>{this.loadSubCategoryToUpdate(cName,color,content)}</div>
    }
  }

  loadUpdatedMessage=()=>{
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Category</strong></CardHeader>
          <center style={{paddingTop:'20px'}}>
            <h5><b>Your Category Updated Successfully !!</b><br /><br />
            <a href="/listCategories">View Categories</a></h5>
          </center>
        </Card>
      </div>)
  }

  //This method Updates parent Category
  loadCategoryToUpdate = (cName,color,content) => {
    return( 
      <Card>
        <CardHeader><strong>Category</strong></CardHeader>
        <center>
          <Alert color="">{content}</Alert>
          <h5><b>EDIT CATEGORY</b></h5><br/>
          <FormGroup>
            <Col sm="12" md={{ size: 5, offset: 1.5 }}>
              <Input type="text" name="cName" value={cName} style={{fontWeight:'bold',color:'#000000'}} autoFocus={true} onChange={e => { this.setState({ cName: e.target.value }) }}/>                 
              <br />
              <Input name="color" type="color" value={color} style={{}} onChange={e => { this.handleInput(e) }}/><br/>
              <Button color="success" disabled={!cName} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
              <a href="/listCategories" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a>
            </Col>
          </FormGroup>
        </center>
      </Card>)
  }

  //This method Updates SubCategory
  loadSubCategoryToUpdate = (cName,color,content) =>{
    return( 
      <Card>
        <CardHeader><strong>Category</strong></CardHeader>
        <center>
          <Alert color="">{content}</Alert>
          <h5><b>EDIT CATEGORY</b></h5><br/>
          <FormGroup>
            <Col sm="6">
              <Input type="text" name="cName" value={cName} style={{fontWeight:'bold',color:'#000000'}} autoFocus={true} onChange={e => { this.setState({ cName: e.target.value }) }}/>                 
              <br />
              <Input name="color" type="color" value={color} style={{}} onChange={e => { this.handleInput(e) }}/><br/>
              <Input name="check" type="checkbox" onClick={this.toggle}/><Label for="mark">Make it a Parent Category </Label> <br/>
              <Collapse isOpen={this.state.collapse}>
                    <FormGroup>
                      <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e)}}>
                        {this.state.categories.map((category) => { return <option value={category.id}>{category.name}</option> })}
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
