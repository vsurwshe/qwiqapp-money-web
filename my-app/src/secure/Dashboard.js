import React, { Component } from "react";
import { Card, ButtonDropdown, ButtonGroup, CardBody, Row, Col, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import '../css/style.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  toogleUpcomingBillCard = ()=>{
    this.setState({ upcomingBill: !this.state.upcomingBill }); 
  }

  toogleOverDueBillCard = ()=>{
    this.setState({ overDueBill: !this.state.overDueBill }); 
  }

  tooglePaidBillCard = ()=>{
    this.setState({ paidBill: !this.state.paidBill }); 
  }

  toogleUnpaidBillCard = ()=>{
    this.setState({ unPaidBill: !this.state.unPaidBill }); 
  }

  render() {
    return <div>{this.loadDashboard()}</div>
  }

  // hard coded added for now...
  loadDashboard = () => {
    return <div className="animated fadeIn">
      <Row>
        {/* Upcomeing Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-warning">
            {this.loadBillDivision(this.state.upcomingBill, this.toogleUpcomingBillCard, 12, "Upcoming Bills")}
          </Card>
        </Col>
        {/* Overdue Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-danger">
            {this.loadBillDivision(this.state.overDueBill, this.toogleOverDueBillCard, 21, "Over Due")}
          </Card>
        </Col>
        {/* Paid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-success">
            {this.loadBillDivision(this.state.paidBill, this.tooglePaidBillCard, 25, "Paid Bills")}
          </Card>
        </Col>
        {/* Unpaid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-info">
            {this.loadBillDivision(this.state.unPaidBill, this.toogleUnpaidBillCard, 11, "Unpaid Bills")}
          </Card>
        </Col>
      </Row>
    </div>
  }

  loadBillDivision = (isOpen, handleCard, value, billType) => {
    return <>
      <CardBody className="pb-0">
        <div>{billType}</div>
        <ButtonGroup className="float-right">
            <ButtonDropdown id='upcomingBill' isOpen={isOpen} toggle={() => {handleCard()}}>
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
      </CardBody>
      <div className="chart-wrapper mx-3" style={{ height: '70px' }}></div>
    </>
  }
}

export default Dashboard;
