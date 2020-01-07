import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
import Config from "../../data/Config";
import { ShowServiceComponent } from "../utility/ShowServiceComponent";

class DeleteCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.profileId,
      categoryId: props.categoryId,
      categoryDeleted: false,
      color: '"#00bfff"',
      content: 'Deleting category ...'
    };
  }

  componentDidMount = async () => {
    await new CategoryApi().deleteCategory(this.successCall, this.errorCall, this.state.profileId, this.state.categoryId);
  };

  successCall = () => {
    this.callAlertTimer('success', 'Category deleted Successfully !!');
  };

  errorCall = (error) => {
    const response = (error && error.response) ? error.response : '';
    if (response) {
      const {status, data} = response // directly assigning value, because we already checked that response is not a falsy(null, '', undefined, 0) value, then only come here.
      if (status === 500 && data && (data.error && data.error.debugMessage)) {
        this.callAlertTimer('danger', "This category is associated with bills.")
      } else {
        this.callAlertTimer('danger', 'Unable to process request, please try again')
      }
    } else {
      this.callAlertTimer('danger', 'Please check your internet connection and re-try again.')
    }
  };

  callAlertTimer = (color, content) => {
    setTimeout(() => {
      this.setState({ color, content, categoryDeleted: true });
    }, Config.notificationMillis);
  };

  render() {
    const { categoryDeleted, color, content } = this.state;
    return <div>{categoryDeleted ? <Categories color={color} content={content} visible={true} />
      : ShowServiceComponent.loadDeleting("CATEGORIES", content, color)}</div>
  }
}

export default DeleteCategory;
