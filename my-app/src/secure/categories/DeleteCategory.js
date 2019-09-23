import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
import Config from "../../data/Config";
import { ShowServiceComponet } from "../utility/ShowServiceComponet";

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

  errorCall = (error) => {
    if (error.response && error.response.status ===500 && error.response.data.error.debugMessage) {
      this.callAlertTimer('danger', error.response.data.error.debugMessage)
    } else {
      this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again')
    }
    
  };

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {
      this.setState({ categoryDeleted: true });
    }, Config.notificationMillis);
  };

  render() {
    const { categoryDeleted, color, content } = this.state;
    return categoryDeleted ? <Categories color={color} content={content} visible={true} />
      : ShowServiceComponet.loadDeleting("CATEGORIES", content, color)
  }
}

export default DeleteCategory;
