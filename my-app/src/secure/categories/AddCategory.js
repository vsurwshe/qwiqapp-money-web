import React, { Component } from "react";
import { Label, Button, Input, Card, CardHeader, FormGroup, Collapse, Col, Alert } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
import Config from "../../data/Config";
import '../../css/style.css'


class AddCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profileId: props.id,
      categories: props.category,
      parentId: 0,
      name: '',
      userToken: '',
      color: '',
      code: '',
      alertColor: '',
      content: '',
      collapse: false,
      categoryCreated: false,
      doubleClick: false,
    }
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAppUserAccessToken() });
  }

  handleSubmitValue = (event, values) => {
    this.handlePostData(event, values);
  }

  handlePostData = async (e, data) => {
    this.setState({ doubleClick: true });
    await this.generateCode()
    const newData = { ...data, parentId: this.state.parentId, code: this.state.code };
    new CategoryApi().createCategory(this.successCall, this.errorCall, this.state.profileId, newData);
  };

  cancelAddCategory = () => {
    this.setState({ cancelAddCategory: true });
  }

  successCall = () => {
    this.callAlertTimer('success', 'Category Added !')
  }

  errorCall = err => {
    this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again')
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ categoryCreated: true });
    }, Config.notificationMillis);
  };

  generateCode = () => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys0123456789"
    var length = characters.length
    var i = 0;
    var code = '#';
    for (i; i < 3; i++) {
      code = code + characters.charAt(Math.floor(Math.random() * length));
    }
    this.setState({ code })
  }

  render() {
    const { cancelAddCategory, categoryCreated } = this.state;
    if (cancelAddCategory) {
      return <Categories />
    } else {
      return <div>{categoryCreated ? <Categories /> : this.loadAddingCategory()}</div>
    }
  }

  loadAddingCategory = () => {
    const { alertColor, content, doubleClick, collapse, categories } = this.state
    return (
      <Card className="card-width">
        <CardHeader><strong>Category</strong></CardHeader><br />
        <Col sm="12" md={{ size: 5, offset: 4 }}>
          <Alert color={alertColor} >{content}</Alert>
          <h5><b>CREATE CATEGORY</b></h5><br />
          <AvForm onValidSubmit={this.handleSubmitValue}>
            <AvField name="name" type="text" errorMessage="Category Name Required" placeholder="Enter Category name" required />
            <AvField name="color" type="color" list="colors" placeholder="Enter Category Color" />
            <FormGroup check className="checkbox">
              <Input className="form-check-input" type="checkbox" onClick={this.toggle} value=" " />
              <Label check className="form-check-label" htmlFor="checkbox1"> &nbsp;Nest Category under </Label>
            </FormGroup><br />
            <Collapse isOpen={collapse}>
              <AvField type="select" name="parentId" onChange={e => { this.handleInput(e) }} required={this.state.collapse}>
                <option value="">Select Category</option>
                {categories.map((category, key) => { return <option key={key} value={category.id}>{category.name}</option> })}
              </AvField>
            </Collapse><br />
            <FormGroup>
              <Button color="info" disabled={doubleClick} > Save </Button> &nbsp;&nbsp;
               <Button active color="light" type="button" aria-pressed="true" onClick={this.cancelAddCategory} >Cancel</Button>
            </FormGroup>
          </AvForm>
        </Col>
      </Card>)
  }
}

export default AddCategory;