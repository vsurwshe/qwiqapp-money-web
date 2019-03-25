import React, { Component } from "react";
import { Label, Button, Input, Card, CardBody, CardHeader,FormGroup,CardTitle,Dropdown,DropdownItem,DropdownMenu,DropdownToggle,Collapse } from "reactstrap";
import Store from "../../data/Store";
import CategoryApi from "../../services/CategoryApi";
class AddCategory extends Component {
  constructor(props){
    super(props)
    this.state={
      id:props.id,
      categories : props.category,
      parentId: 0,
      name: '',
      userToken: '',
      color: '',
      code:'',
      type:'Expense_Payable',
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
    let data = {}
    if(this.state.parentId){
       data = { name: this.state.name, code: this.state.code, parentId: this.state.parentId};
    }
    else{
       data = { name: this.state.name, color: this.state.color, code: this.state.code, type: this.state.type};
    }
    new CategoryApi().createCategory(() => { this.setState({categoryCreated: true }); }, this.errorCall, this.state.id, data);
  };

  errorCall = err => {
    alert("Category not Added")
  };

  toggle =() =>{
    this.setState({ collapse: !this.state.collapse  });
  }

 
  render() {
    if (!this.state.categoryCreated) {
      return <div>{this.loadAddingCategory()}</div>
    } else {
      return <div>{this.loadAddedMessage()}</div>
    }
  }

  loadAddingCategory=()=>{
    const align = { textAlign: "left" }
    const {name,color,code}=this.state
    return(
        <div style={{ paddingTop: 50 }} className="animated fadeIn">
            <center>
                <Card style={{ width: 400, border: 0 }}>
                <CardBody>
                    <center>
                    <CardTitle style={{ color: "teal" }}> CREATE CATEGORY  </CardTitle> <br />
                    
                    <FormGroup style={align}>
                        <Label for="Name">Category Name </Label>
                        <Input name="name" type="text" placeholder="Category" value={name} onChange={e => this.handleInput(e)}  />
                    </FormGroup>
                    <FormGroup style={align}>
                        <Label style={{ align }} for="color">Color </Label>
                        <Input name="color" type="color" value={color} onChange={e => { this.handleInput(e) }}/>
                    </FormGroup>
                    <FormGroup style={align}>
                        <Label for="code">Code </Label>
                        <Input name="code" type="text" placeholder="Your code" onChange={e => { this.handleInput(e)}} onKeyPress = {this.handleEnter} value={code} />
                    </FormGroup>
                    <FormGroup style={align}>
                        <Label for="type">Type </Label>
                        <Input name="type" type="select" onChange={e => { this.handleInput(e)}}>
                            <option>Expense_Payable</option>
                            <option>Income_Receivable</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Input name="check" type="checkbox" onClick={this.toggle}/><Label for="mark">Make this as SubCategory </Label>
                    </FormGroup>
                    <Collapse isOpen={this.state.collapse}>
                          <FormGroup>
                          <Input type="select" name="parentId" id="exampleSelect" onChange={e => { this.handleInput(e)}}>
                            {this.state.categories.map((category) => { return <option value={category.id}>{category.name}</option> })}
                          </Input>
                          </FormGroup>
                    </Collapse>
                    </center>
                    <center>
                    <Button color="info" onClick={this.handleSubmit}> Add </Button>&nbsp;&nbsp;&nbsp;
                    <a href="/listCategories" style={{textDecoration:'none'}}> <Button active  color="light" aria-pressed="true">Cancel</Button></a>
                    <CardBody>
                    </CardBody>
                    </center>
                </CardBody>
                </Card>
            </center>
        </div>
    );
  }

  //this method calls after Successful Creation Ofcategory
  loadAddedMessage=()=>{
    return(
      <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <strong>Category</strong>
            </CardHeader>
          <center style={{paddingTop:'20px'}}>
            <h5><b>Category Added Successfully !!</b> <br /> <br />
              <b><a href="/listCategories">ViewCategories</a></b></h5>
          </center>
        </Card>
        </div>
    )
  }
}

export default AddCategory;
