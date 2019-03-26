import React, { Component } from "react";
import { Card, CardHeader,CardBody } from "reactstrap";
import CategoryApi from "../../services/CategoryApi";
class DeleteCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pId: this.props.pid,
      cId: this.props.cid,
      categoryDeleted: false,
      color: "",
      content: ""
    };
  }
  componentDidMount = () => {
    alert(this.state.pId)
    new CategoryApi().deleteCategory(this.successCall, this.errorCall,this.state.pId, this.state.cId );
  };
  successCall = () => {
    this.setState({ categoryDeleted: true, content: "Category Deleted Successfully !!" });
  };

  errorCall = () => {
    this.setState({ categoryDeleted: true });
    this.callAlertTimer("danger","Something went wrong, Please Try Again...  ");
  };

  callAlertTimer = (color, content) => {
    this.setState({
      color: color,
      content: content
    });
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
  //This Method called After Deleted Category
  loadDeleteMessage=(content)=>{
    return(
    <div className="animated fadeIn">
    <Card>
      <CardHeader>
        <strong>Category</strong>
      </CardHeader>
      <center style={{paddingTop:'20px'}}>
        <h5><b>{content}</b><br /> <br />
          <a href="/listCategories">View Categories </a></h5>
      </center>
    </Card>
  </div>)
  }

  //this Method Call Between Deleting Process.
  loadDeleting=()=>{
    return(
      <div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Category</strong>
        </CardHeader>
          <CardBody>  
          <h5><b>Deleting Category.....</b></h5>
          </CardBody>
        </Card>
        </div>
    )
  }
}

export default DeleteCategory;
