import React, { Component } from "react";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
<<<<<<< HEAD
import { Card, CardBody } from "reactstrap";
import Loader from 'react-loader-spinner';

=======
// import "default-passive-events";
>>>>>>> 0.4: Labels color applied on selected label, sublabel showing, searchable dropdown added
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

  successCall = () => {
    this.callAlertTimer("info","Deleted Successfully !")
  };

  errorCall = () => {
    this.callAlertTimer('danger','Unable to Process Request, Please Try Again')
  };

  callAlertTimer = (color,content) => {
    this.setState({ color,content });
    setTimeout(() => {
      this.setState({ categoryDeleted: true});
    }, 100);
  };

  render() {
    const { categoryDeleted, color,content } = this.state;
    return  categoryDeleted ? <Categories color={color} content={content} visible={true}/> : this.loadLoader()
  }
  loadLoader = () =>{
    return( 
      <div className="animated fadeIn">
        <Card>
          <center style={{paddingTop:'20px'}}>
            <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60}/></CardBody>
          </center>
        </Card>
      </div>)
    }
}

export default DeleteCategory;
