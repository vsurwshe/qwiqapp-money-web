import React, { Component } from "react";
import { Container, Button, Card, CardBody, Col, Row, Alert, CardHeader,Collapse,Label,Modal, ModalHeader, ModalBody, ModalFooter,FormGroup } from "reactstrap";
import CreateLabel from "./Createlabel";
import Avatar from 'react-avatar';
import { AppSwitch } from '@coreui/react'
import { FaPen, FaTrashAlt ,FaPlusCircle } from 'react-icons/fa';
import UpdateLabel from "./UpdateLabel";
import DeleteLabel from "./DeleteLabel";
import LabelApi from "../../services/LabelApi";

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
      accordion: [],
      danger: false,
      show:false,
    };
  }
  //this method get All Labels Realted That Profile
  componentDidMount=()=> {
      new LabelApi().getSublabels(this.successCall, this.errorCall,11,this.state.show);
  }
  //this method seting labels when api given successfull Response
  successCall = json => {
    if (json === "Deleted Successfully") {
      this.setState({ labels: [0] })
    }else {
      this.setState({ labels: json })
      this.loadCollapse();}
  };

  errorCall = err => { this.setState({ visible: true }) }

  callCreateLabel = () => { this.setState({ createLabel: true })}

  loadCollapse=()=>{
    this.state.labels.map(lables=>{return this.setState(prevState => ({accordion: [...prevState.accordion, false]}))});
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
    console.log(tab);
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({accordion: state});
  }
  //this method use for showing sub-lables when swtich is yes
  toggleSublabel=()=>{
    new LabelApi().getSublabels(this.successCall, this.errorCall,11,true);
  }
 

  render() {
   const { labels,viewLabelRequest, createLabel,updateLabel,id,name,notes,version,deleteLabel, visible} = this.state
    if (labels.length === 0 && !createLabel) {
      return <div>{this.loadNotLabelProfile()}</div>
    } else if (createLabel) {
      return (<Container> <CreateLabel /> </Container>)
    }else if (updateLabel) {
      return(<UpdateLabel id={id} name={name} notes={notes} version={version} />)
    }else if(deleteLabel) {
      return ( <DeleteLabel id={id} /> )
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
          <Col sm="6">
            <Row>
              Show with Sub-Labels: <AppSwitch  className={'mx-1'} variant={'pill'} color={'danger'} onClick={this.toggleSublabel} label dataOn={'Yes'} dataOff={'No'}  />
              <Container >
                {this.state.labels.map((labels, key) => {
                  return this.loadSingleLable(this.state.labels[key],key);
                  //  return <ViewLabel key={labels.id} labels={this.state.labels[key]} />
                 })}
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
    return (<div className="animated fadeIn">
      <Avatar name={labels.name.charAt(0)} size="40" round={true} onClick={() => this.toggleAccordion(ukey)} key={labels.id} /> {labels.name}
      <FaTrashAlt onClick={() => { this.setState({ id: labels.id }); this.toggleDanger(); }} className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px" }} />
      <FaPen size={20} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={() => { this.updateLabel(labels.id, labels.name, labels.notes, labels.version) }} />
      <hr />
      <Container>
        <Collapse isOpen={this.state.accordion[ukey]}>
       
        { Array.isArray(labels.subLabels) ? labels.subLabels.map(lable=>{
            return( <div><Avatar name={lable.name.charAt(0)} size="40" round={true} key={labels.id} />&nbsp;&nbsp;{lable.name}</div>)
          }) :""} 
     
         </Collapse>
      </Container>
    </div>)
  }
  //this method call the delete model
  loadDeleteLabel = () => {
    return (
     <Modal isOpen={this.state.danger} toggle={this.toggleDanger} backdrop={false}>
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

}
export default Lables;