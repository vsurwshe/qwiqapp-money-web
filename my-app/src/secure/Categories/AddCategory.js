import React, { Component } from "react";
import { Label, Button, Input, Card, CardHeader, FormGroup, Collapse,Col, Alert } from "reactstrap";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
import Categories from "./Categories";
class AddCategory extends Component {
  constructor(props){
    super(props)
    this.state={
      profileId:props.id,
      categories : props.category,
      parentId: 0,
      name: '',
      userToken: '',
      color: '',
      code:'',
      type:'Expense_Payable',
      alertColor:'',
      content: '',
      collapse:false,
      categoryCreated: false,
    }
  }

  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ userToken: Store.getAppUserAccessToken() });
  }

  handleSubmit = e => {
    e.preventDefault();
    const data = { name: this.state.name, color: this.state.color,code: this.state.code, parentId: this.state.parentId };
    new CategoryApi().createCategory(this.successCall, this.errorCall, this.state.profileId, data);
  };

  successCall = () =>{
    this.callAlertTimer('success','Category Added !')
  }

  errorCall = err => {
    this.callAlertTimer('danger','Category Not Added')
  };

  toggle =() =>{
    this.setState({ collapse: !this.state.collapse  });
  }

  callAlertTimer = (alertColor,content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ categoryCreated: true});
    }, 2000);
  };
 
  render() {
    return(
    <div>{this.state.categoryCreated ? <Categories/> :this.loadAddingCategory()}</div>
    )
  }

  loadAddingCategory=()=>{
    const align = { textAlign: "left" }
    const {name,color,alertColor,content}=this.state
    return(
          <Card >
            <CardHeader><strong>Category</strong></CardHeader><br/>
             <center>
                <h5><b>CREATE CATEGORY</b></h5><br/>
                <FormGroup style={{ align }}>
                  <Col sm="12" md={{ size: 3, offset: 1.5 }}>
                    <Alert color={alertColor} >{content}</Alert>
                    <Input name="name" type="text" placeholder="Category Name" value={name} onChange={e => this.handleInput(e)}  /><br/>
                    <Input name="color" type="color" list="colors" value={color} onChange={e => { this.handleInput(e) }}/><br/>
                    <Input name="check" type="checkbox" onClick={this.toggle}/><Label for="mark">Nest Category Under</Label><br/>
                    <Collapse isOpen={this.state.collapse}>
                      <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e)}}>
                        {this.state.categories.map((category) => { return <option value={category.id}>{category.name}</option> })}
                      </Input>
                    </Collapse>
                  </Col>
                </FormGroup>
                  {/* <FormGroup style={align}>
                    <Label for="type">Type </Label>
                    <Input name="type" type="select" onChange={e => { this.handleInput(e)}}>
                        <option style={{backgroundColor:'#EF5753'}}>Expense_Payable</option>
                        <option>Income_Receivable</option>
                    </Input>
                  </FormGroup> */}
                  {/* </Row>
                  </Col> */}
              <center>
                <Button color="info" onClick={this.handleSubmit}> Add </Button>&nbsp;&nbsp;&nbsp;
                <a href="/listCategories" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a><br/><br/>
              </center>
            </center>
          </Card>)
  }
}

export default AddCategory;
