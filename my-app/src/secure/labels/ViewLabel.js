import React, { Component } from 'react';
import Avatar from 'react-avatar';
import UpdateLabel from "./UpdateLabel";
import DeleteLabel from "./DeleteLabel";
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { Container,Collapse,Modal, ModalHeader, ModalBody, ModalFooter,Button,Label } from 'reactstrap';
export class ViewLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      viewLabelRequest:false,
      id: 0,
      name: "",
      version:"",
      danger: false,
      updateLabel: false,
      deleteLabel: false,
    };
  }
  //This Toggel For Collesping
  toggle=()=> {
    this.setState({ collapse: !this.state.collapse });
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
  render() {
      const {id,name,notes,version,subLabels}=this.props.labels;
      const {updateLabel,deleteLabel}=this.state;
     if (updateLabel) {
        return (<UpdateLabel id={id} name={name} notes={notes} version={version} />)
      } else if (deleteLabel) {
        return ( <DeleteLabel id={id} /> )
      }else{
        return<div>{this.loadSingleLable(id,name,notes,version,subLabels)}{this.loadDeleteLabel()}</div>}
  }
  //this method for loading Single
  loadSingleLable=(id,name,notes,version,subLabels)=>{
    return(
    <div className="animated fadeIn">
      <Avatar name={name.charAt(0)} size="40" round={true} onClick={this.toggle} key={id} /> {name}
      <FaTrashAlt onClick={() => {this.setState({ id: id }); this.toggleDanger();  }} className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px" }} />
      <FaPen size={20} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={() => {this.updateLabel(id, name, notes, version) }} />
      <hr />
      <Container>
        <Collapse isOpen={this.state.collapse}>
              <b>
              <Label>Label id</Label> :{id} <br/>
              <Label>Label name</Label> :{name} <br/>
              <Label>Label notes</Label> :{notes} <br/>
              <Label>Label version</Label> :{version} <br/>
              </b>
        </Collapse>
      </Container>
    </div>)
  }
  //this method call the delete model
  loadDeleteLabel = () => {
   return (<Modal isOpen={this.state.danger} toggle={this.toggleDanger} backdrop={false}>
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

export default ViewLabel;