import React, { Component } from "react";
import { Button,Row, Col, Card, CardBody, Alert, CardHeader,Collapse,Modal, ModalHeader, ModalBody, ModalFooter,Dropdown,DropdownToggle,DropdownMenu,DropdownItem,ListGroupItem,ListGroup} from "reactstrap";
import CreateLabel from "./Createlabel";
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt ,FaAngleDown,FaEllipsisV} from 'react-icons/fa';
import UpdateLabel from "./UpdateLabel";
import DeleteLabel from "./DeleteLabel";
import LabelApi from "../../services/LabelApi";
import ProfileApi from "../../services/ProfileApi";
import Loader from 'react-loader-spinner'
class Lables extends Component {
  isUnmount = false;
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      collapse: [],
      relable:[],
      id: 0,
      name: "",
      version:"",
      addContainer: false,
      createLabel: false,
      viewLabelRequest: false,
      visible: false,
      updateLabel: false,
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
  //this method get All Labels Realted That Profile
  componentDidMount=()=> {
    this.isUnmount = true;
    new ProfileApi().getProfiles(this.successProfileid,this.errorCall);
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }
  //this mwthod get the dimessions of screen
  resize(){
    if(this.isUnmount){ this.setState({screenWidth:window.innerWidth}) }
  }
  componentWillUnmount = () => {
    this.isUnmount = false;
  }
  //this method seting Profile id 
  successProfileid=json=>{
    if (json === []) { this.setState({ profileId:'',spinner:false })}
    else {
      const iterator = json.values();
      for (const value of iterator) {this.setProfileId(value.id)}
    }
  }
  //this method set Profile Id
  setProfileId=(id)=>{
    this.setState({profileId:id})
    this.getLabels();
  }
  //this method seting labels when api given successfull Response
  successCall = json => {
    if (json === "Deleted Successfully") {
      this.setState({ labels: [0] })
    } else {
      this.setState({ labels: json, spinner:true })
      this.loadCollapse();
    }
  };
  errorCall = err => { this.setState({ visible: true }) }

  callCreateLabel = () => { this.setState({ createLabel: true })}

  loadCollapse=()=>{
    this.state.labels.map(lables=>{return this.setState(prevState => ({accordion: [...prevState.accordion, false],
    hoverAccord : [...prevState.hoverAccord,false],
    dropdownOpen: [...prevState.dropdownOpen, false]}))});
  }  
  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({danger: !this.state.danger});
  }
  //this method for the load Update Compoents
  updateLabel = (ulable) => {
    this.setState({ updateLabel: true,relable:ulable })
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
  //this is geting labels
  getLabels=()=>{
    new LabelApi().getSublabels(this.successCall, this.errorCall,this.state.profileId);
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
   const { labels,viewLabelRequest, createLabel,updateLabel,id,deleteLabel, visible,profileId,relable,spinner} = this.state
    if (labels.length === 0 && !createLabel ) {
      return <div>{labels.length === 0 && !createLabel && !spinner ? this.loadLoader() :this.loadNotLabel()}</div>
    } else if (createLabel) {
      return ( <CreateLabel pid={profileId} />)
    }else if (updateLabel) {
      return(<UpdateLabel pid={profileId} label={relable} lables={labels} />)
    }else if(deleteLabel) {
      return ( <DeleteLabel id={id}  pid={profileId}/> )
    }else{
      return <div>{this.loadShowLabel(viewLabelRequest, visible, labels)}{this.loadDeleteLabel()}</div>
    }
  }
  //this method load the spinner
  loadLoader=()=>{
   return( <div className="animated fadeIn">
   <Card>
     <CardHeader>
       <strong>Total Labels: {this.state.labels.length}</strong>
     </CardHeader>
     <center style={{paddingTop:'20px'}}>
       <CardBody>
       <Loader type="TailSpin" color="#2E86C1" height={60} width={60}/>
       </CardBody>
     </center>
   </Card>
 </div>)
  }
  //this method call when if any profile not created.
  loadNotLabel = () => {
    return (<div className="animated fadeIn">
      <Card>
        <CardHeader>
          <strong>Label</strong>
        </CardHeader>
        <center style={{paddingTop:'20px'}}>
          <CardBody>
              <h5><b>You haven't created any Lables yet... </b></h5><br/>
            <Button color="info" onClick={this.callCreateLabel}> Create Label </Button>
          </CardBody>
        </center>
      </Card>
    </div>)
  }
  //if one or more profile is there then this method Call
  loadShowLabel = (visible, labels) => {
     return (<div className="animated fadeIn">
      <Card>
        <CardHeader><strong>Labels</strong><Button color="primary" className="float-right" onClick={this.callCreateLabel}> + ADD LABEL</Button></CardHeader>
        <div style={{margin:30, paddingLeft:100}}>
          <h6><Alert isOpen={visible} color="danger">Internal Server Error</Alert></h6>
          {this.state.labels.map((label, key) => {return this.loadSingleLable(this.state.labels[key], key); })}</div>
      </Card>
    </div>)
    
  }
  //Show the Single Label 
  loadSingleLable=(labels,ukey)=>{
    const styles={
      margin: "6px"
    }
    const penColor = {
      marginTop: "15px",
      color: 'blue'
    }
    const trashColor = {
      marginLeft: "10px",
      marginTop: "15px",
      color: 'red'
    }
    const ellipsisText1 = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
      marginLeft: '-10'
    }
    const ellipsisText2 = {
      flex: 1,
      width: '100px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace:'nowrap',
      paddingLeft:10
    }
    return (
    
      <ListGroup flush key={ukey} className="animated fadeIn" onPointerEnter={(e) => this.onHover(e, ukey)} onPointerLeave={(e) => this.onHoverOff(e, ukey)}>
        <ListGroupItem action>
          <Row>
           <Avatar name={labels.name.charAt(0)} color={labels.color === "" ? "#000000" : labels.color} size="40" square={true} key={labels.id} /> 
           <div style={ellipsisText1}><div style={ellipsisText2}>&nbsp;&nbsp;{labels.name}</div></div>
          {Array.isArray(labels.subLabels) ? <span style={{ paddingLeft: 10 }}><FaAngleDown style={{marginTop:12}} onClick={() => this.toggleAccordion(ukey)} /></span> : ''}
          {this.state.onHover && this.state.hoverAccord[ukey] ? this.loadDropDown(labels, ukey, styles) : ''}
          </Row>
          <Collapse isOpen={this.state.accordion[ukey]}>
            {Array.isArray(labels.subLabels) ? labels.subLabels.map(ulable => {
              return (<ListGroupItem tag="a" style={{ paddingLeft: 55 }} className="justify-content-between" key={ulable.id}>
                <Row>
                  <Col sm={{ size: 9 }}>
                    <div style={ellipsisText1}>
                      <Avatar name={ulable.name.charAt(0)} color={ulable.color} size="40" square={true} />
                      <div style={ellipsisText2}>{ulable.name}</div>
                      <FaPen className="float-right" size={12} style={Object.assign({}, styles, penColor)} onClick={() => { this.updateLabel(ulable) }} />
                      <FaTrashAlt className="float-right" onClick={() => { this.setState({ id: ulable.id }); this.toggleDanger(); }} style={Object.assign({}, styles, trashColor)} />
                    </div>
                  </Col>
                </Row>
              </ListGroupItem>)
            }) : ""}
          </Collapse>
        </ListGroupItem>
      </ListGroup>)
  }
  //this method display name after avtar for large string
  displayName=(name,styles)=>{
    const {screenWidth}=this.state;
    return(<span style={{styles}}>{screenWidth<=390 ? (name.length>15? name.slice(0, 15)+"..." : name) : (screenWidth <= 550 ? (name.length>35? name.slice(0, 35)+"..." : name) : (screenWidth <= 700 ? (name.length>55? name.slice(0, 55)+"..." : name) : (screenWidth <= 900 ? (name.length>70? name.slice(0, 80)+"..." : name) : (screenWidth <= 1100 ? (name.length>90? name.slice(0, 110)+"..." : name) : (name.length>=130? name.slice(0, 130)+"..." : name) ) ) ) ) }</span>)
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
  loadDropDown = (labels, ukey, styles) =>{
    return (
      <Dropdown isOpen={this.state.dropdownOpen[ukey]} style={{marginTop: 7}} toggle={() => { this.toggleDropDown(ukey); }} size="sm">
       <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[ukey]}>
         <FaEllipsisV style={styles}/>
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem onClick={() => { this.updateLabel(labels) }}> Update </DropdownItem>
         <DropdownItem onClick={() => { this.setState({ id: labels.id }); this.toggleDanger(); }}> Delete</DropdownItem>
       </DropdownMenu>
     </Dropdown>);
 }
}
export default Lables;