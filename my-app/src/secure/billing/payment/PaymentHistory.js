import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Table, Button, Row, Col } from 'reactstrap';
import Loader from 'react-loader-spinner';
import BillingAddressApi from '../../../services/BillingAddressApi';
import Config from '../../../data/Config';
import '../../../css/style.css';
import Store from '../../../data/Store';

class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      currencies: [],
    };
  }

  componentDidMount = () => { new BillingAddressApi().getPaymentsHistory(this.successCall, this.errorCall) }

  successCall = async (payHisory) => {
    const currencies = Store.getCurrencies();
    await this.setState({
      currencies,
      payments: payHisory.payments,
      totalBalance: payHisory.balance,
      spinner: true
    });
  }

  // Response API Error 
  errorCall = error => { this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again') }

  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    setTimeout(() => { this.setState({ alertColor: "", alertMessage: "" }); }, Config.apiTimeoutMillis)
  }

  render() {
    const { payments, spinner } = this.state;
    if (!payments.length) {
      if (!spinner) {
        return this.loadSpinner()
      } else {
        return this.paymentHistoryIsEmpty();
      }
    } else {
      return <div>{this.displayPaymentHistory(this.loadPaymentList(payments))}</div>
    }
  }

  // This method returns the list of rows for payments table
  loadPaymentList = (payments) => {
    const { currencies } = this.state
    let paymentsList = payments.map((payment, key) => {
      var url = '/payment/invoice/' + payment.invoiceId
      return (<tr key={key} className="row-text-align">
        <td>{this.customDateFormat(payment.created)}</td>
        <td > {payment.invoiceId <= 0 ? payment.description : <Link to={url}>{payment.description}</Link>} </td>
        <td>{this.showCurrenySymbol(payment.currency, currencies)} {payment.amount}</td>
      </tr>
      )
    });
    return paymentsList;
  }

  loadSpinner = () => <div className="animated fadeIn">
        <Card>
          {this.loadHeader("Billing Payments")}
          <br /><br /><br /><br /><br />
          <center className="padding-top" >
            <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
          </center>
        </Card>
      </div>

  //  This method loads card header 
  loadHeader = (headerMessage) => <CardHeader style={{ height: 60 }}>
    <Row>
      <Col className="marigin-top"><strong>{headerMessage}</strong></Col>
      <Col><Link to="/billing/addCredits" ><Button color="success" className="float-right"> + Add Credits </Button></Link></Col>
    </Row>
  </CardHeader>

  // If Payments are not there, this method will be called 
  paymentHistoryIsEmpty = () => <Card>
    {this.loadHeader("Billing Payments")}
    <CardBody>
      <center>
        <h5>No payments made yet..!</h5>
      </center>
    </CardBody>
  </Card>


  // Calls payments table.
  displayPaymentHistory = (paymentsList) => {
    const { totalBalance } = this.state
    return (
      <Card>
        {this.loadHeader(`Current Balance: £ ${totalBalance}`)}
        <CardBody className="card-align">
          {this.paymentHistoryTable(paymentsList)}
        </CardBody>
      </Card>
    );
  }

  // Actual implementation of payments table
  paymentHistoryTable = (paymentsList) => {
    return <><b>PAYMENT HISTORY </b> <br /><br />
      <Table striped bordered >
        <thead>
          <tr className="table-header-color" >
            <th>DATE</th>
            <th>DESCRIPTION</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {paymentsList}
        </tbody>
      </Table></>
  }

  // This method shows currency symbol according to currency
  showCurrenySymbol = (paymentCurrency, currencies) => {
    let currency_symbol = '';
    currencies.map(currency => {
      if (paymentCurrency === currency.code) {
        currency_symbol = currency.symbol;
      }
      return 0;
    });
    return currency_symbol;
  }

  // This method is used to display date in customised format
  customDateFormat = (paymentDate) => {
    let date = new Date(paymentDate).toDateString();
    let day = date.substring(8, 10);
    let dateSuperTag = '';
    if (day < 10) {
      day = date.substring(9, 10);
    }
    if (day > 3 && day < 21) {
      dateSuperTag = 'th';
    } else {
      switch (day % 10) {
        case 1: dateSuperTag = "st";
          break;
        case 2: dateSuperTag = "nd";
          break;
        case 3: dateSuperTag = "rd";
          break;
        default: dateSuperTag = "th";
          break;
      }
    }
    return <div>{date.substring(0, 3)}, {day}<sup>{dateSuperTag}</sup> {`${date.substring(3, 7)} ${date.substring(11, 15)}`}</div>;
  }
}
export default PaymentHistory;