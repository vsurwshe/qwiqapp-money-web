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
      categoryId: props.category ? props.category.id : "",
      parentId: props.category ? props.category.parentId : "",
      updateCategoryName: props.category ? props.category.name : "",
      categoryColor: props.category ? (props.category.color === null ? "#000000" : props.category.color) : "#000000",
      code: props.category ? props.category.code : "",
      version: props.category ? props.category.version : "",
      alertColor: "",
      content: "",
      updateSuccess: false,
      collapse: false,
      categoryNameValid: false,
      cancelCategory: false,
      index: props.index,
      doubleClick: false,
      categoryCreated: false
    };
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmitValue = (event, values) => {
    this.handlePostData(event, values);
  };

  handlePostData = async (e, data) => {
    this.setState({ doubleClick: true });
    await this.generateCode();
    const newData = {
      ...data,
      parentId: this.state.parentId,
      code: this.state.code
    };
    new CategoryApi().createCategory( this.successCall, this.errorCall, this.state.profileId, newData );
  };

  generateCode = () => {
    let characters =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxys0123456789";
    var length = characters.length;
    var i = 0;
    var code = "#";
    for (i; i < 3; i++) {
      code = code + characters.charAt(Math.floor(Math.random() * length));
    }
    this.setState({ code });
  };

  successCall = () => {
    this.callAlertTimer("success", "Category Added !");
  };

  errorCall = err => {
    this.callAlertTimer( "danger", "Unable to Process Request, Please Try Again" );
  };

  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ categoryCreated: true });
    }, Config.notificationMillis);
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  cancelCategory = () => {
    this.setState({ cancelCategory: true });
  };

  render() {
    const { cancelCategory, categoryCreated } = this.state;
    if (cancelCategory) {
      return <Categories />;
    } else {
      return <div>{categoryCreated ? <Categories /> : this.loadFrom()}</div>;
    }
  }

  loadFrom = () => {
    const { alertColor, content, categories, profileId, categoryId, parentId, updateCategoryName, categoryColor, updateSuccess, collapse, doubleClick } = this.state;
    const categoryFields = {
      categories: categories,
      profileId: profileId,
      categoryId: categoryId,
      parentId: parentId,
      updateCategoryName: updateCategoryName,
      categoryColor: categoryColor,
      updateSuccess: updateSuccess,
      collapse: collapse,
      doubleClick: doubleClick
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
                <center><h5> <b>{!this.props.category && "CREATE CATEGORY"}</b> </h5> </center>
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
