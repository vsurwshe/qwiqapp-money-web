import React, { Component } from "react";
import { Button,Row, Col, Card, CardBody, Alert, CardHeader,Collapse,Modal, ModalHeader, ModalBody, ModalFooter,Dropdown,DropdownToggle,DropdownMenu,DropdownItem,ListGroupItem,ListGroup} from "reactstrap";
import CreateLabel from "./CreateBill";
import Avatar from 'react-avatar';
import { FaAngleDown,FaEllipsisV} from 'react-icons/fa';
import UpdateBill from "./UpdateBill";
import BillApi from "../../services/BillApi";
import Loader from 'react-loader-spinner'
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import LabelApi from "../../services/LabelApi";
import DeleteBill from "./DeleteBill";
class Bills extends Component {
  isUnmount = false;
  constructor(props) {
    super(props);
    this.state = {
      bills: [],
      labels:[],
      catagoery:[],
      collapse: [],
      rebill:[],
      createBill: false,
      visible: false,
      updateBill: false,
      deleteLabel: false,
      profileId:0,
      accordion: [],
      danger: false,
      show:true,
      dropdownOpen:[],
      onHover:false,
      hoverAccord : [],
      spinner:false,
      screenWidth:""
    };
  }
  //this method get All bills Realted That Profile
  componentDidMount=()=> {
   this.setProfileId();
  }
  //this method set Profile Id
  setProfileId=async (id)=>{
    await this.setState({profileId:Store.getProfileId()})
    this.getBills();
  }
  //this is geting Bills
  getBills=()=>{
    new BillApi().getBills(this.successCallBill, this.errorCall,this.state.profileId);
}
  //this method seting bill when api given successfull Response
  successCallBill = bill => {
    if (bill === []) {
      this.setState({ bills: [0] })
    } else {
      this.setState({ bills: bill, spinner:true })
      this.loadCollapse();
    }
  };
 
 
  callCreateBill = () => { this.setState({ createBill: true })}

  loadCollapse= async()=>{
   await  this.state.bills.map(lables=>{return this.setState(prevState => ({accordion: [...prevState.accordion, false],
      hoverAccord : [...prevState.hoverAccord,false],
      dropdownOpen: [...prevState.dropdownOpen, false]}))});
    new CategoryApi().getCategories(this.successCallCatagoery,this.errorCall,this.state.profileId); 
  }
  //this method seting Categories when api given successfull Response
   successCallCatagoery = async(catagoery) => {
    if (catagoery === []) {
      this.setState({ catagoery: [0] })
    } else {
      await this.setState({ catagoery: catagoery})
      new LabelApi().getSublabels(this.successCallLabel,this.errorCall,this.state.profileId);
    }
  };
  //this method seting label when api given successfull Response
  successCallLabel = label => {
    if (label === []) {
      this.setState({ labels: [0] })
    } else {
      this.setState({ labels: label})
    }
  };
  errorCall = err => { this.setState({ visible: true }) }
  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({danger: !this.state.danger});
  }
  //this method for the load Update Compoents
  updateBill = (ubill) => {
   this.setState({ updateBill: true, rebill:ubill })
  };
  //this method for the load delete Components
  deleteLabel = () => {
   this.setState({ deleteLabel: true })
  };
  //this method toggel Lables tab
  toggleAccordion=(tab)=> {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({accordion: state});
  }
  //this method use for showing sub-lables when swtich is yes
  toggleSublabel=()=>{
    this.setState({show:!this.state.show});
    this.getBills();
  }
  toggleDropDown=(tab)=> {
    const prevState = this.state.dropdownOpen;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({dropdownOpen: state});
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
    const { bills, createBill,updateBill,id,deleteLabel, visible,profileId,rebill,spinner,labels,catagoery} = this.state
    if (bills.length === 0 && !createBill ) {
      return <div>{bills.length === 0 && !createBill && !spinner ? this.loadLoader() :this.loadNotBill()}</div>
    } else if (createBill) {
      return ( <CreateLabel pid={profileId} label={labels} catagoery={catagoery} />)
    }else if (updateBill) {
      return(<UpdateBill pid={profileId} bill={rebill} lables={bills} catagoery={catagoery} />)
    }else if(deleteLabel) {
      return ( <DeleteBill id={id}  pid={profileId}/> )
    }else{
      return <div>{this.loadShowBill(visible, bills)}{this.loadDeleteBill()}</div>
    }
  }

  loadHeader=()=>{
    return(
      <CardHeader>
      <strong>Total Bills: {this.state.bills.length}</strong>
      <Button color="success" className="float-right" onClick={this.callCreateBill}> + Create Bill </Button>
    </CardHeader>
    )
  }

  //this method load the spinner
  loadLoader=()=>{
   return( <div className="animated fadeIn">
   <Card>
    {this.loadHeader()}
     <center style={{paddingTop:'20px'}}>
       <CardBody>
         <Loader type="Ball-Triangle" color="#2E86C1" height={80} width={80}/>
       </CardBody>
     </center>
   </Card>
 </div>)
  }
  //this method call when if any Bill not created.
  loadNotBill = () => {
    return (<div className="animated fadeIn">
      <Card>
       {this.loadHeader()}
        <center style={{paddingTop:'20px'}}>
          <CardBody>
              <h5><b>You haven't created any Bills yet... </b></h5><br/>
          </CardBody>
        </center>
      </Card>
    </div>)
  }
  //if one or more Bill is there then this method Call
  loadShowBill = (visible, bills) => {
     return (<div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <div style={{margin:30, paddingLeft:100}}>
          <h6><Alert isOpen={visible} color="danger"></Alert></h6>
          {this.state.bills.map((label, key) => {return this.loadSingleBill(this.state.bills[key], key); })}</div>
      </Card>
    </div>)
    
  }
  //Show the Single Bill 
  loadSingleBill=(bill,ukey)=>{
    const styles={
      margin: "6px"
    }
    return (
      <ListGroup flush key={ukey} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, ukey)} onPointerLeave={(e) => this.onHoverOff(e, ukey)}>
      <ListGroupItem action>
        <Row><Col sm={10}>
         <Avatar name={bill.type} color={"#000000"} size="40" square={true}>{}</Avatar> &nbsp;&nbsp;{bill.billDate +" "+ bill.notes} <FaAngleDown onClick={() => this.toggleAccordion(ukey)} />
        </Col><Col>
        {this.state.onHover && this.state.hoverAccord[ukey] ? this.loadDropDown(bill, ukey, styles) : ''}</Col></Row>
        <Collapse isOpen={this.state.accordion[ukey]}>
          <div style={{paddingLeft:50,paddingTop:10}}>
            Amount : {bill.amount}<br/>
            Date :{bill.billDate}<br/>
            Catagoery :{bill.categoryId}<br />
            Notes : {bill.notes}<br/>
          </div>
        </Collapse>
      </ListGroupItem>
    </ListGroup>)
  }
  
  //this method call the delete model
  loadDeleteBill = () => {
    return (<Modal isOpen={this.state.danger} toggle={this.toggleDanger} style={{paddingTop: "20%"}} backdrop={true}>
       <ModalHeader toggle={this.toggleDanger}>Delete Label</ModalHeader>
       <ModalBody>
         Are you Sure want to Delete This Label ?
         </ModalBody>
       <ModalFooter>
         <Button color="danger" onClick={this.deleteLabel}>Delete</Button>
         <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
       </ModalFooter>
     </Modal>)
   }
 //this Method load Browser DropDown
 loadDropDown=(bill,ukey,styles)=>{
   return (<Dropdown isOpen={this.state.dropdownOpen[ukey]} style={{marginTop: 7, float: "right" }} toggle={() => { this.toggleDropDown(ukey); }} size="sm">
       <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[ukey]}>
         <FaEllipsisV style={styles}/>
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem onClick={() => { this.updateBill(bill) }}> Update </DropdownItem>
         <DropdownItem onClick={() => { this.setState({ id: bill.id }); this.toggleDanger(); }}> Delete</DropdownItem>
       </DropdownMenu>
     </Dropdown>);
 }
}
export default Bills;