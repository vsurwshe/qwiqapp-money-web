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

  //This Method called After Deleting Category
  // loadDeleteMessage=(content)=>{
  //   return(
  //     <div className="animated fadeIn">
  //       <Card>
  //         <CardHeader><strong>Category</strong></CardHeader>
  //         <center style={{paddingTop:'20px'}}>
  //           <h5><b>{content}</b><br /> <br />
  //           <a href="/listCategories">View Categories </a></h5>
  //         </center>
  //       </Card>
  //     </div>)
  // }

  // This Method while Deletion is in process.
  // loadDeleting=(color,content)=>{
  //   return(
  //     <div className="animated fadeIn">
  //      {/* <CardHeader><strong>Category</strong></CardHeader>
  //       <Card>
  //         <CardBody>
  //         <Alert color={color}>{content}</Alert>
  //         </CardBody>
  //       </Card> */}
  //     </div>)
  // }
}

export default DeleteCategory;
