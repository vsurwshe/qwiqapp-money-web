import React, { Component } from "react";
import { Card,CardHeader,  Button, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Collapse,ListGroup,ListGroupItem,Alert,Dropdown,DropdownItem,DropdownToggle,DropdownMenu} from 'reactstrap';
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt, FaAngleDown, FaEllipsisV } from 'react-icons/fa';
import CategoryApi from "../../services/CategoryApi";
import ProfileApi from "../../services/ProfileApi";
import "default-passive-events";

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
      onHover:false,
      screenWidth:"",
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.isUnmount = true;
    new ProfileApi().getProfiles( this.successProfileId, this.errorCall );
    window.addEventListener("resize", this.resize.bind(this)); //, this.passiveError
      this.resize();
  }
  resize() {
    if(this.isUnmount){
    this.setState({ screenWidth: window.innerWidth });
    }
  }
    
  // To handle warnings
  componentWillUnmount = () => { this.isUnmount=false; }
   
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

  //Method showing Initialising Profiles values got from API
  successProfileId = json => {
    if(json === []){ this.setState({ profileId : '' }) }
    else{
      const iter=json.values();
      for(const value of iter){this.setProfielId(value.id)}
    }
  }

  //Method to set Profile Id 
  setProfielId = (id) => {
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
    return( 
      <ListGroup flush className="animated fadeIn" key={uKey} onPointerEnter={(e)=>this.onHover(e, uKey)} onPointerLeave={(e)=>this.onHoverOff(e,uKey)}>
        <ListGroupItem action >
           <Row >
            <Col sm={{size: 10}}> 
                <Avatar name={category.name.charAt(0)} color = {category.color===null || category.color === "" ?'#000000':category.color} size="40" square={true} />&nbsp;&nbsp; {this.displayNames(category.name)}
              </Col>
            <Col> {Array.isArray(category.subCategories)?<FaAngleDown style={{marginTop:16}} onClick={()=>{this.toggleAccordion(uKey)}}/>:''} {this.state.onHover && this.state.hoverAccord[uKey]?this.showDropdown(category,uKey,styles):''} </Col>
          </Row>
          <div style={{padding:5}} />
          <Collapse isOpen={this.state.accordion[uKey]}> {category.subCategories != null ? category.subCategories.map(subCategory=>{return (
            <ListGroupItem tag="a" key={subCategory.id} style={{paddingBottom:1, paddingLeft:60}} >
              <Row>
                <Col sm={{size: 9}}>
                    <Avatar name={subCategory.name.charAt(0)} color={subCategory.color===null || subCategory.color === ""?'#000000':subCategory.color} size="40" square={true}/>&nbsp;&nbsp; {this.displayNames(subCategory.name)} 
                </Col> 
                <Col>
                  <FaTrashAlt className="float-right" style={Object.assign({},trashColor, styles)} onClick={() => { this.setState({ categoryId: subCategory.id }); this.toggleDanger() }}/>
                  <FaPen size={16} className="float-right" style={Object.assign({},penColor, styles)} onClick={()=>this.updateCategory(subCategory)} />
                </Col>
              </Row><br />
            </ListGroupItem>)}) : ''} 
          </Collapse> 
        </ListGroupItem>
      </ListGroup>
    )
  }
  displayNames = (name) => {
    const {screenWidth} = this.state;
    return (<span >{screenWidth<=390 ? (name.length>15? name.slice(0, 15)+"..." : name) : (screenWidth <= 550 ? (name.length>30? name.slice(0, 30)+"..." : name) : (screenWidth <= 700 ? (name.length>50? name.slice(0, 50)+"..." : name) : (screenWidth <= 900 ? (name.length>70? name.slice(0, 80)+"..." : name) : (screenWidth <= 1100 ? (name.length>90? name.slice(0, 110)+"..." : name) : (name.length>=120? name.slice(0, 140)+"..." : name) ) ) ) ) }</span>)
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