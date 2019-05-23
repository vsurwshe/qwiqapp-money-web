import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
import { ReUseComponents } from "../uitility/ReUseComponents";
import Config from "../../data/Config";

class DeleteCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: props.pid,
      categoryId: props.cid,
      categoryDeleted: false,
      loader: true,
      color: '',
      content: ''
    };
  }

  componentDidMount = () => {
    new CategoryApi().deleteCategory(this.successCall, this.errorCall,this.state.profileId, this.state.categoryId );
  };

  successCall = async () => {
    await this.setState({categoryDeleted:true})
  };

  errorCall = () => {
    this.callAlertTimer('danger','Unable to Process Request, Please Try Again')
  };

  callAlertTimer = (color,content) => {
    this.setState({ color,content });
    setTimeout(() => {
      this.setState({ categoryDeleted: true});
    }, Config.notificationMillis);
  };

  render() {
    const { categoryDeleted, color, content } = this.state;
    return  categoryDeleted ? <Categories color={color} content={content} visible={true}/> 
                            : ReUseComponents.loadLoader("Delete Category")
  }
}

export default DeleteCategory;
