import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
class DeleteCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: this.props.pid,
      categoryId: this.props.cid,
      categoryDeleted: false,
      color: '',
      content: ''
    };
  }

  componentDidMount = () => {
    new CategoryApi().deleteCategory(this.successCall, this.errorCall,this.state.profileId, this.state.categoryId );
  };

  successCall = () => {
    this.callAlertTimer("info","Deleted Successfully !")
  };

  errorCall = () => {
    this.callAlertTimer("warning","Delete Failed !")
  };

  callAlertTimer = (color,content) => {
    this.setState({ color,content });
    setTimeout(() => {
      this.setState({ categoryDeleted: true});
    }, 2000);
  };

  render() {
     const { categoryDeleted, color,content } = this.state;
     return  categoryDeleted?<Categories color={color} content={content}/>:<p> Deleting .......</p>
  }
}

export default DeleteCategory;
