import React, { Component } from "react";
import {Button,Row,Col,Card,CardBody,Alert,CardHeader,Popover,PopoverHeader,PopoverBody,NavLink,Modal,ModalHeader,ModalBody,ModalFooter,Dropdown,DropdownToggle,DropdownMenu,DropdownItem,ListGroupItem,ListGroup} from "reactstrap";

import Avatar from 'react-avatar';
import {FaAngleDown,FaEllipsisV} from 'react-icons/fa';
import UpdateContact from "./UpdateContact";
import DeleteContact from "./DeleteContact";
import ProfileApi from "../../services/ProfileApi";
import Loader from 'react-loader-spinner'
import ContactApi from "../../services/ContactApi";
import CreateContact from "./CreateContact";
import LabelApi from "../../services/LabelApi";

class Contacts extends Component {
  isUnmount = false;
  constructor(props) {
    super(props);
    this.state = {
      contact: [],
      collapse: [],
      recontact:[],
      labels: [0],
      id: 0,
      name: "",
      version:"",
      addContainer: false,
      createContact: false,
      viewLabelRequest: false,
      visible: false,
      updateContact: false,
      deleteContact: false,
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
  
  componentDidMount=()=> {
     new ProfileApi().getProfiles(this.successProfileid,this.errorCall);
  }
 
  successProfileid=json=>{
    if (json === []) { this.setState({ profileId:'',spinner:false })}
    else {
      const iterator = json.values();
      for (const value of iterator) {this.setProfileId(value.id)}
    }
  }
 
  setProfileId=(id)=>{
    this.setState({profileId:id})
    this.getContact();
  }
 
  getContact=()=>{
    new ContactApi().getContacts(this.successCall, this.errorCall,this.state.profileId);
 }

 successCall = json => {
    if (json === []) {
      this.setState({ contact: [0] })
    } else {
      this.setState({ contact: json, spinner:true })
      this.loadCollapse();
    }
  };
  

  errorCall = err => { this.setState({ visible: true }) }

  callCreateContact = () => { this.setState({ createContact: true })}

  loadCollapse=()=>{
     this.state.contact.map(lables=>{return this.setState(prevState => ({accordion: [...prevState.accordion, false],
      hoverAccord : [...prevState.hoverAccord,false],
      dropdownOpen: [...prevState.dropdownOpen, false]}))});
      new LabelApi().getlabels(this.successCallLabel, this.errorCall,this.state.profileId);
  }
  successCallLabel = json => {
    if (json === []) {
      this.setState({ labels: [0] })
    } else {
      this.setState({ labels: json, spinner:true })
     
    }
  };

  toggleDanger = () => {
    this.setState({danger: !this.state.danger});
  }
 
  updateContact = (ulable) => {
   this.setState({ updateContact: true,recontact:ulable })
  };
  
  deleteContact = () => {
   this.setState({ deleteContact: true })
  };
 
  toggleAccordion=(tab)=> {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({accordion: state});
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
   const { contact,viewLabelRequest, createContact,updateContact,id,deleteContact, visible,profileId,recontact,spinner,labels} = this.state
    if (contact.length === 0 && !createContact ) {
      return <div>{contact.length === 0 && !createContact && !spinner ? this.loadLoader() :this.loadNotContact()}</div>
    } else if (createContact) {
      return ( <CreateContact pid={profileId} lables={labels}/>)
    }else if (updateContact) {
      return(<UpdateContact pid={profileId} contact={recontact} lables={labels} />)
    }else if(deleteContact) {
      return ( <DeleteContact id={id}  pid={profileId}/> )
    }else{
      return <div>{this.loadShowContact(viewLabelRequest, visible, contact)}{this.loadDeleteContact()}</div>
    }
  }
 
  loadHeader=()=>{
    return(
      <CardHeader>
       <strong>Total Contacts: {this.state.contact.length}</strong>
       <Button className="float-right" color="success" onClick={this.callCreateContact} >+ Create Contact</Button>
     </CardHeader>
    )
  }


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

  loadNotContact = () => {
    return (<div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center style={{paddingTop:'20px'}}>
          <CardBody>
              <h5><b>You haven't created any Contacts yet... </b></h5>
           </CardBody>
        </center>
      </Card>
    </div>)
  }
  
  loadShowContact = (visible, contact) => {
     return (<div className="animated fadeIn">
      <Card>
      {this.loadHeader()}
        <div style={{margin:30}}>
          <h6><Alert isOpen={visible} color="danger">Internal Server Error</Alert></h6>
          {this.state.contact.map((label, key) => {return this.loadSingleContact(this.state.contact[key], key); })}</div>
      </Card>
    </div>)
    
  }
  
  loadSingleContact=(contact,ukey)=>{
    const styles={
      margin: "6px"
    }
    return (
      <ListGroup flush key={ukey} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, ukey)} onPointerLeave={(e) => this.onHoverOff(e, ukey)}>
      <ListGroupItem action>
        <Row>
        <Col>
          <Avatar name={contact.address1.charAt(0)}  color={"#000000"} size="40" square={true} key={contact.id} /> &nbsp;&nbsp;{this.displayName(contact.address1, styles)} 
          {<span style={{ paddingLeft: 10 }}><FaAngleDown id={'Popover-' + ukey}  onClick={() => this.toggleAccordion(ukey)} /></span>}
        {this.state.onHover && this.state.hoverAccord[ukey] ? this.loadDropDown(contact, ukey, styles) : ''}</Col></Row>
          {/* <Collapse isOpen={this.state.accordion[ukey]}> */}
          <Popover trigger="focus" placement="right" isOpen={this.state.accordion[ukey]}  target={'Popover-' + ukey}>
            <PopoverHeader>{contact.address1}</PopoverHeader>
            <PopoverBody className="card-text">
              {contact.address2}<br/>
              {contact.state},&nbsp;{contact.country}-{contact.postcode}<br/>
              <Row><NavLink onClick={() => { this.updateContact(contact) }} href="#">Edit </NavLink>  <NavLink onClick={() => { this.setState({ id: contact.id }); this.toggleDanger(); }} href="#">Delete</NavLink></Row>
            </PopoverBody>
          </Popover>
      </ListGroupItem>
    </ListGroup>)
  }
  
  displayName=(name,styles)=>{
    return(<span style={{styles}}>{ name.length>20? name.slice(0, 15)+"..." : name }</span>)
  }
  
  loadDeleteContact = () => {
    return (<Modal isOpen={this.state.danger} toggle={this.toggleDanger} style={{paddingTop: "20%"}} backdrop={true}>
       <ModalHeader toggle={this.toggleDanger}>Delete Label</ModalHeader>
       <ModalBody>
         Are you Sure want to Delete This Label ?
         </ModalBody>
       <ModalFooter>
         <Button color="danger" onClick={this.deleteContact}>Delete</Button>
         <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
       </ModalFooter>
     </Modal>)
   }

  loadDropDown=(contact,ukey,styles)=>{
   return (<Dropdown isOpen={this.state.dropdownOpen[ukey]} style={{marginTop: 7, float: "right" }} toggle={() => { this.toggleDropDown(ukey); }} size="sm">
       <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[ukey]}>
         <FaEllipsisV style={styles}/>
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem onClick={() => { this.updateContact(contact) }}> Update </DropdownItem>
         <DropdownItem onClick={() => { this.setState({ id: contact.id }); this.toggleDanger(); }}> Delete</DropdownItem>
       </DropdownMenu>
     </Dropdown>);
 }
}
export default Contacts;