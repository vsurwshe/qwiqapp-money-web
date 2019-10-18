import React, { Component } from "react";
import { Button, Row, Col, Card, CardBody, CardHeader, Alert, Input, InputGroup, InputGroupAddon, InputGroupText, ListGroupItem, ListGroup, Collapse } from "reactstrap";
import { FaPaperclip, FaUserCircle, FaSearch, FaCaretDown } from 'react-icons/fa';
import Loader from 'react-loader-spinner'
import DeleteContact from "./DeleteContact";
import LabelApi from "../../services/LabelApi";
import Attachments from "./attachments/Attachments";
import AddAttachment from "./attachments/AddAttachment";
import Store from "../../data/Store";
import { DeleteModel } from "../utility/DeleteModel";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import ContactApi from "../../services/ContactApi";
import ContactForm from "./ContactForm";
import '../../css/style.css';
/* 
  * Presently we are showing attachments also
  * We must get profileType, if we doesn't show attachment file option for free/ basic profiles for user
*/

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      singleContact: [],
      labels: [],
      contactId: 0,
      name: "",
      createContact: false,
      visible: props.visible,
      updateContact: false,
      deleteContact: false,
      profileId: 0,
      accordion: [],
      danger: false,
      isOpen: false,
      addAttachRequest: false,
      dropdownOpen: [],
      attachDropdown: [],
      onHover: false,
      hoverAccord: [],
      spinner: false,
      searchContact: '',
      profileType: Store.getProfile().type
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id });
      this.getContacts();
    }
  }

  getContacts = () => {
    new ContactApi().getContacts(this.successCall, this.errorCall, this.state.profileId);
  }

  successCall = (contacts) => {
    if (contacts === []) {
      this.setState({ contacts: [0] })
    } else {
      this.setState({ contacts, spinner: true })
      this.loadCollapse();
    }
  };

  errorCall = err => {
    this.setState({ visible: true })
  }

  callCreateContact = () => { this.setState({ createContact: true }) }

  loadCollapse = () => {
    this.state.contacts.map(labels => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        hoverAccord: [...prevState.hoverAccord, false],
        dropdownOpen: [...prevState.dropdownOpen, false],
        attachDropdown: [...prevState.attachDropdown, false]
      }))
    });
    new LabelApi().getlabels(this.successCallLabel, this.errorCall, this.state.profileId);
  }

  successCallLabel = (json) => {
    if (json === []) {
      this.setState({ labels: [] })
    } else {
      this.setState({ labels: json, spinner: true })
    }
  };

  updateContact = (contact) => {
    this.setState({ updateContact: true, singleContact: contact })
  };

  deleteContact = () => {
    this.setState({ deleteContact: true })
  };

  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
  }

  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({ accordion: state });
  }

  toggleDropDown = (tab) => {
    const prevState = this.state.dropdownOpen;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({ dropdownOpen: state });
  }

  attachDropDown = (key, contactId) => {
    const prevState = this.state.attachDropdown;
    const state = prevState.map((x, index) => key === index ? !x : false);
    if (contactId) {
      this.setState({ attachDropdown: state, contactId });
    } else {
      this.setState({ attachDropdown: state });
    }
  }

  hoverAccordion = (key) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((x, index) => key === index ? !x : false);
    this.setState({ hoverAccord: state });
  }

  onHover = (e, key) => {
    this.setState({ onHover: true });
    this.hoverAccordion(key)
  }

  onHoverOff = (e, key) => {
    this.setState({ onHover: false });
    this.hoverAccordion(key)
  }

  addAttach = async (contactId, key) => {
    await this.setState({ contactId: contactId, addAttachRequest: true });
  }

  changeBg() {
    const { colors } = this.state;
    const color = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = color;
  }

  render() {
    let profile = Store.getProfile();
    const { contacts, singleContact, createContact, updateContact, deleteContact, addAttachRequest, contactId, visible, profileId, spinner, labels, danger } = this.state
    if (profile) {
      if (contacts.length === 0 && !createContact) {
        return <div>{contacts.length === 0 && !createContact && !spinner ? this.loadSpinner() : this.loadContactEmpty()}</div>
      } else if (createContact) {
        return <ContactForm profileId={profileId} lables={labels} />
      } else if (updateContact) {
        return <ContactForm profileId={profileId} contact={singleContact} lables={labels} />
      } else if (deleteContact) {
        return <DeleteContact contactId={contactId} profileId={profileId} />
      } else if (addAttachRequest) {
        return <AddAttachment contacId={contactId} profileId={profileId} />
      } else {
        return <div>{ danger && this.loadDeleteContact()} {this.loadShowContact(visible, contacts)}</div>
      }
    } else {
      return <ProfileEmptyMessage />
    }
  }

  searchHandler = (event) => {
    this.setState({ searchContact: event.target.value })
  }

  searchingFor(term) {
    return function (x) {
      return (x.name.toLowerCase() + x.organization.toLowerCase()).includes(term.toLowerCase()) || !term
    }
  }

  loadHeader = () => {
    return <CardHeader>
      <Row style={{ padding: "0px 20px 0px 20px" }}>
        <Col sm={3}><strong >Contacts </strong></Col>
        <Col>
          {this.state.contacts.length !== 0 && <InputGroup >
            <Input type="search" className="float-right" onChange={() => this.searchHandler} value={this.state.searchContact} placeholder="Search Contacts..." />
            <InputGroupAddon addonType="append"><InputGroupText className="dark"><FaSearch /></InputGroupText></InputGroupAddon>
          </InputGroup>
          }
        </Col>
        <Col sm={2}><Button color="success" className="float-right" onClick={this.callCreateContact}> + ADD </Button></Col>
      </Row>
    </CardHeader>
  }

  loadSpinner = () => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center className="padding-top">
          <CardBody><Loader type="Ball-Triangle" color="#2E86C1" height={80} width={80} /></CardBody>
        </center>
      </Card>
    </div>
  }

  loadContactEmpty = () => {
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <center className="padding-top">
          <CardBody><h5><b>You haven't created any Contacts yet... </b></h5> </CardBody>
        </center>
      </Card>
    </div>
  }

  callAlertTimer = (visible) => {
    if (visible) {
      setTimeout(() => this.setState({ visible: false }), 1800)
    }
  }

  loadShowContact = (visible, contacts) => {
    if (this.props.color) { this.callAlertTimer(visible) }
    return <div className="animated fadeIn">
      <Card>
        {this.loadHeader()}
        <div><br />
          <h6>{visible && <Alert isOpen={visible} color={this.props.color ? this.props.color : ""}>{this.props.content}</Alert>}</h6>
          {contacts.filter(this.searchingFor(this.state.searchContact)).map((contact, key) => { return this.loadSingleContact(contact, key) })}
        </div>
      </Card>
    </div>
  }

  loadSingleContact = (contact, contactKey) => {
    return <ListGroup flush key={contactKey} className="animated fadeIn" >
      <ListGroupItem action >
        <Row onMouseEnter={() => this.hoverAccordion(contactKey)} onMouseLeave={() => this.hoverAccordion(contactKey)}>
          <Col onClick={() => { this.attachDropDown(contactKey) }}>
            <span >
              <FaUserCircle size={20} style={{ color: '#020e57' }} />{" "}&nbsp;
              <b className="text-link">
                {contact.name ? (contact.name.length > 20 ? contact.name.slice(0, 20) + "..." : contact.name)
                  : (contact.organization.length > 20 ? contact.organization.slice(0, 20) + "..." : contact.organization)}
              </b> &nbsp;
              {this.state.profileType > 1 ?
                <>
                  {/* <Attachments profileId={this.state.profileId} contactId={contact.id} getCount={true} /> */}
                  <FaPaperclip style={{ color: '#34aec1', marginTop: 0, marginLeft: 10 }} onClick={() => this.attachDropDown(contactKey, contact.id)} />
                </> : <FaCaretDown />}
            </span>
          </Col>
          <Col>{this.state.hoverAccord[contactKey] ? this.loadDropDown(contact) : ''}</Col>
        </Row>
        <Collapse isOpen={this.state.attachDropdown[contactKey]}>{this.showAttachments(contact.id, contact)}</Collapse>
      </ListGroupItem>
    </ListGroup>
  }

  loadDeleteContact = () => {
    return <DeleteModel danger={this.state.danger} headerMessage="Delete Contact" bodyMessage={this.state.contactField}
      toggleDanger={this.toggleDanger} delete={this.deleteContact} cancel={this.toggleDanger} >contact</DeleteModel>
  }
  // view update, delete 
  loadDropDown = (contact) => {
    return (<>
      <Attachments profileId={this.state.profileId} contactId={contact.id} getCount={true} />
      <span className="float-right" >
      <small><button style={{ backgroundColor: "transparent", borderColor: 'green', color: "green" }} onClick={() => { this.updateContact(contact) }}> EDIT </button></small> &nbsp;
      <small><button style={{ backgroundColor: "transparent", borderColor: 'red', color: "red" }} onClick={() => { this.setContactID(contact); this.toggleDanger(); }}> REMOVE </button></small>
    </span></>
    )
  }

  setContactID = contact => {
    let fieldName;
    if (contact.name) {
      fieldName = contact.name
    } else {
      fieldName = contact.organization
    }
    this.setState({ contactId: contact.id, contactField: fieldName });
  }

  showAttachments(contactId, contact) {
    return <div className="attachments">
      <span>
        <b>Email: </b>{contact.email}<br />
        <b>Phone: </b>{contact.phone}<br />
      </span>
      {this.state.profileType > 1 ?
        <Attachments contactId={contactId} profileId={this.state.profileId} />
        : ''}
    </div>
  }
}
export default Contacts;