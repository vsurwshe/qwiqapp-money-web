import React, { Component } from "react";
import { Container, Button, Card, CardBody, Col, Row, Alert, CardHeader,Collapse,Label,Modal, ModalHeader, ModalBody, ModalFooter,Dropdown,DropdownToggle,DropdownMenu,DropdownItem} from "reactstrap";
import CreateLabel from "./Createlabel";
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt ,FaPlusCircle ,FaAngleDown,FaEllipsisV} from 'react-icons/fa';
import UpdateLabel from "./UpdateLabel";
import DeleteLabel from "./DeleteLabel";
import LabelApi from "../../services/LabelApi";
import ProfileApi from "../../services/ProfileApi";
class Lables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      collapse: [],
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
      dropdownOpen:[]
    };
  }
  //this method get All Labels Realted That Profile
  componentDidMount=()=> {
         new ProfileApi().getProfiles(this.successProfileid,this.errorCall);
  }
  //this method seting Profile id 
  successProfileid=json=>{
    console.log("successProfileid ",json)
    if (json === []) { this.setState({ profileId:'' })}
    else {
      const iterator = json.values();
      for (const value of iterator) {this.setProfileId(value.id)}
    }
  }
  //this method set Profile Id
  setProfileId=(id)=>{
    // console.log(id);
    this.setState({profileId:id})
    this.getLabels();
  }
  //this method seting labels when api given successfull Response
  successCall = json => {
    if (json === "Deleted Successfully") {
      this.setState({ labels: [0] })
    } else {
      this.setState({ labels: json })
      this.loadCollapse();
    }
  };
  errorCall = err => { this.setState({ visible: true }) }
  callCreateLabel = () => { this.setState({ createLabel: true })}
  loadCollapse=()=>{
     this.state.labels.map(lables=>{return this.setState(prevState => ({accordion: [...prevState.accordion, false],dropdownOpen: [...prevState.dropdownOpen, false]}))});
  }
  //this toggle for Delete Model
  toggleDanger = () => {
    this.setState({danger: !this.state.danger});
  }
  //this method for the load Update Compoents
  updateLabel = (lid, lName,lNotes,lversion) => {
   this.setState({ updateLabel: true, id: lid, name: lName, notes:lNotes,version:lversion })
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
  

  render() {
   const { labels,viewLabelRequest, createLabel,updateLabel,id,name,notes,version,deleteLabel, visible,profileId} = this.state
    if (labels.length === 0 && !createLabel) {
      return <div>{this.loadNotLabelProfile()}</div>
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
  //this method call when if any profile not created.
  loadNotLabelProfile = () => {
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
        <CardHeader><strong>Label</strong></CardHeader>
        <CardBody>
          <h6><Alert isOpen={visible} color="danger">Internal Server Error</Alert></h6>
          <Col sm="12" md={{ size: 5, offset: 4 }}>
            <Row >
              <Container >
                {this.state.labels.map((label, key) => {return this.loadSingleLable(this.state.labels[key], key); })}
                <Label>Create More Label </Label> &nbsp;&nbsp;&nbsp; <FaPlusCircle size={30} onClick={this.callCreateLabel} />
              </Container>
            </Row>
          </Col>
        </CardBody>
      </Card>
    </div>)
    
  }
  //Show the Single Label 
  loadSingleLable=(labels,ukey)=>{
      return (<div key={ukey} className="animated fadeIn" onMouseEnter={()=>{console.log(ukey)}} onMouseLeave={()=>{console.clear()}}> 
      <Avatar name={labels.name.charAt(0)} color={labels.color===""? "#000000":labels.color} size="40" square={true} key={labels.id} /> {labels.name}
      {this.loadDropDown(labels,ukey)}
      {Array.isArray(labels.subLabels) ? <FaAngleDown size={20} style={{ float: "right" }} onClick={() => this.toggleAccordion(ukey)} /> : ''}
      <div style={{ padding: 5 }} />
      <Collapse isOpen={this.state.accordion[ukey]}>
        {Array.isArray(labels.subLabels) ? labels.subLabels.map(ulable => {
          return (<div key={ulable.id}>
            <span style={{paddingLeft: 40}} ></span><Avatar name={ulable.name.charAt(0)} color={ulable.color} size="25" squre={true} />&nbsp;&nbsp;{ulable.name}
            <FaTrashAlt onClick={() => { this.setState({ id: ulable.id }); this.toggleDanger(); }} className="float-right" style={{ color: 'red', float: "right", marginRight: 15 }} />
            <FaPen size={12} className="float-right" style={{ color: '#4385ef', float: "right", marginRight: 15 }} onClick={() => { this.updateLabel(ulable) }} />
            <hr /></div>)
        }) : ""}
      </Collapse>
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
 loadDropDown=(labels,ukey)=>{
   return (<Dropdown isOpen={this.state.dropdownOpen[ukey]} style={{ float: "right" }} toggle={() => { this.toggleDropDown(ukey); }} size="sm">
       <DropdownToggle tag="span" onClick={() => { this.toggleDropDown(ukey); }} data-toggle="dropdown" aria-expanded={this.state.dropdownOpen[ukey]}>
         <FaEllipsisV />
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem onClick={() => { this.updateLabel(labels) }}> Update </DropdownItem>
         <DropdownItem onClick={() => { this.setState({ id: labels.id }); this.toggleDanger(); }}> Delete</DropdownItem>
       </DropdownMenu>
     </Dropdown>);
 }
}
export default Lables;