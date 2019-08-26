import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Table, Button, Label } from 'reactstrap';
import Loader from 'react-loader-spinner';
import BillingAddressApi from '../../../services/BillingAddressApi';
import GeneralApi from '../../../services/GeneralApi';
import Config from '../../../data/Config';
import '../../../css/style.css';

class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      toggle: false,
      accordion: [],
      currency: [],
      spinner: false,
      search: '',
      alertColor: '',
      alertMessage: '',
      total_balance: '',
    };
  }

  componentDidMount = () => {
    new BillingAddressApi().getPaymentsHistory(this.successCall, this.errorCall)
    new GeneralApi().getCurrencyList(this.successCall, this.errorCall);
  }

  successCall = async (response) => {
    if (response.payments) {  //    response form all Payments & Total Balance  
      await this.setState({
        payments: response.payments,
        total_balance: response.balance, spinner: true
      });
    } else {
      this.setState({ currency: response }) //response to all Currencies  
    }
  }

  // Response API Error 
  errorCall = error => {
    this.callAlertTimer('danger', 'Unable to Process Request, Please Try Again')
  }

  callAlertTimer = (alertColor, alertMessage) => {
    this.setState({ alertColor, alertMessage });
    setTimeout(() => {
      this.setState({ alertColor: "", alertMessage: "" });
    }, Config.apiTimeoutMillis)
  }

  render() {
    const { payments, spinner, currency } = this.state;
    if (!payments.length) {
      if (!spinner) {
        return this.loadSpinner()
      } else {
        return this.paymentHistoryIsEmpty();
      }
    } else {
      let paymentsList = payments.map((payment, key) => {
        var url='/payment/invoice/'+payment.invoiceId
        return (<tr key={key} className="row-text-align">
          <td>{this.customeDateFormat(payment.created)}</td>
          <td > {payment.invoiceId <= 0 ? payment.description : <Link to={url}>{payment.description}</Link> } </td>
          <td>{this.showCurrenySymbol(payment.currency, currency)} {payment.amount}</td>
        </tr>
        )
      });
      return <div>{this.displayPaymentHistory(paymentsList)}</div>
    }
  }

  loadSpinner = () => {
    return (
      <div className="animated fadeIn">
        <Card>
          {this.loadHeader()}
          <br /><br /><br /><br /><br />
          <center className="padding-top" >
            <CardBody><Loader type="TailSpin" className="loader-color" height={60} width={60} /></CardBody>
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

  paymentHistoryIsEmpty = () => {
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
  displayPaymentHistory = (paymentsList) => {
    return (
      <Card>
        <CardHeader>
          <Label><b>Current Balance: £ </b>{this.state.total_balance} </Label>
          <Link to="/billing/addCredits"> <Button color="success" className="float-right" > + Add Credits </Button></Link>
        </CardHeader>
        <CardBody className="card-align">
          {this.paymentHistoryTable(paymentsList)}
        </CardBody>
      </Card>
    );
  }

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

  showCurrenySymbol = (paymentCurrency, currency) => {
    let currency_symbol = '';
    currency.map(currency => {
      if (paymentCurrency === currency.code) {
        currency_symbol = currency.symbol;
      }
      return 0;
    });
    return currency_symbol;
  }

  customeDateFormat = (paymentDate) => {
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