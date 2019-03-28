import React, { Component } from "react";
import { Card, CardHeader,CardBody } from "reactstrap";
import CategoryApi from "../../services/CategoryApi";
class DeleteCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileId: this.props.pid,
      categoryId: this.props.cid,
      categoryDeleted: false,
      color: "",
      content: ""
    };
  }

  componentDidMount = () => {
    new CategoryApi().deleteCategory(this.successCall, this.errorCall,this.state.profileId, this.state.categoryId );
  };

  successCall = () => {
    this.setState({ categoryDeleted: true, content: "Category Deleted Successfully !!" });
  };

  errorCall = () => {
    this.setState({ categoryDeleted: true });
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({color: color,content: content});
    setTimeout(() => {
      this.setState({ color: "" });
    }, 5500);
  };

  render() {
    const { categoryDeleted, content } = this.state;
    if (categoryDeleted) {
      return <div>{this.loadDeleteMessage(content)}</div>
    } else {
      return <div>{this.loadDeleting()}</div>
    }
  }

  //This Method called After Deleting Category
  loadDeleteMessage=(content)=>{
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Category</strong></CardHeader>
          <center style={{paddingTop:'20px'}}>
            <h5><b>{content}</b><br /> <br />
            <a href="/listCategories">View Categories </a></h5>
          </center>
        </Card>
      </div>)
  }

  //This Method while Deletion is in process.
  loadDeleting=()=>{
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader><strong>Category</strong></CardHeader>
          <CardBody><h5><b>Deleting Category.....</b></h5></CardBody>
        </Card>
      </div>)
  }
}

export default DeleteCategory;
