import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Input, Alert, CardHeader, FormGroup, Label, Collapse } from 'reactstrap';
import CategoryApi from '../../services/CategoryApi';
import Categories from './Categories';
import Config from '../../data/Config';
import '../../components/css/style.css'


let values;
class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      profileId: props.id,
      categoryId: props.category.id,
      parentId: props.category.parentId,
      updateCategoryName: props.category.name,
      categoryColor: props.category.color === null ? '#000000' : props.category.color,
      code: props.category.code,
      version: props.category.version,
      color: '',
      content: '',
      updateSuccess: false,
      collapse: true,
      categoryNameValid:false,
      cancelUpdateCategory: false,
    };
  }

  handleUpdate = async () => {
    const {categoryId,profileId,version,code,categoryColor,updateCategoryName,parentId}=this.state;
    const data = {
      name:updateCategoryName,
      color: categoryColor,
      code: code,
      parentId: parentId === "" ? this.props.category.parentId : parentId,
      version: version
    };
    await new CategoryApi().updateCategory(this.successCall, this.errorCall, data, profileId, categoryId);
  };
  cancelUpdateCategory = () => {
    this.setState({ cancelUpdateCategory: true })
  }

  successCall = () => {
    setTimeout(() => {
      this.callAlertTimer('success', 'Category Updated!')
    }, Config.notificationMillis)

  }

  errorCall = err => {
    this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again later... ');
  };

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {
      this.setState({ updateSuccess: true });
    }, Config.notificationMillis);
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse, parentId: null });
  }
    render() {
    const { updateCategoryName, categoryColor, color, content, updateSuccess, cancelUpdateCategory,parentId,categories } = this.state;
    values = categories.filter(categories=>categories.id===parentId).map(item=>item.name)
    if (cancelUpdateCategory) {
      return <div><Categories /></div>
    } else {
      return (
        <div>
          {updateSuccess ? <Categories /> : this.props.category.parentId === null  ?
            <div>{this.loadCategoryToUpdate(updateCategoryName, categoryColor, color, content,values)}</div>
          : <div>{this.loadSubCategoryToUpdate(updateCategoryName, categoryColor, color, content,values)}</div>}
        </div>)
    }
  }

  loadCategoryToUpdate = (updateCategoryName, categoryColor, color, content,values ) => {
    return (
      <Card>
        <CardHeader><strong>Category</strong></CardHeader><br />
        <center>
          <h5><b>EDIT CATEGORY</b></h5><br />
          <FormGroup>
            <Col sm="12" md={{ size: 5, offset: 1.5 }}>
              <Alert color={color}>{content}</Alert>
              <Input className="update-category" type="text" name="updateCategoryName" value={updateCategoryName}  autoFocus={true} onChange={e => { this.setState({ updateCategoryName: e.target.value }) }} />
              <br />
              <Input name="categoryColor" type="color" list="colors" value={`${categoryColor}`} onChange={e => { this.handleInput(e) }} /><br />
              {this.props.category.subCategories === null ? <><Input name="check" type="checkbox" onClick={() => { this.toggle() }} /><Label for="mark">Nest Under Category</Label> <br /></> : ""}
              {this.loadCollapse(values)}
              <Button color="success" disabled={!updateCategoryName} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
               <Link className="link-text" to="/listCategories" >
                <Button active color="light" aria-pressed="true" onClick={this.cancelUpdateCategory}>Cancel</Button></Link>
            </Col>
          </FormGroup>
        </center>
      </Card>)
  }

  //This method Updates SubCategory
  loadSubCategoryToUpdate = (updateCategoryName, categoryColor, color, content,values) => {
    return (
      <Card>
        <CardHeader><strong>Category</strong></CardHeader><br />
        <center>
          <h5><b>EDIT SUB-CATEGORY</b></h5><br />
          <FormGroup>
            <Col sm="6">
              <Alert color={color}>{content}</Alert>
              <Input className="update-category" type="text" name="updateCategoryName" value={updateCategoryName}  autoFocus={true} onChange={e => { this.setState({ updateCategoryName: e.target.value }) }} />
              <br />
              <Input name="categoryColor" type="color" list="colors" value={`${categoryColor}`} onChange={e => { this.handleInput(e) }} /><br />
              <Input name="check" type="checkbox" onClick={() => { this.toggle() }} /><Label for="mark">Make it as Parent</Label> <br />
              <Collapse isOpen={this.state.collapse}>
                <FormGroup>
                  <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e) }}>
                    <option className="option-select" value="" >{values}</option>
                    {this.state.categories.filter(category=>category.id!==this.state.parentId).map(category => { return <option key={category.id} value={category.id}>{category.name}</option> })}
                  </Input>
                </FormGroup>
              </Collapse>
              <Button color="success" disabled={!updateCategoryName} onClick={this.handleUpdate} >Update  </Button>&nbsp;&nbsp;&nbsp;
              <Button active color="light" aria-pressed="true" onClick={this.cancelUpdateCategory}>Cancel</Button>
            </Col>
          </FormGroup>
        </center>
      </Card>)
  }

  loadCollapse = (values) => {
    return (
      <Collapse isOpen={!this.state.collapse}>
        <FormGroup>
          <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e) }}>
          {this.state.categoryNameValid?<option className="option-select" value="" >{values}</option>:<option value="" >Select Category</option>}
            {this.state.categories.map(category => { return <option key={category.id} value={category.id}>{category.name}</option> })}
          </Input>
        </FormGroup>
      </Collapse>
    );
  }
}

export default EditCategory;
