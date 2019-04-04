import React, { Component } from "react";
import { Card, CardHeader, CardBody, Button, Col, Row, Container, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt, FaAngleDown } from 'react-icons/fa';
import CategoryApi from "../../services/CategoryApi";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";
import ProfileApi from "../../services/ProfileApi";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories : [],
      profileId : 0,
      categoryId : 0,
      requiredCategory : [],
      createCategory : false,
      updateCategory : false,
      deleteCategory : false,
      viewRequest : false,
      toggle : false,
      accordion : [],
      danger : false,
      alertColor : this.props.color,
      content : this.props.content,
    };
  }

  componentDidMount() {
    new ProfileApi().getProfiles( this.successProfileId, this.errorCall )
  }
  
  //This Method is called for Api's Success Call
  successCall = json => {
    this.setState({ categories : json })
    this.loadCollapse();
  }

  loadCollapse = () => {
    this.state.categories.map(category=>{return this.setState(prevState=>({ accordion : [...prevState.accordion,false] }))})
  }  

  //Method showing Initialising Profiles values got from API
  successProfileId = json => {
    if(json === []){this.setState({ profileId : '' })}
    else{
      const iter=json.values();
      for(const value of iter){this.setProfielId(value.id)}
    }
  }

  //Method to set Profile Id 
  setProfielId = (id) => {
    console.log(id);
    this.setState({ profileId : id });
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.profileId );
  }

  //Method that shows API's Error Call
  errorCall = error => {
    console.log(error);
  }

  //Method calls the create category
  callAddCategory = () => {
    this.setState({ createCategory : true  });
  }

  updateCategory = (category) => {
    this.setState({ updateCategory : true, requiredCategory : category });
  }
 
  deleteCategory = () => {
    this.setState({ deleteCategory : true })
  };

  toggleDanger = () => {
    this.setState({ danger : !this.state.danger });
  }

  callAlertTimer = (color,content) => {
    setTimeout(() => {
      this.setState({ alertColor : '', content : '' });
    }, 2000);
  };


  // toggleShow = () =>{
  //   this.setState({ showSubCategories: !this.state.showSubCategories  });
  //   this.showCategories(!this.state.showSubCategories)
  // }
  
  // showCategories = (showSubCategories) =>{
  //   if(showSubCategories){
  //     new CategoryApi().getSubCategories(this.successCall,this.errorCall,this.state.profileId,showSubCategories)
  //   }else{
  //     new CategoryApi().getCategories(this.successCall,this.errorCall,this.state.profileId)
  //   }
  // }

  //Method handle accoding tab variable
  toggleAccordion = (tab) => {
    console.log(tab);
    const prevState = this.state.accordion;
    const state = prevState.map((x,index)=> tab===index? !x : false );
    this.setState({ accordion : state });
  } 

  render() {
    const { categories,requiredCategory,createCategory,updateCategory,deleteCategory,profileId,categoryId,alertColor,content } = this.state;
    if(createCategory){
      return <AddCategory category = {categories} id={profileId}/>
    }else if(updateCategory){
      return <Container><EditCategory categories = {categories} category = {requiredCategory} id = {profileId}/></Container>
    }else if(deleteCategory){
      return <Container><DeleteCategory cid = {categoryId} pid = {profileId} /></Container>
    }else{
      return<div>{this.loadCategories(alertColor,content)}{this.loadDeleteCategory()}</div>
    }
  }

  loadCategories = (alertColor,content) => {
    this.callAlertTimer(alertColor,content)
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader> <strong>CATEGORIES : {this.state.categories.length}</strong> </CardHeader>
          <CardBody>
            <Col sm="12" md={{ size : 5, offset : 3 }}>
              <Row>
                <Container>
                  <Alert color={alertColor===undefined? '' : alertColor}>{content}</Alert>
                  <Container><Avatar className="float-right" name="+" color="blue" size="50" round={true} onClick={this.callAddCategory} /></Container><br/><br/><br/>
                  {this.state.categories.map((category, key) => {return this.loadCategory(this.state.categories[key],key);})} 
                </Container>
              </Row>
            </Col>
          </CardBody>
        </Card>
      </div>)
  }
  
  loadCategory = (category,uKey) => {
    return( 
      <div className="animated fadeIn" key={uKey}>
        <Avatar name={category.name.charAt(0)} color = {category.color===null?'#000000':category.color} size="40" square={true} />&nbsp; {category.name}
        {Array.isArray(category.subCategories)?<FaAngleDown onClick={()=>{this.toggleAccordion(uKey)}}/>:''}
        <FaTrashAlt onClick={() => { this.setState({ categoryId: category.id }); this.toggleDanger() }} className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px"}} />
        <FaPen size={16} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={()=>this.updateCategory(category)} /><br />
        <Collapse isOpen={this.state.accordion[uKey]}>
          <Container style={{marginLeft:'35px'}}>
            <br/>{category.subCategories != null ? category.subCategories.map(subCategory=>{return <p key={subCategory.id} onClick={()=>this.updateCategory(subCategory)} >
               <Avatar name={subCategory.name.charAt(0)} color={subCategory.color===null?'#000000':subCategory.color} size="40" square={true}/><b>&nbsp;&nbsp;{subCategory.name}</b></p>})
                                            :<p style={{color : 'red'}}>No SubCategories for this Category</p>
            } 
          </Container>
        </Collapse> <hr />
      </div>)
  }

  loadDeleteCategory = () => {
    return(
      <Modal isOpen = {this.state.danger} toggle = {this.toggleDanger} className = {'modal-danger'}>
        <ModalHeader toggle={this.toggleDanger}>Delete Category</ModalHeader>
        <ModalBody>Are you Sure you want to Delete This Category ?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteCategory}>Delete</Button>
          <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
        </ModalFooter>
      </Modal>)
  }
}

export default Categories