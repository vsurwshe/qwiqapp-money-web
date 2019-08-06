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
      payment_history: [],
      toggle: false,
      accordion: [],
      currencies: [],
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
 
  successCall = async (response)=> {    
    if(response.payments) {
        //    response form all Payments & Total Balance  
        await this.setState({ payment_history: response.payments,
                              total_balance: response.balance, spinner: true });
    } else {
        this.setState({ currencies: response }) //response to all Currencies  
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
    const { payment_history, spinner, currencies } = this.state;
    if (payment_history.length=== 0 ) {
      if (!spinner) {
        return this.loadSpinner()
      } else {
        return this.paymentHistoryIsEmpty();
      }
    } else {
      let payments = payment_history.map((payment, key) => {
        return (<tr key={key} style={{textAlign:"left"}}>
          <th>{this.customeDateFormat(payment.created)}</th>
          <th >{payment.description}</th>
          <th>{this.showCurrenySymbol(payment.currency, currencies)} {payment.amount}</th>
        </tr>
        )
      });
      return <div>{this.displayPaymentHistory(payments)}</div>
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
  displayPaymentHistory = (payments) => {
    return (
      <Card>
        <CardHeader>
          <Label><b>PAYMENT HISTORY </b> <br /><b>Current Balance: £ </b>{this.state.total_balance} </Label>
          <Link to="/billing/addCredits"> <Button color="success" className="float-right" > + Add Credits </Button></Link>
        </CardHeader>
        <CardBody style={{ textAlign: "center" }}>
          {this.paymentHistoryTable(payments)}
        </CardBody>
      </Card>
    );
  }

  paymentHistoryTable = (payments) => {
    return (<Table striped  bordered >
      <thead>
        <tr style={{backgroundColor:"#8F50CD",alertColor:"#FFFFFF"}}>
          <th>DATE</th>
          <th>DESCRIPTION</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        {payments}
      </tbody>
    </Table>
    )
  }

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

  customeDateFormat = (paymentDate) => {
    let date = new Date(paymentDate).toDateString();
    let day = date.substring(8, 10);
    let dateSuperTag = '';
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
    return (<div>{day}<sup>{dateSuperTag}</sup> {date.substring(3, 7) + " " + date.substring(11, 15)}</div>);
  }
}
export default PaymentHistory;