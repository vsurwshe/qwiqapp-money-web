import React, { Component } from "react";
import { Card, Col, CardBody } from "reactstrap";
import CategoryApi from "../../services/CategoryApi";
import Config from "../../data/Config";
import Categories from "./Categories";
import { CategoryLabelForm } from "../utility/FormsModel";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";
import "../../css/style.css";

class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      profileId: props.id,
      code: props.category ? props.category.code : "",
      collapse: props.category ? (props.category.parentId ? true : false) : false,
      index: props.index
    };
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value, chkMakeParent: true });
  };

  handleSubmitValue = (event, values) => {
    this.handlePostData(event, values);
  };

  handleDoubleClick = () => {this.setState({ doubleClick: !this.state.doubleClick });}
  handlePostData = async (e, data) => {
    const { profileId } = this.state
    const { category } = this.props
    this.handleDoubleClick();
    // This condition decides its category Creation or Updation
    if (this.props.category) {
      let newData = {
        ...data,
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
      await this.generateCode();
      let newData = {
        ...data,
        code: this.state.code
      };
      new CategoryApi().createCategory(this.successCall, this.errorCall, profileId, newData);
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
      this.callAlertTimer("success", "Category updated successfully !");
    } else {
      this.callAlertTimer("success", "Category added successfully!");
    }

  };

  errorCall = error => {
    if (error && error.response) {
      this.callAlertTimer("danger", "Unable to process request, please try again");
    } else {
      this.handleDoubleClick(); // enable button to submit the values  
      this.callAlertTimer("danger", "Please check your internet connection and re-try again.", true);
    }
  };

  callAlertTimer = (alertColor, content, noTimer) => {
    this.setState({ alertColor, content });
    if (!noTimer) { // Stopping to navigation(Categories list) if user gets network error
      setTimeout(() => {
        this.setState({ categoryAction: true });
      }, Config.notificationMillis);
    }
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  cancelCategory = () => {
    this.setState({ cancelCategory: true });
  };

  render() {
    const { cancelCategory, categoryAction, index } = this.state;
    if (cancelCategory) {
      return <Categories index={index} />;
    } else {
      return <div>{categoryAction ? <Categories index={index} /> : this.loadFrom()}</div>;
    }
  }

  loadFrom = () => {
    const { alertColor, content, categories, profileId, categoryId, collapse, doubleClick, chkMakeParent } = this.state;
    const { parentId, type, name, color } = this.props.category ? this.props.category : ''
    let filteredCategories = this.props.category && categories.filter(category => category.id !== this.props.category.id)
    const categoryFields = {
      items: this.props.category ? filteredCategories : categories,
      profileId: profileId,
      categoryId: categoryId,
      parentId: parentId,
      itemName: name,
      itemColor: color,
      collapse: collapse,
      doubleClick: doubleClick,
      chkMakeParent: chkMakeParent,
      type: type,
      componentType: "Category",
      updateItem: this.props.category
    };
    return this.loadFields(categoryFields, alertColor, content);
  };

  loadFields = (categoryFields, alertColor, content) => {
    return (
      <Card className="card-width">
        {ShowServiceComponent.loadHeaderAction("Category")}
        <CardBody>
          <center><h5> <b>{!this.props.category ? "New category details" : "Category details"}</b> </h5> </center>
          <Col sm={{offset: 1 }} md={{ offset: 1 }}>
            {alertColor && ShowServiceComponent.loadAlert(alertColor, content)} 
            <CategoryLabelForm
              data={categoryFields}
              handleSubmitValue={this.handleSubmitValue}
              handleInput={this.handleInput}
              toggle={this.toggle}
              cancelCategory={this.cancelCategory}
              buttonText={this.props.category ? "Edit" : "Save"} />
          </Col>
        </CardBody>
      </Card>
    );
  };
}
export default CategoryForm;
