import React, { Component } from "react";
import { Card, ButtonDropdown, ButtonGroup, CardBody, Row, Col, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import Store from "../data/Store";
import '../css/style.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  handleCard1 = ()=>{
    this.setState({ card1: !this.state.card1 }); 
  }
  handleCard2 = ()=>{
    this.setState({ card2: !this.state.card2 }); 
  }
  handleCard3 = ()=>{
    this.setState({ card3: !this.state.card3 }); 
  }
  handleCard4 = ()=>{
    this.setState({ card4: !this.state.card4 }); 
  }

  render() {
    const profileName = Store.getProfile().name;
    return <div>{this.loadDashboard(profileName)}</div>
  }

  // hard coded added for now...
  loadDashboard = (profileName) => {
    return <div className="animated fadeIn">

      <Row>
        {/* Upcomeing Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-warning">
          {this.loadBillDivision(this.state.card1, this.handleCard1, 12, "Upcomming Bills")}
          </Card>
        </Col>
        {/* Overdue Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-danger">
          {this.loadBillDivision(this.state.card2, this.handleCard2, 21, "Over Due")}
          </Card>
        </Col>
        {/* Paid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-success">
          {this.loadBillDivision(this.state.card3, this.handleCard3, 25, "Paid Bills")}
          </Card>
        </Col>
        {/* Unpaid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-info">
            {this.loadBillDivision(this.state.card4, this.handleCard4, 11, "Unpaid Bills")}
          </Card>
        </Col>
      </Row>
    </div>
  }
  
  loadBillDivision = (isOpen, handleCard, value, billType) =>{
    return (
      <>
        <CardBody className="pb-0">
          <ButtonGroup className="float-right">
            <ButtonDropdown id='card1' isOpen={isOpen} toggle={() => {handleCard()}}>
              <DropdownToggle caret className="p-0" color="transparent">
                <i className="icon-settings"></i>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
          <div className="text-value"> {value} </div>
          <div>{billType}</div>
        </CardBody>
        <div className="chart-wrapper mx-3" style={{ height: '70px' }}></div>
    </>
    )
  }
}

export default Dashboard;
