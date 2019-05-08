import React, { Component } from "react";
import { Button, Row, Col, Card, CardBody, Alert, Modal, ModalHeader, ModalBody, ModalFooter,
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
      collapse: [],
      requiredContact: [],
      labels: [0],
      contactId: 0,
      name: "",
      version: "",
      addContainer: false,
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
      count: 0,
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
  

  errorCall = err => { this.setState({ visible : true }) }

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

  toggleDanger = () => {
    this.setState({ danger : !this.state.danger});
  }
 
  updateContact = (ulable) => {
   this.setState({ updateContact : true, requiredContact : ulable })
  };
  
  deleteContact = () => {
   this.setState({ deleteContact : true })
  };
 
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
    console.log(contactId);
    await this.setState({ contactId : contactId,  addAttachRequest: true });
  } 

  render() {
   const { contacts,createContact,updateContact,deleteContact,addAttachRequest,contactId,visible,profileId,requiredContact,spinner,labels} = this.state
    if (contacts.length === 0 && !createContact ) {
      return <div>{contacts.length === 0 && !createContact && !spinner ? this.loadLoader() :this.loadNotContact()}</div>
    } else if (createContact) {
      return ( <CreateContact profileId={profileId} lables={labels}/>)
    } else if (updateContact) {
      return(<UpdateContact profileId={profileId} contact={requiredContact} lables={labels} />)
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
        <input type="search"  className="float-right" style={{marginTop:7}} placeholder="Search...." onChange={this.searchHandler} value={this.state.searchContact} />
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
    setTimeout(()=>this.setState({show:false}),1800)
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
  
  loadSingleContact = (contact,ukey) =>{ 
    const styles = { marginTop : "4px" }
    return (
      <ListGroup flush key={ukey} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, ukey)} onPointerLeave={(e) => this.onHoverOff(e, ukey)}>
        <ListGroupItem action>
          <Row>
            <Col>
              {this.displayName(contact.firstName+ " " +contact.lastName,contact.id, styles)}
              <FaPaperclip color="#87CEFA" style={{marginTop:5, marginLeft: 10}} size={17} onClick={()=>this.attachDropDown(ukey, contact.id)} /> 
            </Col>
            <Col lg={1} sm={1} md={1} xl={1} >{this.state.onHover && this.state.hoverAccord[ukey] ? this.loadDropDown(contact, ukey, styles) : ''}</Col>
          </Row>
          <Collapse isOpen={this.state.attachDropdown[ukey]}> <br></br> {this.showAttachments(contact.id)}</Collapse>
        </ListGroupItem>
      </ListGroup>)
  }
  
  displayName= (name,contactId,styles)=>{
    return( 
      <span style={{styles}} ><FaUserCircle size={20} />
        {' '}{ name.length>20 ? name.slice(0, 20)+"..." : name }&nbsp;
        <Attachments profileId={this.state.profileId} contactId ={contactId} getCount={true}/>
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

  loadDropDown = (contact,ukey) =>{
   return (<Dropdown isOpen={this.state.dropdownOpen[ukey]} style={{marginTop: 7, float: "right" }} toggle={() => { this.toggleDropDown(ukey); }} size="sm">
       <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[ukey]}>
         <FaEllipsisV style={{marginTop:-10}}/>
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem onClick={() => { this.updateContact(contact) }}> Update </DropdownItem>
         <DropdownItem onClick={() => { this.setState({ contactId: contact.id }); this.toggleDanger(); }}> Delete</DropdownItem>
       </DropdownMenu>
     </Dropdown>);
  }

 showAttachments(contactId){
   return <Attachments contactId={contactId} profileId={this.state.profileId}/>
  }
}
export default Contacts;