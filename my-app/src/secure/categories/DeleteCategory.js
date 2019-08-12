import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
import Config from "../../data/Config";
import { ReUseComponents } from "../utility/ReUseComponents";

class DeleteCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.pid,
      categoryId: props.cid,
      categoryDeleted: false,
      color: 'green',
      content: 'Deleting Category ...'
    };
  }

  componentDidMount = async () => {
    await new CategoryApi().deleteCategory(this.successCall, this.errorCall, this.state.profileId, this.state.categoryId);
  };

  successCall = () => {
    this.callAlertTimer('success', 'Category deleted Successfully !!');
  };

  errorCall = () => {
    this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again')
  };

  callAlertTimer = (color, content) => {
    setTimeout(() => {
      this.setState({ color, content, categoryDeleted: true });
      window.location.reload()
    }, Config.notificationMillis);
  };

  render() {
    const { categoryDeleted, color, content } = this.state;
    return categoryDeleted ? <Categories color={color} content={content} visible={true} />
      : ReUseComponents.loadDeleting("CATEGORIES",content,color)
  }
}

export default DeleteCategory;
