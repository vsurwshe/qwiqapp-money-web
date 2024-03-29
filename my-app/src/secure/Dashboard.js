import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { Card, CardBody, Row, Col } from "reactstrap";
import BillApi from '../services/BillApi';
import Store from "../data/Store";
import Config from "../data/Config";
import '../css/style.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bills: [],
      recurBills: [],
      paidBills: 0,
      unpaidBills: 0,
      overdueBills: 0,
      upcomingBills: 0,
      spinner: true
    };
  }

  componentDidMount = () => {
    this.setProfileId();
  }

  // Setting ProfileId from Store
  setProfileId = async () => {
    if (Store.getProfile()) {
      await this.setState({ profileId: Store.getProfile().id });
      await this.getAllBills();
    }
  }

  // Getting Bills for specific profile
  getAllBills = async () => {
    await new BillApi().getBills(this.billsSuccessCall, this.errorCall, this.state.profileId)
  }

  // Getting Bills SuccessCall
  billsSuccessCall = async (bills) => {
    if (bills.length === 0) {
      this.setState({ bills: [0] });
    } else {
      this.setState({ bills });
      this.calcPaidUnpaidBills(bills)
    }
    this.setState({ spinner: false })
  }

  errorCall = (error) => {
    console.log("Error", error)
  }

  //Calculate paid and unpaid bills count and set to state
  calcPaidUnpaidBills = (bills) => {
    let paidBills = 0, unpaidBills = 0;
    bills.map(bill => bill.paid ? paidBills++ : unpaidBills++)
    this.setState({ paidBills, unpaidBills });
    this.calcOverDueUpcomingBills(bills)
  }

  // Calculate Overdue, Upcoming bills for bills, recurring bills
  calcOverDueUpcomingBills = (bills) => {
    let overdueBills = 0, upcomingBills = 0;
    bills.map(bill =>
      !bill.paid && (this.loadDateFormat(bill.dueDate_) >= new Date() ? upcomingBills++ : overdueBills++)
    )
    this.setState({ overdueBills: this.state.overdueBills + overdueBills, upcomingBills: this.state.upcomingBills + upcomingBills });
  }

  render() {
    //shows spinner until getting values from api
    if (this.state.spinner) {
      return <div>{this.loadSpinner()}</div>
    } else {
      return <div>{this.loadDashboard()}</div>
    }
  }

  callTimer = () => {
    setTimeout(() => {
      this.setState({ emailNotVerified: true });
    }, Config.apiTimeoutMillis);
  }
  //Shows spinner  
  loadSpinner = () => {
    this.callTimer();
    return <center style={{ paddingTop: '20px' }}>
      {this.state.emailNotVerified ? <p> Your email is not verified </p> : <div className="spinner-border text-info" style={{ height: 60, width: 60 }}></div>}
    </center>
  }

  //converts the duedate to regular date format
  loadDateFormat = (dateParam) => {
    let toStr = "" + dateParam
    let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
    let date = new Date(dateString);
    return date;
  }

  // hard coded added for now...
  loadDashboard = () => {
    return <div className="animated fadeIn">
      <Row>
        {/* Upcoming Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-warning">
            {this.loadBillDivision(this.state.upcomingBills, "Upcoming Bills", '/listBills/upcoming')}
          </Card>
        </Col>
        {/* Overdue Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-danger">
            {this.loadBillDivision(this.state.overdueBills, "OverDue Bills", '/listBills/overdue')}
          </Card>
        </Col>
        {/* Paid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-success">
            {this.loadBillDivision(this.state.paidBills, "Paid Bills", '/listBills/paid')}
          </Card>
        </Col>
        {/* Unpaid Bills */}
        <Col xs="12" sm="6" lg="3">
          <Card className="text-white bg-info">
            {this.loadBillDivision(this.state.unpaidBills, "Unpaid Bills", '/listBills/unpaid')}
          </Card>
        </Col>
      </Row>
    </div>
  }

  loadBillDivision = (value, billType, url) => {
    return <>
      <CardBody className="pb-0">
        <div className="text-value">{billType}</div>
        <div className="text-value"> {value} </div>
      </CardBody>
      <div className="chart-wrapper mx-3 card-style">
        <div >
          <Link to={url} className="card-title">View {billType}</Link>
          {/* In Future This Page Called Show Bills List according to links (upcomeing, overdue, paid & unpaid) */}
        </div>
      </div>
    </>
  }
}

export default Dashboard;
