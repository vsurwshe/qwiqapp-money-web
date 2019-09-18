import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Table } from 'reactstrap';
import PaymentApi from '../../../services/PaymentApi';
import Store from '../../../data/Store';
import UpdateBillPayment from './UpdateBillPayment';
import DeleteBillPayment from './DeleteBillPayment';
import BillApi from '../../../services/BillApi';

class ViewPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      bill: this.props.bill,
      currencies: Store.getCurrencies(),
      dropdownOpen: [],
      hoverAccord: [],
      accordion: [],
      onHover: false,
    };
  }

  componentDidMount = () => {
    this.getPayments();
  }

  getPayments = () => {
    new PaymentApi().getBillPayments(this.paymentSuccessCall, this.errorCall, this.props.profileId, this.state.bill.id)
  }

  paymentSuccessCall = async (payments) => {
    await this.setState({ payments });
    this.loadCollapse();
  }

  loadCollapse = async () => {
    await this.state.payments.map(payments => {
      return this.setState(prevState => ({
        accordion: [...prevState.accordion, false],
        hoverAccord: [...prevState.hoverAccord, false],
        dropdownOpen: [...prevState.dropdownOpen, false]
      }))
    });
  }

  errorCall = (error) => {
    console.error("Error : ", error);
  }

  hoverAccordion = (keyIndex) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((value, index) => keyIndex === index ? !value : false);
    this.setState({ hoverAccord: state });
  }

  handleUpdateBillPayment = (updatePayment, currency) => {
    this.setState({ updateBillPayment: true, updatePayment, currency });
  }

  handleDeleteBillPayment = (deleteTxId) => {
    this.setState({ deleteBillPayment: true, deleteTxId });
  }

  render() {
    const { payments, bill, currencies } = this.state;
    let selectedCurrency;
    if (payments.length === 0) {
      return this.noPaymentsAdded();
    } else if (this.state.updateBillPayment) {
      return <UpdateBillPayment profileId={this.props.profileId} bill={this.state.bill} updatePayment={this.state.updatePayment} currency={this.state.currency}
        paymentDate={this.dateFormat} />
    } else if (this.state.deleteBillPayment) {
      return <DeleteBillPayment profileId={this.props.profileId} bill={this.state.bill} taxId={this.state.deleteTxId} />
    } else {
      selectedCurrency = currencies.filter((currency, index) => { return currency.code === bill.currency })
      return this.loadBillPayments(payments, selectedCurrency);
    }
  }

  loadBillPayments = (payments, selectedCurrency) => {
    let totalAmount = 0, paymentAmount = 0, billAmount = 0;
    billAmount = this.state.bill.amount > 0 ? this.state.bill.amount : -(this.state.bill.amount)
    const paymentStyle = {
      fontSize: 15,
      paddingLeft: 30
    }
    return <Card>
      {this.loadHeader("Bill Payments")}
      <Table style={{ bordercolor: "#DEE9F2" }}>
        <thead className="table-header-color" >
          <tr>
            <th>S.No </th>
            <th>Description/Notes</th>
            <th>Bill Date</th>
            <th>Paid Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, key) => {
            paymentAmount = payment.amount > 0 ? payment.amount : -(payment.amount)
            totalAmount = totalAmount + paymentAmount;
            return this.loadSinglePayment(payment, selectedCurrency, key, paymentAmount)
          })}
          <tr>
            <td></td>
            <td></td>
            <td>TOTAL </td>
            <td>{selectedCurrency[0].symbol} {totalAmount}</td>
          </tr>
        </tbody>
      </Table>
      <br />
      {totalAmount >= billAmount ? <center style={{ color: "green" }}>Congratulations! This bill is paid.{this.callBillsApi()}</center> :
        <b style={paymentStyle}> * {selectedCurrency[0].symbol}{billAmount - totalAmount} to pay on total due of {selectedCurrency[0].symbol}{billAmount}.</b>}
    </Card>
  }

  callBillsApi = () => {
    new BillApi().getBills(() => { console.log("successcall") }, () => { console.log("errorCall") }, this.props.profileId, "True")
  }

  loadSinglePayment = (payment, selectedCurrency, key, paymentAmount) => {
    return <tr width={50} key={key}>
      <td>{key + 1}</td>
      <td>{payment.notes}</td>
      <td>{this.dateFormat(payment.date)}</td>
      <td> {selectedCurrency[0].symbol} {paymentAmount} </td>
      <td><Button color="primary" onClick={() => this.handleUpdateBillPayment(payment, selectedCurrency[0].symbol)}>Update</Button>
        <Button color="danger" onClick={() => this.handleDeleteBillPayment(payment.txId)}>Delete</Button></td>
    </tr>
  }

  dateFormat = (userDate) => {
    let date = "" + userDate
    let dateString = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8)
    const formatDate = new Intl.DateTimeFormat('en-gb', { month: 'short', weekday: 'short', day: '2-digit' }).format(new Date(dateString));
    return formatDate;
  }

  noPaymentsAdded = () => {
    return <div>
      <Card>
        {this.loadHeader("Bill Payments")}
        <CardBody>
          <center>
            <h5>No payments added yet..!</h5>
          </center>
        </CardBody>
      </Card>
    </div>
  }

  loadHeader = (headerMessage) => {
    return <CardHeader>
      <strong>{headerMessage}</strong>
      <Button color="success" className="float-right" onClick={this.props.cancel}> Goto Bills </Button>
    </CardHeader>
  }
}

export default ViewPayment;