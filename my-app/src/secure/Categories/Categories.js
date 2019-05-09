import React, { Component } from "react";
import { Card,CardHeader,  Button, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, 
         Alert, Dropdown, DropdownItem, DropdownToggle, DropdownMenu,CardBody } from 'reactstrap';
import Loader from 'react-loader-spinner';
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt, FaAngleDown, FaEllipsisV } from 'react-icons/fa';
import CategoryApi from "../../services/CategoryApi";
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import DeleteCategory from './DeleteCategory';
import Store from "../../data/Store";

const AddCategory = React.lazy(() =>  import("./AddCategory"));
const EditCategory = React.lazy(() =>  import("./EditCategory"));
const DeleteCategory = React.lazy(() =>  import("./DeleteCategory"));
class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories : [],
      profileId : Store.getProfile().id,
      categoryId : 0,
      requiredCategory : [],
      createCategory : false,
      updateCategory : false,
      deleteCategory : false,
      viewRequest : false,
      toggle : false,
      accordion : [],
      hoverAccord : [],
      dropDownAccord : [],
      danger : false,
      onHover: false,
      visible: props.visible,
      spinner: false,
    };
  }

  componentDidMount = () => {
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.profileId);
  }

  //This Method is called for Api's Success Call
  successCall = async json => { 
    await this.setState({ categories : json, spinner : true })
    this.loadCollapse();
  }

  loadCollapse = () => {
    this.state.categories.map(category=>{
      return this.setState(prevState=>({ 
        accordion : [...prevState.accordion,false],
        hoverAccord : [...prevState.hoverAccord,false],
        dropDownAccord : [...prevState.dropDownAccord,false]
      }))
    })
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

  callAlertTimer = () => {
    setTimeout(() => {
        this.setState({ visible : false });
    },1800);
  };

  //Method handle accoding tab variable
  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x,index)=> tab===index? !x : false );
    this.setState({ accordion : state });
  } 

  hoverAccordion = (hKey) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((x,index)=> hKey===index? !x : false );
    this.setState({ hoverAccord : state });
  }

  dropDownAccordion = (dKey) => {
    const prevStat = this.state.dropDownAccord;
    const state = prevStat.map((x,index)=> dKey===index? !x : false );
    this.setState({ dropDownAccord : state });
  }

  onHover = (e,hKey) =>{
    this.setState({ onHover : true });
    this.hoverAccordion(hKey)
  }

  onHoverOff = (e,hKey) =>{
    this.setState({ onHover : false });
    this.hoverAccordion(hKey)
  }
  
  render() {
    const { categories,requiredCategory,createCategory,updateCategory,deleteCategory,profileId,categoryId, visible, spinner } = this.state;
    if(categories.length === 0 && !spinner){
      return this.loadLoader()
    }else if(createCategory){
      return <AddCategory category = {categories} id= {profileId} />
    }else if(updateCategory){
      return <EditCategory categories = {categories} category = {requiredCategory} id = {profileId}/>
    }else if(deleteCategory){
      return <DeleteCategory cid = {categoryId} pid = {profileId} />
    }else{
      return<div>{this.loadCategories(categories, visible)}{this.loadDeleteCategory()}</div>
    }
  }

  loadCategories = (categories, visible) => {
    const color = this.props.color;
    if(color !== '' || color !== undefined){
      this.callAlertTimer()
    }
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader> 
            <strong>CATEGORIES : {categories.length}</strong> 
            <Button color="success" className="float-right" onClick={this.callAddCategory}> + ADD CATEGORY</Button>
          </CardHeader>
          <div style={{margin:10, paddingLeft:50}}>
            <Alert isOpen={visible} color={color===undefined ? '' : color}>{this.props.content}</Alert>
            {categories.map((category, key) => {return this.loadCategory(categories[key],key);})} </div>
        </Card>
      </div>)
  }
  
  loadCategory = (category,uKey) => {
    const styles={ marginLeft: 20, marginTop: 10 }// marginTop: 39 
    const ellipsisText1 = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-10'
    }
    const ellipsisText2 = {
      flex: 1,
      width: '100px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace:'nowrap',
      paddingLeft:10
    }
    const listSubCategory = {marginLeft:50, paddingTop:1, paddingBottom:0, paddingLeft:5, height:50};
    return( 
      <div className="list-group" key={uKey}>
        <div className="list-group-item" style= {{ paddingTop:1,padding:7}}>
           <Row >
           <Col>
            <span style={ellipsisText1}>
                <Avatar name={category.name.charAt(0)} color = {category.color===null || category.color === "" ?'#000000':category.color} size="40" square={true} />
                <div style={ellipsisText2}>&nbsp;&nbsp;{category.name}
                {Array.isArray(category.subCategories)?<span><FaAngleDown onClick={()=>{this.toggleAccordion(uKey)}}/></span>:''}</div></span></Col> 
                <Col sm={1} md={1} lg={1} xl={1} >{this.showDropdown(category,uKey,styles)}</Col>
         </Row></div>
          <div style={{marginBottom:1.5}}/>
          <Collapse isOpen={this.state.accordion[uKey]}> {category.subCategories != null ? category.subCategories.map((subCategory,key)=>{return (
            <span className="list-group-item" style={listSubCategory} key={key}>
              <Row>
              <Col><span style={ellipsisText1}>
                    <Avatar name={subCategory.name.charAt(0)} color={subCategory.color===null || subCategory.color === ""?'#000000':subCategory.color} size="40" square={true}/>
                    <span style={ellipsisText2}>{subCategory.name}</span> </span>
                   </Col> 
                    <Col>  <FaTrashAlt className="float-right" color="red" style={{marginTop:20, marginLeft:10}} onClick={() => { this.setState({ categoryId: subCategory.id }); this.toggleDanger() }}/>
                  <FaPen size={12} className="float-right" color="blue" style={{marginTop:20}} onClick={()=>this.updateCategory(subCategory)} />
                </Col> 
              </Row><br />
              </span>)}) : ''} 
          </Collapse> 
          <div style={{marginTop:1}}/>
          </div>
    )
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

  showDropdown = (category,uKey,styles) =>{
    return(
      <Dropdown isOpen={this.state.dropDownAccord[uKey]} style={{marginLeft: 7, float: "right" }} className= "float-right"  toggle={() => { this.dropDownAccordion(uKey); }} size="sm" >
       <DropdownToggle tag="span" onClick={() => { this.dropDownAccordion(uKey); }} data-toggle="dropdown" >
        <FaEllipsisV style={{ marginTop: 15}}/></DropdownToggle>
        <DropdownMenu style={{marginTop:9,marginLeft:10}}>
          <DropdownItem onClick={()=>this.updateCategory(category)}>Edit </DropdownItem>
          <DropdownItem onClick={()=>{ this.setState({ categoryId: category.id }); this.toggleDanger() }}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

export default Categories;