import React, { Component } from "react";
import { Button,Row, Col, Card, CardBody, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, 
         DropdownMenu, DropdownItem, ListGroupItem, ListGroup } from "reactstrap";
import CreateBill from "./CreateBill";
import { FaEllipsisV } from 'react-icons/fa';
import UpdateBill from "./UpdateBill";
import BillApi from "../../services/BillApi";
import Loader from 'react-loader-spinner'
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import LabelApi from "../../services/LabelApi";
import DeleteBill from "./DeleteBill";

class Bills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: [],
      labels: [],
      categories: [],
      collapse: [],
      rebill: [],
      createBill: false,
      updateBill: false,
      deleteBill: false,
      visible: false,
      dropdownOpen: [],
      hoverAccord : [],
      accordion: [],
      profileId: Store.getProfileId(),
      danger: false,
      onHover: false,
      spinner: false,
      selectedOption: ''
    };
  }

  componentDidMount = () =>{
    new BillApi().getBills(this.successCallBill, this.errorCall,this.state.profileId);
  }

  //this method sets bills when api given successfull Response
  successCallBill = async bill => {
    if (bill === []) {
      this.setState({ bills: [0] })
    } else {
      await this.setState({ bills: bill, spinner:true })
      this.loadCollapse();
    }
  };
  
  callCreateBill = () => {this.setState({ createBill : true })}

  loadCollapse = async () =>{
    await this.state.bills.map(lables => {return this.setState(prevState => ({
      accordion : [...prevState.accordion, false],
      hoverAccord : [...prevState.hoverAccord,false],
      dropdownOpen : [...prevState.dropdownOpen, false]
    }))});
    new CategoryApi().getCategories(this.successCallCategory, this.errorCall, this.state.profileId); 
  }

  //this method seting Categories when api given successfull Response
   successCallCategory = async categories => {
    if (categories === []) {
      this.setState({ categories : [0] })
    } else {
      await this.setState({ categories : categories})
      new LabelApi().getSublabels(this.successCallLabel, this.errorCall, this.state.profileId);
    }
  };

  //this method seting label when api given successfull Response
  successCallLabel = label => {
    if (label === []) {
      this.setState({ labels : [0] })
    } else {
      this.setState({ labels : label})
    }
  };

  errorCall = err => { this.setState({ visible : true }) }

  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({danger : !this.state.danger});
  }

  //this method for the load Update Compoents
  updateBill = ubill => {
   this.setState({ updateBill : true, rebill : ubill })
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
    const { bills, createBill, updateBill, id, deleteBill, visible, profileId, rebill, spinner, labels, categories } = this.state
    if (bills.length === 0 && !createBill ) {
      return <div>{bills.length === 0 && !createBill && !spinner ? this.loadLoader() :this.loadNotBill()}</div>
    } else if (createBill) {
      return ( <CreateBill pid={profileId} label={labels} categories={categories} />)
    }else if (updateBill) {
      return(<UpdateBill pid={profileId} bill={rebill} lables={labels} categories={categories} />)
    }else if(deleteBill) {
      return ( <DeleteBill id={id}  pid={profileId}/> )
    }else{
      return <div>{this.loadShowBill(visible, bills)}{this.loadDeleteBill()}</div>
    }
  }

  searchSelected = (e) =>{
    this.setState({ selectedOption : e.target.value });
  }
  
  searchingFor = (term) =>{
    return function(x){
        return (x.notes.toLowerCase()+x.amount).includes(term.toLowerCase()) || !term
    }
  }

  loadHeader = () => {
    return (
        <div style={{ paddingTop: 20, paddingRight: 10 }} >
          <strong style={{ fontSize: 30, marginLeft: 80 }}>BILLS</strong>
          <Button color="success" className="float-right" onClick={this.callCreateBill} style={{ marginLeft: 10 }}> + Add </Button>
          <input type="search" className="float-right" style={{ marginTop: 7 }} placeholder="Search....." onChange={this.searchSelected} />
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
            {bills.filter(this.searchingFor(this.state.selectedOption)).map((bill, key) => {return this.loadSingleBill(bill, key); })}</div>
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
              <strong style={{ paddingTop: 5 }}>{this.dateFormat(bill.billDate)}</strong>
            </Col>
            <Col sm={8}>
              <Row style={{ paddingLeft: 10 }}>{bill.notes}</Row>
              <Row style={{ paddingLeft: 10, fontStyle: "oblique" }}>{this.displayCategoryName(bill.categoryId)}</Row>
            </Col>
            <Col style={{ marginTop: 10 }} className="float-right">
              <b style={{ color: "#F80505" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: bill.currency}).format( bill.amount)}</b>
            </Col>
            <Col>{this.state.onHover && this.state.hoverAccord[ukey] ? this.loadDropDown(bill, ukey, styles) : ''}</Col>
          </Row>
        </ListGroupItem>
      </ListGroup>)
  }
 
  dateFormat = (userDate) =>{
    var parts = userDate.split('-');
    var date = new Date(parts[0], parts[1]-1, parts[2]);
    const finalDate = new Intl.DateTimeFormat('en-gb', {  month: 'short',  weekday: 'short',  day: '2-digit' }).format(date);
    return finalDate;
  }

  displayCategoryName = (cid) => {
    var data = this.state.categories.filter(item => { return item.id === cid });
    if (data.length === 0) {
      this.state.categories.map(category => {
        if (Array.isArray(category.subCategories)) {
          category.subCategories.forEach(element => {
            if (element.id === cid) {
              data = element.name;
              return data;
            }});}
        return 0
      })
      return data;
    } else {
      for (const value of data)
        return value.name;
    }
  }
  
 //this Method loads Browser DropDown
 loadDropDown = (bill,ukey,styles) =>{
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