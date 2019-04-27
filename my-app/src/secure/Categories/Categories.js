import React, { Component } from "react";
import { Card,CardHeader,  Button, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, 
  ListGroup, ListGroupItem, Alert, Dropdown, DropdownItem, DropdownToggle, DropdownMenu,CardBody } from 'reactstrap';
import Loader from 'react-loader-spinner';
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt, FaAngleDown, FaEllipsisV } from 'react-icons/fa';
import CategoryApi from "../../services/CategoryApi";
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import DeleteCategory from './DeleteCategory';
import "default-passive-events";
import Store from "../../data/Store";

const AddCategory = React.lazy(() =>  import("./AddCategory"));
const EditCategory = React.lazy(() =>  import("./EditCategory"));
const DeleteCategory = React.lazy(() =>  import("./DeleteCategory"));
class Categories extends Component {

  isUnmount= false;
  // supportPassive = false;
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
      hoverAccord : [],
      dropDownAccord : [],
      danger : false,
      alertColor : this.props.color,
      content : this.props.content,
      onHover: false,
      spinner: false,
        };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.setProfielId();
  }
  //Method to set Profile Id 
  setProfielId = async (id) => {
    await this.setState({ profileId: Store.getProfileId() });
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.profileId);
  }

  //This Method is called for Api's Success Call
  successCall = json => { 
    this.setState({ categories : json })
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
      if(this.isUnmount){
      this.setState({ alertColor : '', content : '' });}
    }, 2000);
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
    const { categories,requiredCategory,createCategory,updateCategory,deleteCategory,profileId,categoryId,alertColor,content } = this.state;
    if(createCategory){
      return <AddCategory category = {categories} id= {profileId} />
    }else if(updateCategory){
      return <EditCategory categories = {categories} category = {requiredCategory} id = {profileId}/>
    }else if(deleteCategory){
      return <DeleteCategory cid = {categoryId} pid = {profileId} />
    }else{
      return<div>{this.loadCategories(categories,alertColor,content)}{this.loadDeleteCategory()}</div>
    }
  }

  loadCategories = (categories,alertColor,content) => {
    this.callAlertTimer(alertColor,content)
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader> 
            <strong>CATEGORIES : {categories.length}</strong> 
            <Button color="success" className="float-right" onClick={this.callAddCategory}> + ADD CATEGORY</Button>
          </CardHeader>
          <div style={{margin:10, paddingLeft:50}}>
            <Alert color={alertColor===undefined? '' : alertColor}>{content}</Alert>
            {categories.map((category, key) => {return this.loadCategory(categories[key],key);})} </div>
        </Card>
      </div>)
  }
  
  loadCategory = (category,uKey) => {
    const styles={ marginLeft: 20, marginTop: 10 }// marginTop: 39 
    const penColor = { color: 'blue' }
    const trashColor = { color: 'red' }
    const ellipsisText1 = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
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
    return( 
      <ListGroup flush className="animated fadeIn" key={uKey} onPointerEnter={(e)=>this.onHover(e, uKey)} onPointerLeave={(e)=>this.onHoverOff(e,uKey)}>
        <ListGroupItem action >
           <Row >
                <Avatar name={category.name.charAt(0)} color = {category.color===null || category.color === "" ?'#000000':category.color} size="40" square={true} />
                <div style={ellipsisText1}><div style={ellipsisText2}>&nbsp;&nbsp;{category.name}</div></div>
                {Array.isArray(category.subCategories)?<span style={{ paddingLeft: 10 }}><FaAngleDown style={{marginTop:12}} onClick={()=>{this.toggleAccordion(uKey)}}/></span>:''} {this.state.onHover && this.state.hoverAccord[uKey]?this.showDropdown(category,uKey,styles):''}
         </Row>
          <div style={{padding:5}} />
          <Collapse isOpen={this.state.accordion[uKey]}> {category.subCategories != null ? category.subCategories.map(subCategory=>{return (
            <ListGroupItem tag="a" key={subCategory.id} style={{paddingBottom:1, paddingLeft:60}} >
              <Row>
                <Col sm={{size: 9}}>
                    <Avatar name={subCategory.name.charAt(0)} color={subCategory.color===null || subCategory.color === ""?'#000000':subCategory.color} size="40" square={true}/>
                    <div style={ellipsisText2}>{subCategory.name}</div> 
                    <FaTrashAlt className="float-right" style={Object.assign({},trashColor, styles)} onClick={() => { this.setState({ categoryId: subCategory.id }); this.toggleDanger() }}/>
                  <FaPen size={12} className="float-right" style={Object.assign({},penColor, styles)} onClick={()=>this.updateCategory(subCategory)} />
                </Col> 
              </Row><br />
            </ListGroupItem>)}) : ''} 
          </Collapse> 
        </ListGroupItem>
      </ListGroup>
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
        <FaEllipsisV style={styles}/></DropdownToggle>
      <DropdownMenu style={{marginTop:9,marginLeft:10}}>
        <DropdownItem onClick={()=>this.updateCategory(category)}>Edit </DropdownItem>
        <DropdownItem onClick={()=>{ this.setState({ categoryId: category.id }); this.toggleDanger() }}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    )
  }
}

export default Categories;