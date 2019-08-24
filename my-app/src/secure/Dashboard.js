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
            <CardBody className="pb-0">
              <ButtonGroup className="float-right">
                <ButtonDropdown id='card1' isOpen={this.state.card1} toggle={() => { this.setState({ card1: !this.state.card1 }); }}>
                  <DropdownToggle caret className="p-0" color="transparent">
                    <i className="icon-settings"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
              <div className="text-value"> 12</div>
              <div>Upcoming Bills</div>
            </CardBody>
            <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
            </div>
          </Card>
        </Col>
        {/* Overdue Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-danger">
            <CardBody className="pb-0">
              <ButtonGroup className="float-right">
                <ButtonDropdown id='card1' isOpen={this.state.card2} toggle={() => { this.setState({ card2: !this.state.card2 }); }}>
                  <DropdownToggle caret className="p-0" color="transparent">
                    <i className="icon-settings"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
              <div className="text-value"> 11</div>
              <div>Overdue Bills</div>
            </CardBody>
            <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
            </div>
          </Card>
        </Col>
        {/* Paid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-success">
            <CardBody className="pb-0">
              <ButtonGroup className="float-right">
                <ButtonDropdown id='card1' isOpen={this.state.card3} toggle={() => { this.setState({ card3: !this.state.card3 }); }}>
                  <DropdownToggle caret className="p-0" color="transparent">
                    <i className="icon-settings"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
              <div className="text-value"> 12</div>
              <div>Paid Bills</div>
            </CardBody>
            <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
            </div>
          </Card>
        </Col>
        {/* Unpaid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-info">
            <CardBody className="pb-0">
              <ButtonGroup className="float-right">
                <ButtonDropdown id='card1' isOpen={this.state.card4} toggle={() => { this.setState({ card4: !this.state.card4 }); }}>
                  <DropdownToggle caret className="p-0" color="transparent">
                    <i className="icon-settings"></i>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
              <div className="text-value"> 14</div>
              <div>Unpaid Bills</div>
            </CardBody>
            <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  }
}

export default Dashboard;
