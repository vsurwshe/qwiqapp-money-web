import React, { Component } from "react";
import { Button, Row, Col, Card, CardBody, CardHeader, Alert, Input, InputGroup, InputGroupAddon, InputGroupText, ListGroupItem, ListGroup, Collapse } from "reactstrap";
import { FaPaperclip, FaUserCircle, FaSearch } from 'react-icons/fa';
import Loader from 'react-loader-spinner'
import UpdateContact from "./UpdateContact";
import DeleteContact from "./DeleteContact";
import CreateContact from "./CreateContact";
import LabelApi from "../../services/LabelApi";
import Attachments from "./attachments/Attachments";
import AddAttachment from "./attachments/AddAttachment";
import Store from "../../data/Store";
import { DeleteModel } from "../utility/DeleteModel";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import { ReUseComponents } from "../utility/ReUseComponents";
import ContactApi from "../../services/ContactApi";

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
      searchContact: ''
    };
    this.searchHandler = this.searchHandler.bind(this)
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    if (Store.getProfile() != null && Store.getProfile().length !== 0) {
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
  attachDropDown = (hKey, cId) => {
    const prevState = this.state.attachDropdown;
    const state = prevState.map((x, index) => hKey === index ? !x : false);
    if (cId !== undefined) {
      this.setState({ attachDropdown: state, contactId: cId });
    } else {
      this.setState({ attachDropdown: state });
    }
  }

  hoverAccordion = (hKey) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((x, index) => hKey === index ? !x : false);
    this.setState({ hoverAccord: state });
  }

  onHover = (e, hKey) => {
    this.setState({ onHover: true });
    this.hoverAccordion(hKey)
  }

  onHoverOff = (e, hKey) => {
    this.setState({ onHover: false });
    this.hoverAccordion(hKey)
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
    const { contacts, singleContact, createContact, updateContact, deleteContact, addAttachRequest, contactId, visible, profileId, spinner, labels } = this.state
    if (Store.getProfile() !== null && Store.getProfile().length !== 0) {
      if (contacts.length === 0 && !createContact) {
        return <div>{contacts.length === 0 && !createContact && !spinner ? this.loadSpinner() : this.loadContactEmpty()}</div>
      } else if (createContact) {
        return (<CreateContact profileId={profileId} lables={labels} />)
      } else if (updateContact) {
        return (<UpdateContact profileId={profileId} contact={singleContact} lables={labels} />)
      } else if (deleteContact) {
        return (<DeleteContact contactId={contactId} profileId={profileId} />)
      } else if (addAttachRequest) {
        return (<AddAttachment contacId={contactId} profileId={profileId} />)
      } else {
        return <div>{this.loadShowContact(visible, contacts)}{this.loadDeleteContact()}</div>
      }
    } else {
      return (<ProfileEmptyMessage />)
    }
  }

  searchHandler = (event) => {
    this.setState({ searchContact: event.target.value })
  }

  searchingFor(term) {
    return function (x) {
      return x.name.toLowerCase().includes(term.toLowerCase()) || !term
    }
  }

  loadHeader = () => {
    return (
      <CardHeader>
        <Row style={{ padding: "20px 20px 0px 20px" }}>
          <Col sm={3}>
            <strong style={{ fontSize: 24 }}>Contacts </strong>
          </Col>
          <Col >
            {this.state.contacts.length !== 0 &&
              <InputGroup >
                <Input type="search" className="float-right" onChange={this.searchHandler} value={this.state.searchContact} placeholder="Search Contacts..." />
                <InputGroupAddon addonType="append"><InputGroupText className="dark"><FaSearch /></InputGroupText></InputGroupAddon>
              </InputGroup>
            }
          </Col>
          <Col sm={2}>
            <Button color="success" className="float-right" onClick={this.callCreateContact}> + ADD </Button>
          </Col>
        </Row>
      </CardHeader>
    )
  }

  loadSpinner = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center style={{ paddingTop: '20px' }}>
            <CardBody><Loader type="Ball-Triangle" color="#2E86C1" height={80} width={80} /></CardBody>
          </center>
        </Card>
      </div>)
  }

  loadContactEmpty = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center style={{ paddingTop: '20px' }}>
            <CardBody><h5><b>You haven't created any Contacts yet... </b></h5> </CardBody>
          </center>
        </Card>
      </div>)
  }

  callAlertTimer() {
    if (this.state.visible) {
      setTimeout(() => this.setState({ visible: false }), 1800)
    }
  }

  loadShowContact = (visible, contacts) => {
    if (this.props.color !== undefined) {
      this.callAlertTimer()
    }
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <div style={{ marginBottom: 20 }}>
            <h6><Alert isOpen={visible} color={this.props.color === undefined ? '' : this.props.color}>{this.props.content}</Alert></h6>
            {contacts.filter(this.searchingFor(this.state.searchContact)).map((contact, key) => { return this.loadSingleContact(contact, key) })}
          </div>
        </Card>
      </div>)
  }

  loadSingleContact = (contact, contactKey) => {
    const styles = { marginTop: 4 }
    return (
      <ListGroup flush key={contactKey} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, contactKey)} onPointerLeave={(e) => this.onHoverOff(e, contactKey)}>
        <ListGroupItem action >
          <Row>
            <Col onClick={() => { this.attachDropDown(contactKey) }}>
              {this.displayName(contact, styles)}
              <FaPaperclip color="#34aec1" style={{ marginTop: 5, marginLeft: 10 }} size={17} onClick={() => this.attachDropDown(contactKey, contact.id)} />
            </Col>
            <Col lg={1} sm={1} md={1} xl={1} >{this.state.onHover && this.state.hoverAccord[contactKey] ? this.loadDropDown(contact, contactKey, styles) : ''}</Col>
          </Row>
          <Collapse isOpen={this.state.attachDropdown[contactKey]}>{this.showAttachments(contact.id, contact)}</Collapse>
        </ListGroupItem>
      </ListGroup>)
  }

  displayName = (contact, styles) => {
    return (
      <span style={{ styles }} ><FaUserCircle size={20} style={{ color: '#020e57' }} />{" "}&nbsp;
        <b style={{ color: '#000000' }}>{contact.name.length > 20 ? contact.name.slice(0, 20) + "..." : contact.name}</b>
        <Attachments profileId={this.state.profileId} contactId={contact.id} getCount={true} />
      </span>)
  }

  loadDeleteContact = () => {
    return (<DeleteModel danger={this.state.danger} headerMessage="Delete Contact" bodyMessage="Are You Sure Want to Delete Contact?"
      toggleDanger={this.toggleDanger} delete={this.deleteContact} cancel={this.toggleDanger} />)
  }

  loadDropDown = (contact, contactKey) => {
    return ReUseComponents.loadDropDown(contact, contactKey, this.state.dropdownOpen[contactKey], this.toggleDropDown, this.setContactID, this.toggleDanger, this.updateContact)
  }

  setContactID = contact => {
    this.setState({ contactId: contact.id });
  }

  showAttachments(contactId, contact) {
    return (
      <div style={{ paddingLeft: 29, paddingTop: 10 }}>
        <span style={{ color: '#000000' }}>
          <b>Email: </b>{contact.email}<br />
          <b>Phone: </b>{contact.phone}<br />
        </span>
        <Attachments contactId={contactId} profileId={this.state.profileId} />
      </div>)
  }
}
export default Contacts;