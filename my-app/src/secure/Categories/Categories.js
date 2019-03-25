import React, { Component } from "react";
import { Card, CardHeader, CardBody, Button, Col, Row, Container, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Collapse} from 'reactstrap';
import Avatar from 'react-avatar';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import CategoryApi from "../../services/CategoryApi";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      pId: 9,
      cId:0,
      requiredCategory:[],
      createCategory:false,
      updateCategory:false,
      deleteCategory:false,
      viewRequest: false,
      toggle :false
    };
  }

  componentDidMount() {
    new CategoryApi().getCategories(this.successCall, this.errorCall, this.state.pId);
  }

  successCall = json => {
      this.setState({ categories: json })
    }

  errorCall = err => { this.setState({ visible: true }) }

  callAddCategory = () =>{
      this.setState({ createCategory:true  });
  }

  updateCategory = (category) =>{
    this.setState({ updateCategory: true, requiredCategory : category })
  }

  setDeleteCategoryId = (category) =>{
    this.setState({ requiredCategory : category, cId: this.state.requiredCategory.id })
  }
  deleteCategory = () => {
    this.setState({ deleteCategory: true })
  };

  toggleDanger = () => {
    this.setState({
      danger: !this.state.danger,
    });
  }
  
  // toggle = () =>{
  //    this.setState({ toggle:!this.state.toggle  });
  // }

  loadDeleteCategory = () => {
    return (
    <Modal isOpen={this.state.danger} toggle={this.toggleDanger}
      className={'modal-danger '}>
      <ModalHeader toggle={this.toggleDanger}>Delete Category</ModalHeader>
      <ModalBody>
        Are you Sure you want to Delete This Category ?
        </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={this.deleteCategory}>Delete</Button>
        <Button color="secondary" onClick={this.toggleDanger}>Cancel</Button>
      </ModalFooter>
    </Modal>)
  }
  
  render() {
      const {categories,requiredCategory,createCategory,updateCategory,deleteCategory,pId,cId} = this.state;
      if(createCategory){
          return <Container><AddCategory category = {categories} id={pId}/></Container>
      }
      else if(updateCategory){
          console.log(requiredCategory)
          return <Container><EditCategory category={requiredCategory} id={pId}/></Container>
      }
      else if(deleteCategory){
        return <Container><DeleteCategory cid={cId} pid ={pId}/></Container>
      }
      else{
        return(
          <div className="animated fadeIn">
            <Card>
              <CardHeader><strong>Category</strong></CardHeader>
              <CardBody>
                <h6>
                <Alert isOpen={false} color="danger">Internal Server Error</Alert>
                </h6>
                <Col sm="6">
                <Row>
                    <CardBody>
                        {categories.map(category => {
                        return (
                            <Container>
                                <Avatar name={category.name.charAt(0)} size="40" round={true} onClick={this.toggle} /> {category.name}
                                <FaTrashAlt  className="float-right" style={{ marginLeft: "20px", color: 'red', marginTop: "15px"}} onClick={() => { this.setState({ cId: category.id }); this.toggleDanger() }}/>
                                <FaPen size={20} className="float-right" style={{ marginLeft: "20px", color: '#4385ef', marginTop: "15px" }} onClick={() => { this.updateCategory(category) }} />
                                <hr />
                                <Collapse isOpen={this.state.toggle}>
                                   <Card>
                                     {/* {category.map(sub => <p>{sub}</p>)} */}
                                     <p>Sub Categories</p>
                                   </Card>
                                </Collapse>
                            </Container>);
                        })}
                        <p><Avatar className="float-right" color="blue" name= "+" size="50" round={true} onClick={this.callAddCategory}/></p>
                    </CardBody>
                </Row>
                </Col>
            </CardBody>
          </Card>
          {this.loadDeleteCategory()}
        </div>
      )}
  }   
}

export default Categories