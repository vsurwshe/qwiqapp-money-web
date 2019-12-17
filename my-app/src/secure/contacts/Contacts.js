import React, { Component } from "react";
import { Button, Row, Col, Card, CardBody, CardHeader, Alert, Input, InputGroup, InputGroupAddon, InputGroupText, ListGroupItem, ListGroup, Collapse } from "reactstrap";
import { FaPaperclip, FaUserCircle, FaSearch, FaCaretDown } from 'react-icons/fa';
import DeleteContact from "./DeleteContact";
import LabelApi from "../../services/LabelApi";
import ContactAttachments from "./contactAttachments/ContactAttachments";
import AddAttachment from "./contactAttachments/AddAttachment";
import Store from "../../data/Store";
import { DeleteModel } from "../utility/DeleteModel";
import { ProfileEmptyMessage } from "../utility/ProfileEmptyMessage";
import ContactApi from "../../services/ContactApi";
import ContactForm from "./ContactForm";
import { profileFeature } from "../../data/GlobalKeys";
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
      visible: props.visible,
      accordion: [],
      dropdownOpen: [],
      attachDropdown: [],
      hoverAccord: [],
      searchContact: ''
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  setProfileId = async () => {
    const profile = Store.getProfile();
    if (profile) {
      await this.setState({ profileId: profile.id, profileFeaturesData: profile.features });
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
  // update specific contact
  updateContact = (singleContact) => {
    this.setState({ updateContact: true, singleContact })
  };

  deleteContact = () => {
    this.setState({ deleteContact: true })
  };

  toggleDanger = () => {
    this.setState({ danger: !this.state.danger });
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

  render() {
    const { contacts, singleContact, createContact, updateContact, deleteContact, addAttachRequest, contactId, profileId, spinner, labels, danger } = this.state
    if (profileId) {
      if (!contacts.length && !createContact) {
        return <div>{ !spinner ? this.loadSpinner() : this.loadContactEmpty()}</div>
      } else if (createContact) {
        return <ContactForm profileId={profileId} lables={labels} />
      } else if (updateContact) {
        return <ContactForm profileId={profileId} contact={singleContact} lables={labels} />
      } else if (deleteContact) {
        return <DeleteContact contactId={contactId} profileId={profileId} />
      } else if (addAttachRequest) {
        return <AddAttachment contacId={contactId} profileId={profileId} />
      } else {
        return <div>{danger && this.loadDeleteContact()} {this.loadShowContact()}</div>
      }
    } else {
      return <ProfileEmptyMessage />
    }
  }

  searchHandler = (event) => {
    this.setState({ searchContact: event.target.value })
  }

  searchingFor(term) {
    return function (contact) {
      return (contact.name.toLowerCase() + contact.organization.toLowerCase()).includes(term.toLowerCase()) || !term
    }
  }

  loadHeader = () => {
    return <CardHeader>
      <Row>
        <Col sm={3} className="marigin-top" ><strong >Contacts </strong></Col>
        <Col>
          {this.state.contacts.length !== 0 && <InputGroup >
            <Input type="search" className="float-right" onChange={(e) => {this.searchHandler(e)}} value={this.state.searchContact} placeholder="Search Contacts..." />
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
          <CardBody>
            <div className="text-primary spinner-size" role="status">
              <span className="sr-only">Loading...</span>
            </div></CardBody>
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

  loadShowContact = () => {
    const { visible, contacts } = this.state;
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
    const {profileFeaturesData} = this.state
    let featureAttachment = profileFeaturesData && profileFeaturesData.includes(profileFeature.ATTACHMENTS);
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
              {featureAttachment ?
                <>
                  <FaPaperclip className="faPaperclip" onClick={() => this.attachDropDown(contactKey, contact.id)} />
                </> : <FaCaretDown />}
            </span>
          </Col>
          <Col>{this.state.hoverAccord[contactKey] ? this.loadDropDown(contact, featureAttachment) : ''}</Col>
        </Row>
        <Collapse isOpen={this.state.attachDropdown[contactKey]}>{this.showAttachments(contact.id, contact, featureAttachment)}</Collapse>
      </ListGroupItem>
    </ListGroup>
  }

  loadDeleteContact = () => {
    return <DeleteModel danger={this.state.danger} headerMessage="Delete Contact" bodyMessage={this.state.contactField}
      toggleDanger={this.toggleDanger} delete={this.deleteContact} cancel={this.toggleDanger} >contact</DeleteModel>
  }
  // view update, delete 
  loadDropDown = (contact, featureAttachment) => {
    return (<>
      {featureAttachment && <ContactAttachments profileId={this.state.profileId} contactId={contact.id} getCount={true} />}
      <span className="float-right" >
        <small><button className="contact-edit transparent-background" onClick={() => { this.updateContact(contact) }}> EDIT </button></small> &nbsp;
        <small><button className="contact-remove transparent-background" onClick={() => { this.setContactID(contact); this.toggleDanger(); }}> REMOVE </button></small>
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

  showAttachments(contactId, contact, featureAttachment) {
    return <div className="attachments">
      <span>
        <b>Email: </b>{contact.email}<br />
        <b>Phone: </b>{contact.phone}<br />
      </span>
      {featureAttachment && <ContactAttachments contactId={contactId} profileId={this.state.profileId} />}
    </div>
  }
}
export default Contacts;