import React, { Component } from "react";
import { Card, CardHeader, CardBody, Button, Col, Row, Container, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import CategoryApi from "../../services/CategoryApi";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";
import ProfileApi from "../../services/ProfileApi";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      profileId: 0,
      cId:0,
      requiredCategory:[],
      createCategory:false,
      updateCategory:false,
      deleteCategory:false,
      viewRequest: false,
      toggle :false,
      accordion:[],
      danger: false,
    };
  }
  componentDidMount() {
      new ProfileApi().getProfiles(this.successProfileId,this.errorCall)
  }
  
  //This Method is called for Api's Success Call
  successCall = json => {
      this.setState({ categories: json })
      this.loadCollapse();
  }

  loadCollapse=()=>{
      this.state.categories.map(category=>{return this.setState(prevState=>({accordion:[...prevState.accordion,false]}))})
  }  

  //Method showing Initialising Profiles values got from API
  successProfileId=json=>{
      if(json===[]){this.setState({profileId:''})}
      else{
        const iter=json.values();
        for(const value of iter){this.setProfielId(value.id)}
      }
  }

  //Method to set Profile Id 
  setProfielId=(id)=>{
    console.log(id);
    this.setState({profileId:id});
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.profileId );
  }

  //Method that shows API call gets Error
  errorCall = error => {
    console.log(error);
  }

  //Method calls the create category
  callAddCategory = () =>{
      this.setState({ createCategory:true  });
  }
  updateCategory = (category) =>{
    this.setState({ updateCategory:true,requiredCategory:category});
  }

  setDeleteCategoryId = (category) =>{
    this.setState({ requiredCategory : category, cId: this.state.requiredCategory.id })
  }
 
  deleteCategory = () => {
    this.setState({ deleteCategory: true })
  };

  toggleDanger = () => {
    this.setState({danger: !this.state.danger});
  }
  
  //Method handle accoding tab variable
  toggleAccordion=(tab)=>{
      console.log(tab);
      const prevState=this.state.accordion;
      const state =prevState.map((x,index)=>tab===index ?!x:false);
      this.setState({accordion:state});
  } 

  render() {
      const {categories,requiredCategory,createCategory,updateCategory,deleteCategory,profileId,cId} = this.state;
      if(createCategory){
          return <Container><AddCategory category = {categories} id={profileId}/></Container>
      }else if(updateCategory){
          return <Container><EditCategory category={requiredCategory} id={profileId}/></Container>
      }else if(deleteCategory){
        return <Container><DeleteCategory cid={cId} pid={profileId}/></Container>
      }else{
        return<div>{this.loadCategories()}{this.loadDeleteCategory()}</div>
      }
  }
  
  loadCategories=()=>{
    return(<div className="animated fadeIn">
        <Card>
          <CardHeader> <strong>Categories</strong> </CardHeader>
          <CardBody>
            {this.state.categories.map((categories, key ) => {return this.loadCategory(this.state.categories[key],key);})}
          </CardBody>
          <center>
            <Container> <Avatar className="float-right" name="+" color="blue" size="50" round={true} onClick={this.callAddCategory}  /></Container>
          </center>
        </Card>
      </div>);
  }
  
  loadCategory=(category,uKey)=>{
    return(<div>
      <Avatar name={category.name.charAt(0)} size="40" round={true} onClick={()=>{this.toggleAccordion(uKey)}} />&nbsp; {category.name}
      <FaTrashAlt onClick={() => { this.setState({ id: category.id }); this.toggleDanger() }} className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px"}} />
      <FaPen size={20} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={()=>this.updateCategory(category)} /><br />
          <Collapse isOpen={this.state.accordion[uKey]}>
              <Container style={{marginLeft:'30px'}}>
                 {category.subCategories != null ? category.subCategories.map(sub=>{return <p><b>{sub.name}</b></p>}):''}
              </Container>
          </Collapse>
      <hr />
  </div>)
  }

  loadDeleteCategory = () => {
    return (
    <Modal isOpen={this.state.danger} toggle={this.toggleDanger}
      className={'modal-danger '}>
      <ModalHeader toggle={this.toggleDanger}>Delete Category</ModalHeader>
      <ModalBody>
        Are you Sure you want to Delete This Category ?
        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.deleteCategory}>Delete</Button>
        <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
      </ModalFooter>
    </Modal>)
  }
}

export default Categories