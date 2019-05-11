import React, { Component } from "react";
import { Button, Row, Col, Card, CardBody, Alert, CardHeader, Collapse, Modal, ModalHeader, ModalBody, ModalFooter, 
         Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,InputGroupAddon,InputGroup,InputGroupText } from "reactstrap";
import CreateLabel from "./Createlabel";
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt, FaAngleDown,FaSearch, FaEllipsisV} from 'react-icons/fa';
import UpdateLabel from "./UpdateLabel";
import DeleteLabel from "./DeleteLabel";
import LabelApi from "../../services/LabelApi";
import Loader from 'react-loader-spinner'
import Store from "../../data/Store";

class Lables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      requiredLabel: [],
      id: 0,
      name: "",
      version:"",
      addContainer: false,
      createLabel: false,
      visible: false,
      updateLabel: false,
      deleteLabel: false,
      profileId: 0,
      accordion: [],
      danger: false,
      show: true,
      dropdownOpen: [],
      onHover: false,
      hoverAccord : [],
      spinner: false,
      search:''
    };
  }

  //this method get All Labels Related to that Profile
  componentDidMount = () =>{
    this.setProfileId();
  }

  setProfileId = async () =>{
    if (Store.getProfile().length !== 0) {
      var iterator = Store.getProfile().values()
      console.log(iterator)
      await this.setState({profileId:iterator.next().value.id});
      this.getLabels();
    }
  }

  getLabels = () =>{
    new LabelApi().getSublabels(this.successCall, this.errorCall,this.state.profileId);
  }

  //this method sets labels when api given successfull Response
  successCall = async lable => {
    if (lable === []) {
      this.setState({ labels : [] })
    } else {
      await this.setState({ labels : lable, spinner : true })
      this.loadCollapse();
    }
  }

  callCreateLabel = () => { this.setState({ createLabel: true })}

  callCreateLabel = () => { this.setState({ createLabel : true })}

  loadCollapse = () =>{
    this.state.labels.map(lables=>{return this.setState(prevState => ({
      accordion: [...prevState.accordion, false],
      hoverAccord : [...prevState.hoverAccord,false],
      dropdownOpen: [...prevState.dropdownOpen, false]}))});
  }  
  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({ danger : !this.state.danger });
  }
  //this method for the load Update Compoents
  updateLabel = (ulable) => {
    this.setState({ updateLabel : true, requiredLabel : ulable })
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
    this.getLabels(!this.state.show);
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
   const { labels, createLabel, updateLabel, id, deleteLabel, visible, profileId, requiredLabel, spinner, search} = this.state
    if (Store.getProfile().length===0) {
      return this.loadProfileNull()
    } else if (labels.length === 0 && !createLabel) {
      return <div>{labels.length === 0 && !createLabel && !spinner ? this.loadLoader() : this.loadNotLabel()}</div>
    } else if (createLabel) {
      return (<CreateLabel pid={profileId} label={labels} />)
    } else if (updateLabel) {
      return (<UpdateLabel pid={profileId} label={requiredLabel} lables={labels} />)
    } else if (deleteLabel) {
      return (<DeleteLabel id={id} pid={profileId} />)
    } else {
      return <div>{this.loadShowLabel( visible, labels, search)}{this.loadDeleteLabel()}</div>
    }
  }

  loadHeader = () => {
    return(
      <CardHeader>
        <strong>Label</strong>
        <Button color="success" className="float-right" onClick={this.callCreateLabel}> + Create Label </Button>
      </CardHeader>);
  }

  loadProfileNull = () =>{
    return(
      <div className="animated fadeIn">
        <Card>
          <center style={{paddingTop:'20px'}}>
            <CardBody><h5><b>You haven't created any Profile yet. So Please Create Profile. </b></h5><br/> </CardBody>
          </center>
        </Card>
      </div>)
  }

  //this method load the spinner
  loadLoader = () => {
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
  //this method call when if any profile not created.
  loadNotLabel = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <center style={{paddingTop:'20px'}}>
            <CardBody> <h5><b>You haven't created any Lables yet... </b></h5><br/> </CardBody>
          </center>
        </Card>
      </div>)
  }

  searchingFor = (term) =>{
    return function(x){
      return x.name.toLowerCase().includes(term.toLowerCase()) || !term
    }
  }

  //This Method Displays All the Labels of Corresponding Profile 
  loadShowLabel = (visible, labels, search) => {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader> 
          <Row form>
          <Col md={4}>
            <strong>Labels: {labels.length}</strong>
            </Col>
            <Col md={7} className="shadow p-0 mb-2 bg-white rounded">
            <InputGroup style={{}}>
            <Input type="search" className="float-right" style={{width:'20%'}} onChange={e => this.setState({ search : e.target.value })} placeholder="Search Labels..." /> 
            <InputGroupAddon addonType="append">
              <InputGroupText className="dark"><FaSearch /></InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          </Col>
          <Col md={1}>
          <Button color="primary" className="float-right" onClick={this.callCreateLabel}> + Add </Button>
          </Col>
          </Row>
          </CardHeader>
          <div style={{margin:30, paddingLeft:10}}>
            <h6><Alert isOpen={visible} color="danger">Unable to Process Request, Please Try again</Alert></h6>
            {labels.filter(this.searchingFor(search)).map((label, key) => {return this.loadSingleLable(label, key); })}
          </div>
        </Card>
      </div>)
  }

  //Shows the Single Label 
  loadSingleLable = (labels,ukey) =>{
    const styles = { marginRight : 6 }
    const penColor = { marginTop : 15, color : 'blue' }
    const trashColor = {  marginLeft : 10,  marginTop : 15,  color : 'red' }
    const ellipsisText1 = {  flex: 1,  display: 'flex',  alignItems: 'center',  marginLeft: '-10' }
    const ellipsisText2 = {  flex: 1,  width: '100px',  textOverflow: 'ellipsis',  overflow: 'hidden',  whiteSpace:'nowrap',  paddingLeft:10 }
    const subLabelList = {marginLeft:50, paddingTop:1, paddingBottom:0, paddingLeft:5, height:50};
    return (
      <div className="list-group" key={ukey}>
        <div className="list-group-item" style={{ padding: 7 }}>
          <Row>
            <Col>
              <div style={ellipsisText1}>
                <Avatar name={labels.name.charAt(0)} color={labels.color === "" ? "#000000" : labels.color} size="40" square={true} key={labels.id} />
                <div style={ellipsisText2}>&nbsp;&nbsp;{labels.name}
                  {Array.isArray(labels.subLabels) ? <span style={{ paddingLeft: 10 }}>
                    <FaAngleDown style={{ marginLeft: 1 }} onClick={() => this.toggleAccordion(ukey)} /></span> : ''}
                </div></div>
            </Col>
            <Col sm={2} md={2.5} lg={1} xl={1} >{this.loadDropDown(labels, ukey)}</Col>
          </Row>
          <Collapse isOpen={this.state.accordion[ukey]}>
            {Array.isArray(labels.subLabels) ? labels.subLabels.map((ulable, key) => {
              return (
                <span className="list-group-item" style={subLabelList} key={key}>
                  <Row>
                    <Col sm={{ size: 9 }}>
                      <span style={Object.assign(ellipsisText1, { paddingBotttom: 0 })}>
                        <Avatar name={ulable.name.charAt(0)} color={ulable.color} size="40" square={true} /> <div style={ellipsisText2}>{ulable.name}</div>
                      </span> </Col>
                    <Col >
                      <FaTrashAlt className="float-right" onClick={() => { this.setState({ id: ulable.id }); this.toggleDanger(); }} style={Object.assign({}, styles, trashColor)} />
                      <FaPen className="float-right" size={12} style={Object.assign({}, styles, penColor)} onClick={() => { this.updateLabel(ulable) }} />
                    </Col>
                  </Row>
                </span>)
            }) : ""}
          </Collapse>
        </div>
      </div>)
  }
  //this method call the delete model
  loadDeleteLabel = () => {
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
  loadDropDown = (labels, ukey) =>{
    return (
      <Dropdown isOpen={this.state.dropdownOpen[ukey]} style={{marginTop: 7}} toggle={() => { this.toggleDropDown(ukey); }} size="sm">
       <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[ukey]}>
         <FaEllipsisV style={{marginLeft:10, marginRight:10}}/>
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem onClick={() => { this.updateLabel(labels) }} > Update </DropdownItem>
         <DropdownItem onClick={() => { this.setState({ id: labels.id }); this.toggleDanger(); }}> Delete</DropdownItem>
       </DropdownMenu>
     </Dropdown>);
 }
}
export default Lables;