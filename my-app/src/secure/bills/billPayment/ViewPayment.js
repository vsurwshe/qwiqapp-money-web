import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Table } from 'reactstrap';
import Store from '../../../data/Store';
import UpdateBillPayment from './UpdateBillPayment';
import DeleteBillPayment from './DeleteBillPayment';
import BillApi from '../../../services/BillApi';
import PaymentApi from '../../../services/PaymentApi';
import BillPayment from './ BillPayment';

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
      cancelBtn: props.cancel,
    };
  }

  componentDidMount = () => {
    this.getPayments();
  }

  getPayments = () => {
    this.state.bill && new PaymentApi().getBillPayments(this.paymentSuccessCall, this.errorCall, this.props.profileId, this.state.bill.id)
  }
  paymentSuccessCall = async (payments) => {
    await this.setState({ payments });
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
    if (bill) {
      if (payments.length === 0) {
        return this.noPaymentsAdded();
      } else if (this.state.addBillPayment) {
        return <BillPayment bill={this.state.bill} paidAmount={this.props.paidAmount} profileId={this.props.profileId}/>
      } else if (this.state.updateBillPayment) {
        return <UpdateBillPayment profileId={this.props.profileId} bill={this.state.bill} updatePayment={this.state.updatePayment} cancelViewPay={this.props.cancel} currency={this.state.currency}
          paymentDate={this.dateFormat} />
      } else if (this.state.deleteBillPayment) {
        return <DeleteBillPayment profileId={this.props.profileId} cancelViewPay={this.props.cancel} bill={this.state.bill} taxId={this.state.deleteTxId} />
      } else {
        selectedCurrency = currencies.filter((currency, index) => { return currency.code === bill.currency })
        return this.loadBillPayments(payments, selectedCurrency);
      }
    } else {
      return this.noPaymentsAdded();
    }
  }

  loadBillPayments = (payments, selectedCurrency) => {
    let totalAmount = 0, paymentAmount = 0, billAmount = 0;
    billAmount = this.state.bill.amount;
    const paymentStyle = {
      fontSize: 15,
      paddingLeft: 30
    }
    return <Card>
      {this.loadHeader("Bill Payments")}
      <CardBody className="card-align">
        <Table frame="box" style={{ borderColor: "#DEE9F2" }}>
          <thead className="table-header-color" >
            <tr>
              <th>S.No </th>
              <th>Description/Notes</th>
              <th>Payment Date</th>
              <th>Payment Type</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, key) => {
              paymentAmount = payment.amount
              totalAmount = totalAmount + paymentAmount;
              return this.loadSinglePayment(payment, selectedCurrency, key, paymentAmount)
            })}
            <tr>
              <td  colSpan="3"></td> 
              <td>TOTAL PAID AMOUNT</td>
              <td><b>{selectedCurrency[0].symbol} { totalAmount <0 ? -(totalAmount) : totalAmount }</b></td>
              <td ></td>
            </tr>
          </tbody>
        </Table>
        <br /> {this.state.bill.paid ? this.loadPaidMessage() : this.loadDueMessage(selectedCurrency[0], billAmount, totalAmount, paymentStyle)}
        
      </CardBody>
    </Card>
  }

  loadPaidMessage = () => {
    return <> <h4 style={{ paddingLeft: 15 }}> Congratulations! This bill is paid. </h4> </>
  }

  loadDueMessage = (selectedCurrency, billAmount, totalAmount, paymentStyle) => {
    return <b style={paymentStyle}>
      * {selectedCurrency.symbol}{billAmount - totalAmount < 0 ? -(billAmount - totalAmount) : billAmount - totalAmount} to pay on total due of {selectedCurrency.symbol}{billAmount < 0 ? -(billAmount) : billAmount}.
      <Button color="info" style={{marginLeft: 20}} onClick={this.handleAddPayment}> Add payment </Button>
    </b>
  }

  handleAddPayment = () => { this.setState({ addBillPayment: true }); }

  callBillsApi = () => {
    new BillApi().getBills(() => { console.log("successcall") }, () => { console.log("errorCall") }, this.props.profileId, "True")
  }

  loadSinglePayment = (payment, selectedCurrency, key, paymentAmount) => {
    return <tr width={50} key={key}>
      <td>{key + 1}</td>
      <td>{payment.notes}</td>
      <td>{this.dateFormat(payment.date)}</td>
      <td>{payment.type}</td>
      <td> {selectedCurrency[0].symbol} { paymentAmount < 0 ? -(paymentAmount) : paymentAmount} </td>
      <td>
        <Button style={{ backgroundColor: "transparent", borderColor: '#green', color: "green" }} onClick={() => this.handleUpdateBillPayment(payment, selectedCurrency[0].symbol)}>Edit</Button> &nbsp;
      </td>
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
            <h5>{this.state.bill ? "No payments added yet..!" : "Bill id is required..!"}</h5>
          </center>
        </CardBody>
      </Card>
    </div>
  }

  loadHeader = (headerMessage) => {
    return <CardHeader>
      <strong>{headerMessage} {this.state.bill  && this.state.bill.amount}</strong>
      <Button color="success" className="float-right" onClick={this.props.cancel}> Goto Bills </Button>
    </CardHeader>
  }
}

export default ViewPayment;