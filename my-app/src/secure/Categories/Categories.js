import React, { Component } from "react";

import { Card,CardHeader,  Button, Col, Row, Collapse, Input, Alert, InputGroupAddon,InputGroup,InputGroupText } from 'reactstrap';
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt, FaAngleDown, FaSearch } from 'react-icons/fa';
import CategoryApi from "../../services/CategoryApi";
import Store from "../../data/Store";
import { DeleteModel } from "../uitility/deleteModel";
import {ProfileEmpty} from '../uitility/ProfileEmpty';
import { ReUseComponents } from "../uitility/ReUseComponents";
import Config from "../../data/Config";

const AddCategory = React.lazy(() =>  import("./AddCategory"));
const EditCategory = React.lazy(() =>  import("./EditCategory"));
const DeleteCategory = React.lazy(() =>  import("./DeleteCategory"));
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
      hoverAccord : [],
      dropDownAccord : [],
      danger : false,
      onHover: false,
      visible: props.visible,
      spinner: false,
      search:''
    };
  }
  componentDidMount = () => {
    this.setProfileId()
  }

  setProfileId = async () =>{
    if (Store.getProfile() !== null && Store.getProfile().length !== 0) {
      var iterator = Store.getProfile().values()
      await this.setState({ profileId : iterator.next().value.id});
      this.getCategory();
    }
  }
  getCategory = ()=> {
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
    this.callAlertTimer('danger','Unable to Process Request, Please Try Again')
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
    if (this.state.visible) {
      setTimeout(() => {
        this.setState({ visible : false });
        window.location.reload()
      }, Config.notificationMillis);
    }
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
    const { categories,requiredCategory,createCategory,updateCategory,deleteCategory,profileId,categoryId, visible, spinner,search } = this.state;
    if (Store.getProfile() === null || Store.getProfile().length===0) {
      return (<ProfileEmpty />)
    } else if(categories.length === 0 && !spinner){
      return ReUseComponents.loadLoader("Categories : "+this.state.categories.length) 
    } else if(createCategory){
      return <AddCategory category = {categories} id= {profileId} />
    } else if(updateCategory){
      return <EditCategory categories = {categories} category = {requiredCategory} id = {profileId}/>
    } else if(deleteCategory){
      return <DeleteCategory cid = {categoryId} pid = {profileId} setCategories={this.setCategoriesAfterDelete} />
    } else{
      return<div>{this.loadCategories(categories, visible, search)}{this.loadDeleteCategory()}</div>
    }
  }

  loadCategories = (categories, visible, search) => {
    const color = this.props.color;
    if(color !== '' || color !== undefined){
      this.callAlertTimer()
    }
    return(
      <div className="animated fadeIn">
        <Card>
          <CardHeader style={{padding: "10px 10px 0px 10px"}} > 
          <Row form>
          <Col md={3} style={{marginTop:"10px"}}>
            <strong>CATEGORIES : {categories.length}</strong> 
            </Col>
            <Col md={7} className="shadow p-0 mb-3 bg-white rounded">
            <InputGroup>
            <Input type="search" className="float-right" style={{width:'20%'}} onChange={e => this.setState({ search : e.target.value })} placeholder="Search Categories..." />
            <InputGroupAddon addonType="append">
            <InputGroupText className="dark"><FaSearch /></InputGroupText>
          </InputGroupAddon>
          </InputGroup>
          </Col>
          <Col md={2}>
            <Button color="success" className="float-right" onClick={this.callAddCategory}> + ADD </Button>
            </Col>
            </Row>
          </CardHeader>
          <div style={{margin:10, paddingLeft:50}}>
            <Alert isOpen={visible} color={color===undefined ? '' : color}>{this.props.content}</Alert>
            {categories.filter(ReUseComponents.searchingFor(search)).map((category, key) => {return this.loadCategory(category,key);})} </div>
        </Card>
      </div>)
  }
  
  loadCategory = (category,uKey) => {
    const ellipsisText1 = { flex: 1, display: 'flex', alignItems: 'center', marginLeft: '-10' }
    const ellipsisText2 = {  flex: 1,  width: '100px',  textOverflow: 'ellipsis',  overflow: 'hidden',  whiteSpace:'nowrap',  paddingLeft:10 }
    const listSubCategory = { marginLeft:50, paddingTop:4, paddingBottom:0, paddingLeft:5, height:50 };
    return( 
      <div className="list-group" key={uKey}>
        <div className="list-group-item" style={{ paddingTop: 1, padding: 7 }}>
          <Row >
            <Col>
              <span style={ellipsisText1}>
              <Avatar name={category.name.charAt(0)} color={category.color === null || category.color === "" ? '#000000' : category.color} size="40" square={true} />
                <div style={ellipsisText2}>&nbsp;&nbsp;{category.name}
                  {Array.isArray(category.subCategories) ? <span><FaAngleDown style={{ marginLeft: 8 }} onClick={() => { this.toggleAccordion(uKey) }} /></span> : ''}</div></span></Col>
            <Col sm={1} md={1} lg={1} xl={1} >{this.showDropdown(category, uKey)}</Col>
          </Row></div>
        <div style={{ marginBottom: 1.5 }} />
        <Collapse isOpen={this.state.accordion[uKey]}> {category.subCategories != null ? category.subCategories.map((subCategory, key) => {
          return (
            <span className="list-group-item" style={listSubCategory} key={key}>
              <Row>
                <Col><span style={ellipsisText1}>
                  <Avatar name={subCategory.name.charAt(0)} color={subCategory.color === null || subCategory.color === "" ? '#000000' : subCategory.color} size="40" square={true} />
                  <span style={ellipsisText2}>{subCategory.name}</span> </span>
                </Col>
                <Col> <FaTrashAlt className="float-right" color="red" style={{ marginTop: 20, marginLeft: 10,marginRight:20 }} onClick={() => { this.setState({ categoryId: subCategory.id }); this.toggleDanger() }} />
                  <FaPen size={12} className="float-right" color="blue" style={{ marginTop: 20 }} onClick={() => this.updateCategory(subCategory)} />
                </Col>
              </Row><br />
            </span>)
        }) : ''}
        </Collapse>
        <div style={{ marginTop: 1 }} />
      </div>)
  }
  
  loadDeleteCategory = () => {
    return(
      <DeleteModel danger={this.state.danger} headerMessage="Delete Category" bodyMessage="Are You Sure Want to Delete Category?" 
      toggleDanger={this.toggleDanger} delete={this.deleteCategory} cancel={this.toggleDanger} />);
  }

  showDropdown = (category, uKey) =>{
    return ReUseComponents.loadDropDown(category, uKey, this.state.dropDownAccord[uKey], this.dropDownAccordion, this.updateCategory, this.setCategoryID, this.toggleDanger  )
  }
  setCategoryID = category =>{
    this.setState({ categoryId: category.id  });
  }
}

export default Categories;