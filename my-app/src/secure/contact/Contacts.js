import React, { Component } from "react";
import { Button, Row, Col, Card, CardBody, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Input,
         Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroupItem, ListGroup, Collapse} from "reactstrap";
import { FaEllipsisV, FaPaperclip, FaUserCircle } from 'react-icons/fa';
import UpdateContact from "./UpdateContact";
import DeleteContact from "./DeleteContact";
import ProfileApi from "../../services/ProfileApi";
import Loader from 'react-loader-spinner'
import ContactApi from "../../services/ContactApi";
import CreateContact from "./CreateContact";
import LabelApi from "../../services/LabelApi";
import Attachments from "./Attachments/Attachments";
import AddAttachment from "./Attachments/AddAttachment";
class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      labels: [0],
      contactId: 0,
      name: "",
      createContact: false,
      visible: false,
      updateContact: false,
      deleteContact: false,
      profileId:0,
      accordion: [],
      danger: false,
      show: true,
      isOpen: false,
      addAttachRequest: false,
      dropdownOpen: [],
      attachDropdown: [],
      onHover: false,
      hoverAccord : [],
      spinner: false,
      searchContact:''
    };
    this.searchHandler = this.searchHandler.bind(this)
  }
  
  componentDidMount = () =>{
    new ProfileApi().getProfiles(this.successProfileid,this.errorCall);
  }
 
  successProfileid = (json) =>{
    if (json === []) { this.setState({ profileId:'',spinner:false })}
    else {
      const iterator = json.values();
      for (const value of iterator) {this.setProfileId(value.id)}
    }
  }
  setProfileId = (id) =>{
    this.setState({ profileId : id })
    this.getContact();
  }
  getContact = () =>{
    new ContactApi().getContacts(this.successCall, this.errorCall, this.state.profileId);
  }

  successCall = (contactJson) => {
    if (contactJson === []) {
      this.setState({ contacts : [0] })
    
    } else {
      this.setState({ contacts : contactJson, spinner : true })
      this.loadCollapse();
    }
  };

  errorCall = err => { 
    this.setState({ visible : true })
   }

  callCreateContact = () => { this.setState({ createContact : true })}

  loadCollapse = () =>{
    this.state.contacts.map(lables => {return this.setState(prevState => ({
    accordion: [...prevState.accordion, false],
    hoverAccord : [...prevState.hoverAccord,false],
    dropdownOpen: [...prevState.dropdownOpen, false],
    attachDropdown: [...prevState.attachDropdown, false]
  }))});
    new LabelApi().getlabels(this.successCallLabel, this.errorCall,this.state.profileId);
  }

  successCallLabel = (json) => {
    if (json === []) {
      this.setState({ labels : [0] })
    } else {
      this.setState({ labels : json, spinner : true })
    }
  };
  updateContact = (contactId) => {
   this.setState({ updateContact : true, contactId })
  };
  
  deleteContact = () => {
   this.setState({ deleteContact : true })
  };

  toggleDanger = () => {
    this.setState({ danger : !this.state.danger});
  }
  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({accordion: state});
  }
 
  toggleDropDown = (tab) => {
    const prevState = this.state.dropdownOpen;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({dropdownOpen: state});
  }
  attachDropDown = (hKey, cId) =>{ 
    const prevState = this.state.attachDropdown;
    const state = prevState.map((x,index)=> hKey===index? !x : false );
    this.setState({ attachDropdown : state, contactId: cId });
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

  addAttach = async (contactId, key) => {
    await this.setState({ contactId : contactId,  addAttachRequest: true });
  } 
  changeBg() {
    const { colors } = this.state;
    const color = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = color;
  }
  render() {
   const { contacts,createContact,updateContact,deleteContact,addAttachRequest,contactId,visible,profileId,spinner,labels} = this.state
    if (contacts.length === 0 && !createContact ) {
      return <div>{contacts.length === 0 && !createContact && !spinner ? this.loadLoader() :this.loadNotContact()}</div>
    } else if (createContact) {
      return ( <CreateContact profileId={profileId} lables={labels}/>)
    } else if (updateContact) {
      return(<UpdateContact profileId={profileId} contactId={contactId} lables={labels} />)
    } else if(deleteContact) {
      return ( <DeleteContact contactId={contactId}  profileId={profileId}/> )
    } else if(addAttachRequest) {
      return ( <AddAttachment contacId={contactId}  profileId={profileId}/> )
    } else{
      return <div>{this.loadShowContact(visible, contacts)}{this.loadDeleteContact()}</div>
    }
  }
 
  searchHandler = (event) =>{
    this.setState({ searchContact : event.target.value })
  }
  
  searchingFor(term){
    return function(x){
      return (x.firstName.toLowerCase()+x.lastName.toLowerCase()).includes(term.toLowerCase()) || !term
    }
  }

  loadHeader = () =>{
    return (
      <div>
        <div style={{paddingTop:20,paddingRight:10}} >
        <strong style={{fontSize:30,marginLeft:20}}>Contacts</strong>
        <Button className="float-right" color="success" onClick={this.callCreateContact} style={{marginLeft:10}}> + Add</Button>
        <Input type="search" className="float-right" style={{width:'45%'}} placeholder="Search Contacts...." onChange={this.searchHandler} value={this.state.searchContact}>
        </Input>
        </div>
      </div>
    )
  }

  loadLoader = () =>{
    return( 
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center style={{paddingTop:'20px'}}>
            <CardBody><Loader type="Ball-Triangle" color="#2E86C1" height={80} width={80}/></CardBody>
          </center>
        </Card>
      </div>)
  }

  loadNotContact = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center style={{paddingTop:'20px'}}>
            <CardBody><h5><b>You haven't created any Contacts yet... </b></h5> </CardBody>
          </center>
        </Card>
      </div>)
  }

  callAlertTimer(){
    if (this.state.show) {
      setTimeout(()=>this.setState({show:false}),1800)
    }
  }
  
  loadShowContact = (visible, contacts) => {
    this.callAlertTimer()
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <div style={{margin:30}}>
            <h6><Alert isOpen={this.state.show} color={this.props.color===undefined?'':this.props.color}>{this.props.content}</Alert></h6>
            {contacts.filter(this.searchingFor(this.state.searchContact)).map((contact, key) => { return this.loadSingleContact(contact,key)})} 
          </div>
        </Card>
      </div>)
  }
  
  loadSingleContact = (contact,contactKey) =>{ 
    const styles = { marginTop : "4px" }
    return (
      <ListGroup flush key={contactKey} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, contactKey)} onPointerLeave={(e) => this.onHoverOff(e, contactKey)}>
        <ListGroupItem action>
          <Row>
            <Col>
              {this.displayName(contact, styles)}
              <FaPaperclip color="#87CEFA" style={{marginTop:5, marginLeft: 10}} size={17} onClick={()=>this.attachDropDown(contactKey, contact.id)} /> 
            </Col>
            <Col lg={1} sm={1} md={1} xl={1} >{this.state.onHover && this.state.hoverAccord[contactKey] ? this.loadDropDown(contact, contactKey, styles) : ''}</Col>
          </Row>
          <Collapse isOpen={this.state.attachDropdown[contactKey]}> <br></br> {this.showAttachments(contact.id, contact)}</Collapse>
        </ListGroupItem>
      </ListGroup>)
  }
  
  displayName= (contact,styles,colorChange)=>{
    return( 
      <span style={{styles}} ><FaUserCircle size={20} style={{color:'green'}}  />{" "}
      { contact.firstName.length>20 ? contact.firstName.slice(0, 20)+"..." : contact.firstName+" "+contact.lastName }
        <Attachments profileId={this.state.profileId} contactId ={contact.id} getCount={true}/>
      </span>)
  }
 
  loadDeleteContact = () => {
    return (
      <Modal isOpen={this.state.danger} toggle={this.toggleDanger} style={{paddingTop: "20%"}} backdrop={true}>
        <ModalHeader toggle={this.toggleDanger}>Delete Contact</ModalHeader>
        <ModalBody>Are you Sure want to Delete This Contact ?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteContact}>Delete</Button>
          <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
        </ModalFooter>
      </Modal>)
   }

  loadDropDown = (contact,contactKey) =>{
   return (<Dropdown isOpen={this.state.dropdownOpen[contactKey]} style={{marginTop: 7, float: "right" }} toggle={() => { this.toggleDropDown(contactKey); }} size="sm">
       <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(contactKey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[contactKey]}>
         <FaEllipsisV style={{marginTop:-10}}/>
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem onClick={() => { this.updateContact(contact.id) }}> Update </DropdownItem>
         <DropdownItem onClick={() => { this.setState({ contactId: contact.id }); this.toggleDanger(); }}> Delete</DropdownItem>
       </DropdownMenu>
     </Dropdown>);
  }

 showAttachments(contactId, contact){
   return (<div>
     <b>Email: </b> {contact.email}&nbsp;&nbsp;<b>Phone: </b>{contact.phone}<br/>{contact.address1}
     <Attachments contactId={contactId} profileId={this.state.profileId}/>
   </div>)
  }
}
export default Contacts;