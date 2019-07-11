import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Table, Button, Label } from 'reactstrap';
import Loader from 'react-loader-spinner';
import BillingAddressApi from '../../../services/BillingAddressApi';
import GeneralApi from '../../../services/GeneralApi';
import Config from '../../../data/Config';


class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentDetails: [],
      toggle: false,
      accordion: [],
      currenciesSymbol: [],
      spinner: false,
      search: '',
      color: undefined,
      content: undefined,
      data: '',
      currentTotalBalance: '',
    };
  }

  componentDidMount = () => {
    new BillingAddressApi().getPaymentsHistory(this.successCall, this.errorCall)
    new GeneralApi().getCurrencyList(this.getCurrency, this.errorCall);
  }
  //This Method is called for Api's Success Call
  successCall = async paymentDetails => {
    await this.setState({ paymentDetails, spinner: true });
    if (paymentDetails.length !== 0) {
      this.calculateCurrentBal(paymentDetails);
    }
  }

  // this function calculateing CurrentBalnce 
  calculateCurrentBal = (paymentDetails) => {
    let totalAmt = 0;
    paymentDetails.map((payment, key) => {
      return totalAmt = totalAmt + payment.amount;
    });
    let dayDiif = this.getDaysDiff(new Date(paymentDetails[paymentDetails.length - 1].created), new Date())
    this.setState({ currentTotalBalance: (totalAmt - (dayDiif * 1)) })
  }

  // this function calculating Dates diffrencess
  getDaysDiff = (initialDate, currentDate) => {
    var calculateForDay = 1000 * 60 * 60 * 24;
    
    var calculateNumberOfDays = currentDate.getTime() - initialDate.getTime();
    
    // Convert back to days and return
    return Math.round(calculateNumberOfDays / calculateForDay);
  }

  getCurrency = currency => {
    this.setState({ currenciesSymbol: currency })
  }


  //Method that shows API's Error Call
  errorCall = error => {
    this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again')
  }

  callAlertTimer = (color, content) => {
    this.setState({ color, content });
    setTimeout(() => {
      this.setState({ color: "", content: "" });
    }, Config.apiTimeoutMillis)
  }

  render() {
    const { paymentDetails, spinner, currenciesSymbol } = this.state;
    let billPayments = paymentDetails.map((payment, key) => {
      return (<tr key={key}>
        <th style={{ color: "#6699ff" }}>{this.dateFormat(payment.created)}</th>
        <th style={{ color: "#6699ff" }}>{payment.description}</th>
        <th>{this.getCurrencySymbol(payment.currency, currenciesSymbol)} {payment.amount}</th>
      </tr>
      )
    });

    if (paymentDetails.length === 0) {
      if (!spinner) {
        return this.loadSpinner();
      } else {
        return this.loadPayHistoryEmpty();
      }
    } else {
      return <div>{this.displayPaymentsList(billPayments)}</div>
    }
  }

  loadSpinner = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <br /><br /><br /><br /><br />
          <center style={{ paddingTop: '20px' }}>
            <CardBody><Loader type="TailSpin" color="#2E86C1" height={60} width={60} /></CardBody>
          </center>
        </Card>
      </div>)
  }

  loadHeader = () => {
    return (
      <CardHeader>
        <strong>Billing Payments</strong>
        <Link to="/billing/addCredits" ><Button color="success" className="float-right"> + Add Credits </Button></Link>
      </CardHeader>
    );
  }

  loadPayHistoryEmpty = () => {
    return (
      <div>
        <Card>
          {this.loadHeader()}
          <CardBody>
            <center>
              <h5>No payments made yet..!</h5>
            </center>
          </CardBody>
        </Card>
      </div>
    );
  }

  // TODO: define static current Balance.
  displayPaymentsList = (billPayments) => {
    return (
      <Card>
        <CardHeader>
          <Label><b>PAYMENT HISTORY </b> <br /><b>Current Balance: £ </b>{this.state.currentTotalBalance} </Label>
          <Link to="/billing/addCredits"> <Button color="success" className="float-right" onClick={this.addBillingPayment}> + Add Credits </Button></Link>
        </CardHeader>
        <CardBody style={{ textAlign: "center" }}>
          {this.loadPaymentsTable(billPayments)}
        </CardBody>
      </Card>
    );
  }

  loadPaymentsTable = (billPayments) => {
    return (<Table striped  >
      <thead>
        <tr>
          <th>DATE</th>
          <th>DESCRIPTION</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        {billPayments}
      </tbody>
    </Table>)
  }

  getCurrencySymbol = (paymentCurrency, currenciesSymbol) => {
    let data = '';
    currenciesSymbol.map(currency => {
      if (paymentCurrency === currency.code) {
        data = currency.symbol;
      }
      return 0;
    });
    return data;
  }

  dateFormat = (paymentDate) => {
    let date = new Date(paymentDate).toDateString();
    let datasss = date.substring(8, 10);
    let temp = '';
    if (datasss > 3 && datasss < 21)
      temp = 'th';
    switch (datasss % 10) {
      case 1: temp = "st";
        break;
      case 2: temp = "nd";
        break;
      case 3: temp = "rd";
        break;
      default: temp = "th";
        break;
    }
    return datasss + temp + date.substring(3, 7) + " " + date.substring(11, 15);
  }
}
export default PaymentHistory;