import React, { Component } from "react";
import { Card, CardHeader, Col, Alert, CardBody } from "reactstrap";
import CategoryApi from "../../services/CategoryApi";
import Config from "../../data/Config";
import "../../css/style.css";
import Categories from "./Categories";
import { CategoryFormUI } from "../utility/FormsModel";

class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      profileId: props.id,
      categoryName: props.category ? props.category.name : "",
      categoryColor: props.category ? (props.category.color === null ? "#000000" : props.category.color) : "#000000",
      code: props.category ? props.category.code : "",
      alertColor: "",
      content: "",
      collapse: props.category ? (props.category.parentId ? true : false) : false,
      cancelCategory: false,
      doubleClick: false,
      categoryAction: false,
      chkMakeParent: false
    };
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value, chkMakeParent: true });
  };

  handleSubmitValue = (event, values) => {
    this.handlePostData(event, values);
  };

  handlePostData = async (e, data) => {
    const { profileId } = this.state
    const { category } = this.props
    this.setState({ doubleClick: true });
    await this.generateCode();
    let commnData = {
      ...data,
      code: this.state.code
    };
    // This condition decides its category Creation or Updation
    if (this.props.category) {
      let newData = {
        ...commnData,
        version: category.version
      }
      // This condition checks if subCategory is made as Parent Category
      if (data.makeParent) {
        newData = {
          ...newData,
          parentId: null
        }
      }
      new CategoryApi().updateCategory(this.successCall, this.errorCall, newData, profileId, category.id);
    } else {
      new CategoryApi().createCategory(this.successCall, this.errorCall, profileId, commnData);
    }

  };

  generateCode = () => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys0123456789";
    var length = characters.length;
    var i = 0;
    var code = "#";
    for (i; i < 3; i++) {
      code = code + characters.charAt(Math.floor(Math.random() * length));
    }
    this.setState({ code });
  };

  successCall = () => {
    if (this.props.category) {
      this.callAlertTimer("success", "Category Updated Successfully !");
    } else {
      this.callAlertTimer("success", "Category Added Successfully!");
    }

  };

  errorCall = err => {
    this.callAlertTimer("danger", "Unable to Process Request, Please Try Again");
  };

  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ categoryAction: true });
    }, Config.notificationMillis);
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  cancelCategory = () => {
    this.setState({ cancelCategory: true });
  };

  render() {
    const { cancelCategory, categoryAction } = this.state;
    if (cancelCategory) {
      return <Categories />;
    } else {
      return <div>{categoryAction ? <Categories /> : this.loadFrom()}</div>;
    }
  }

  loadFrom = () => {
    const { alertColor, content, categories, profileId, categoryId, categoryName, categoryColor, collapse, doubleClick, chkMakeParent } = this.state;
    const { parentId } = this.props.category ? this.props.category : ''
    let filteredCategories = this.props.category && categories.filter(category => category.id !== this.props.category.id)
    const categoryFields = {
      categories: this.props.category ? filteredCategories : categories,
      profileId: profileId,
      categoryId: categoryId,
      parentId: parentId,
      categoryName: categoryName,
      categoryColor: categoryColor,
      collapse: collapse,
      doubleClick: doubleClick,
      chkMakeParent: chkMakeParent
    };
    return this.loadFileds(categoryFields, alertColor, content);
  };

  loadFileds = (categoryFields, alertColor, content) => {
    return (
      <Card className="card-width">
        <CardHeader>
          <strong>Category</strong>
        </CardHeader>
        <CardBody>
          <Col sm="1" md={{ size: 8, offset: 1 }}>
            <center><h5> <b>{!this.props.category ? "NEW CATEGORY" : "EDIT CATEGORY"}</b> </h5> </center>
            <Alert color={alertColor}>{content}</Alert>
            <CategoryFormUI
              data={categoryFields}
              handleSubmitValue={this.handleSubmitValue}
              handleInput={this.handleInput}
              toggle={this.toggle}
              cancelCategory={this.cancelCategory}
              buttonText={this.props.category ? "Edit Category" : "Save Category"}
            />
          </Col>
        </CardBody>
      </Card>
    );
  };
}
export default CategoryForm;
