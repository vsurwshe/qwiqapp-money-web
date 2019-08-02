import React, { Component } from "react";
import { Button,Row, Col, Card, CardHeader, CardBody, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, Input,
         DropdownMenu, DropdownItem, ListGroupItem, ListGroup, InputGroup, InputGroupAddon, InputGroupText  } from "reactstrap";
import { FaEllipsisV, FaSearch } from 'react-icons/fa';
import Loader from 'react-loader-spinner'
import UpdateBill from "./UpdateBill";
import CreateBill from "./CreateBill";
import BillApi from "../../services/BillApi";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import LabelApi from "../../services/LabelApi";
import DeleteBill from "./DeleteBill";
import ContactApi from '../../services/ContactApi';
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";

class Bills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: [],
      labels: [],
      categories: [],
      collapse: [],
      contacts:[],
      rebill: [],
      createBill: false,
      updateBill: false,
      deleteBill: false,
      visible: false,
      dropdownOpen: [],
      hoverAccord : [],
      accordion: [],
      profileId: "",
      danger: false,
      onHover: false,
      spinner: false,
      selectedOption: '',
      searchName:false,
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile() !== null && Store.getProfile().length !== 0) {
      await this.setState({ profileId:Store.getProfile().id });
      this.getCategory();
    }
  }

  getCategory = () => {
   new CategoryApi().getCategories(this.successCallCategory, this.errorCall, this.state.profileId); 
  }
  
   //this method seting Categories when api given successfull Response
   successCallCategory = async categories => {
    if (categories === []) {
      this.setState({ categories : [0] })
    } else {
      await this.setState({ categories : categories})
      await new BillApi().getBills(this.successCallBill, this.errorCall,this.state.profileId);  
    }
  };

  //this method sets bills when api given successfull Response
  successCallBill = async bill => {
    if (bill === []) {
      this.setState({ bills: [0] })
    } else {
      await this.bills(bill);
      this.loadCollapse();
    }
  };
  
  callCreateBill = () => {this.setState({ createBill : true })}

  loadCollapse = async () =>{
    await this.state.bills.map(labels => {return this.setState(prevState => ({
      accordion : [...prevState.accordion, false],
      hoverAccord : [...prevState.hoverAccord,false],
      dropdownOpen : [...prevState.dropdownOpen, false]
    }))});
    new LabelApi().getSublabels(this.successCallLabel, this.errorCall, this.state.profileId);
  }

  //this method seting label when api given successfull Response
  successCallLabel = async label => {
    this.setState({spinner: true})
     if (label === []) {
      this.setState({ labels : [0] })
    } else {
      await this.setState({ labels : label});
      new ContactApi().getContacts(this.successCallContact, this.errorCall, this.state.profileId);
    }
  };
  successCallContact = async contacts => {
    this.setState({spinner: true})
     if (contacts === []) {
      this.setState({ contacts : [0] })
    } else {
      await this.setState({contacts});
      
    }
  };


  bills = (bills) =>{
    const prevState = bills;
    const state = prevState.map((x, index) => {
        return {...x, categoryName: this.displayCategoryName(x.categoryId)}
    });
    this.setState({bills : state});
  }

  errorCall = err => { this.setState({ visible : true }) }

  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({danger : !this.state.danger});
  }

  //this method for the load Update Compoents
  updateBill = rebill => {
   this.setState({ updateBill : true, rebill })
  };

  //this method for the load delete Components
  deleteBill = () => {
   this.setState({ deleteBill : true })
  };

  //this method toggel Bills tab
  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({accordion : state});
  }

  toggleDropDown = (tab) => {
    const prevState = this.state.dropdownOpen;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({dropdownOpen : state});
  }
  
  hoverAccordion = (hKey) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((x,index)=> hKey===index? !x : false );
    this.setState({ hoverAccord : state });
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
    const { bills, createBill, updateBill, id, deleteBill, visible, profileId, rebill, spinner, labels, categories,contacts} = this.state;
    if (profileId===null || profileId=== undefined || profileId==="") {
      return <ProfileEmptyMessage/>
    } else if (bills.length === 0 && !createBill ) {
      return <div>{!spinner ? this.loadLoader() : bills.length === 0 && !createBill ? this.loadNotBill() : ""}</div>
    } else if (createBill) {
      return ( <CreateBill pid={profileId} label={labels} categories={categories} contacts={contacts} />)
    }else if (updateBill) {
     return(<UpdateBill pid={profileId} bill={rebill} lables={labels} categories={categories} contacts={contacts} />)
    }else if(deleteBill) {
      return ( <DeleteBill id={id}  pid={profileId}/> )
    }else{
      return <div>{this.loadShowBill(visible, bills)}{this.loadDeleteBill()}</div>
    }
  }

  searchSelected = (e) =>{
    this.setState({ selectedOption : e.target.value });
    if(this.state.selectedOption!==null){
      this.setState({searchName:true});
    }
  }
  
  searchingFor = (term) =>{
    return function(x){
        //return (x.description.toLowerCase()+x.amount+x.categoryName.name.toLowerCase()).includes(term.toLowerCase())
        return ((x.description.toLowerCase()+x.amount+x.categoryName.name.toLowerCase()).includes(term.toLowerCase()))|| !term
    }
  }

  loadHeader = () => {
    return (
      <div style={{ paddingTop: 20, paddingRight: 10 }}  >
        <CardHeader>
        <Row>
          <Col sm={3} ><strong style={{fontSize:20, marginLeft:20 }} >BILLS</strong></Col>
          <Col>
         {this.state.bills.length!==0 &&         
            <InputGroup>
              <Input  placeholder="Search Bills....." onChange={this.searchSelected} />
              <InputGroupAddon addonType="append"> <InputGroupText><FaSearch /></InputGroupText></InputGroupAddon>
            </InputGroup>       
         }
         </Col>
          <Col sm={3}> <Button color="success" className="float-right" onClick={this.callCreateBill} > + Add </Button></Col>
        </Row>  
        </CardHeader>
      </div>
    )
  }
  
  //this method loads the spinner
  loadLoader = () =>{
    return( 
      <div className="animated fadeIn">
        <Card>
         {this.loadHeader()}
          <center style={{paddingTop:'20px'}}>
            <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60}/></CardBody>
          </center>
        </Card>
      </div>)
  }

  //This method is called when there are no Bills.
  loadNotBill = () => {
    return (
      <div className="animated fadeIn">
        <Card>
         {this.loadHeader()}
          <center style={{paddingTop:'20px'}}>
            <CardBody><h5><b>You haven't created any Bills yet... </b></h5><br/></CardBody>
          </center>
        </Card>
    </div>)
  }

  //This method Displays all the Bills one by one
  loadShowBill = (visible, bills) => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <div style={{margin:30, paddingLeft:50}}>
            <h6><Alert isOpen={visible} color="danger">Unable to Process Request, Please try Again....</Alert></h6>
            {/* {bills.filter(this.searchingFor(this.state.selectedOption)).map((bill, key) => {return this.loadSingleBill(bill, key); })}</div> */}
             { this.state.searchName?bills.filter(this.searchingFor(this.state.selectedOption)).map((bill, key) => {return this.loadSingleBill(bill, key); }) 
               : bills.map((bill, key) => {return this.loadSingleBill(bill, key); })
              }
              </div>
        </Card>
      </div>)
  }

  //Show the Single Bill 
  loadSingleBill = (bill, ukey) =>{
    const styles = { margin : 6 }
    return (
      <ListGroup flush key={ukey} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, ukey)} onPointerLeave={(e) => this.onHoverOff(e, ukey)}>
        <ListGroupItem action>
          <Row>
            <Col sm={{ size: 'auto', offset: 0 }} lg={1} style={{ backgroundColor: "#054FF8", color: "#FFFFFF", paddingTop: 10 }}>
              <strong style={{ paddingTop: 5 }}><center>{this.dateFormat(bill.billDate)}</center></strong>
            </Col>
            <Col sm={8}>
              <Row style={{ paddingLeft: 10 }}>{bill.description}</Row>
              <Row style={{ paddingLeft: 10, fontStyle: "oblique", color: bill.categoryName.color}}>{bill.categoryName.name}</Row>
            </Col>
            <Col style={{ marginTop: 10 }} className="float-right">
              <b style={{ color: "#F80505" }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: bill.currency}).format( bill.amount)}
              </b>
            </Col>
            <Col>{this.state.onHover && this.state.hoverAccord[ukey] ? this.loadDropDown(bill, ukey, styles) : ''}</Col>
          </Row>
        </ListGroupItem>
      </ListGroup>)
  }
 
  dateFormat = (userDate) =>{
    let sd=userDate.toString().split('');
    let year= sd[0]+sd[1]+sd[2]+sd[3];
    let month =sd[4]+sd[5];
    let day = sd[6]+sd[7];
    var date = new Date(year, month, day);
    const finalDate = new Intl.DateTimeFormat('en-gb', {  month: 'short',  weekday: 'short',  day: '2-digit' }).format(date);
    return finalDate;
  }

  searchingCat = (term) =>{
    return function(x){
      return x.name.includes(term)|| !term
    }
  }

  displayCategoryName = (cid) => {
    const {categories}=this.state;
    var data = categories.filter(item => { return item.id === cid });
    if (data.length === 0) {
     categories.map(category => {
        if (Array.isArray(category.subCategories)) {
          category.subCategories.forEach(element => {
            if (element.id === cid) {
              data = {name : element.name, color: element.color === "" || element.color === null ?'#000000':element.color};
              return data;
            }});}
        return 0
      })
      return data;
    } else {
      for (const value of data)
        return {name:value.name,color:value.color===''|| value.color===null?'#000000':value.color};
    }
  }
  
 //this Method loads Browser DropDown
 loadDropDown = (bill, ukey, styles) =>{
    return (
      <Dropdown isOpen={this.state.dropdownOpen[ukey]} style={{marginTop: 7, float: "right" }} toggle={() => { this.toggleDropDown(ukey); }} size="sm">
        <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[ukey]}>
          <FaEllipsisV style={styles}/>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => { this.updateBill(bill) }}> Update </DropdownItem>
          <DropdownItem onClick={() => { this.setState({ id: bill.id }); this.toggleDanger(); }}> Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>);
 }

 //this method calls the delete model
 loadDeleteBill = () => {
  return (
    <Modal isOpen={this.state.danger} toggle={this.toggleDanger} style={{paddingTop: "20%"}} backdrop={true}>
     <ModalHeader toggle={this.toggleDanger}>Delete Bill</ModalHeader>
     <ModalBody> Are you Sure want to Delete This Bill ? </ModalBody>
     <ModalFooter>
       <Button color="danger" onClick={this.deleteBill}>Delete</Button>
       <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
     </ModalFooter>
   </Modal>)
 }
}
export default Bills;