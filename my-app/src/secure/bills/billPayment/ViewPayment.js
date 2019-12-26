import React, { Component } from 'react';
import { CardHeader, Button, Table } from 'reactstrap';
import Store from '../../../data/Store';
import DeleteBillPayment from './DeleteBillPayment';
import BillApi from '../../../services/BillApi';
import PaymentApi from '../../../services/PaymentApi';
import BillPayment from './ BillPayment';
import '../../../css/style.css';

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
      addBillPayment: props.payform ? props.payform : false
    };
  }

  componentDidMount = async () => {
    const { bill } = this.state
    const { profileId, billPaid } = this.props
    if (billPaid && bill) {
      await new BillApi().getBillById((bill) => {
        this.setState({ bill });
        this.getPayments()
      }, this.errorCall, profileId, bill.id);
    } else {
      this.getPayments();
    }
  }

  componentWillReceiveProps = async () => {
    const { profileId, paid } = this.props
    if (paid) {
      await new BillApi().getBills((bill) => { console.log(bill); }, this.errorCall, profileId, true);
    }
  }

  getPayments = () => {
    this.state.bill && new PaymentApi().getBillPayments(this.paymentSuccessCall, this.errorCall, this.props.profileId, this.state.bill.id)
  }

  errorCall = (err) => {
    console.log("Error: ", err);
  }

  paymentSuccessCall =  (payments) => {
    const count=payments.length;
    if(payments){
    this.setState({ payments });    
    this.props.paymentCount && this.props.paymentCount(count);
  }
}

  handleUpdateBillPayment = (updatePayment, currency) => {
    this.setState({ updateBillPayment: true, updatePayment, currency });
  }

  handleDeleteBillPayment = (deleteTxId) => {
    this.setState({ deleteBillPayment: true, deleteTxId });
  }

  handleAddPayment = () => { this.setState({ addBillPayment: !this.state.addBillPayment }); }

  render() {
    const { payments, bill, currencies, addBillPayment, updatePayment, updateBillPayment } = this.state;
    const { paidAmount } = this.props
    const { profileId } = this.props.tabData ? this.props.tabData : this.props
    let selectedCurrency;
    if (bill) {
      if (payments.length === 0 && !addBillPayment) {
        return this.noPaymentsAdded();
      } else if (addBillPayment) {
        let paymentData = {
          bill: bill,
          paidAmount: this.paidAmountCalculation(bill, payments, paidAmount),
          profileId: profileId
        }
        return <BillPayment data={paymentData} paymentCount={this.props.paymentCount} />
      } else if (updateBillPayment) {
        let updatePayementData = {
          bill: bill,
          paidAmount: paidAmount,
          profileId: profileId,
          updatePayment: updatePayment,
          currency: this.state.currency,
          paymentDate: this.dateFormat
        }
        return <BillPayment update={updateBillPayment} data={updatePayementData} paymentCount={this.props.paymentCount} />
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
    return <>
      <Table frame="box" style={{ borderColor: "#DEE9F2" }}>
        <thead className="table-header-color" >
          <tr>
            <th>Payment Date</th>
            <th>Description / Notes</th>
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
        </tbody>
        <tbody>
          <tr >
            <td className="label-align" colSpan="2">TOTAL PAID AMOUNT </td>
            <td> <b>{selectedCurrency[0].symbol} {totalAmount < 0 ? -(totalAmount) : totalAmount}</b></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <br />
      {this.state.bill.paid ? this.loadPaidMessage() : this.loadDueMessage(selectedCurrency[0], billAmount, totalAmount, paymentStyle)}
    </>
  }

  loadPaidMessage = () => {
    return <> <h4 style={{ paddingLeft: 15 }}> Congratulations! This bill is paid. </h4> </>
  }

  loadDueMessage = (selectedCurrency, billAmount, totalAmount, paymentStyle) => {
    return <b style={paymentStyle}>
      * {selectedCurrency.symbol}{billAmount - totalAmount < 0 ? -(billAmount - totalAmount) : billAmount - totalAmount} to pay on total due of {selectedCurrency.symbol}{billAmount < 0 ? -(billAmount) : billAmount}.
      <Button color="info" style={{ marginLeft: 20 }} onClick={this.handleAddPayment}> Add a new bill payment </Button>
    </b>
  }

  // Calculate the paid amount and passing the value to add payments.
  paidAmountCalculation = (bill, payments, paidAmount ) => {
    let paidValue=0;
    if (payments.length && !paidAmount) {
      payments.map((payment, index)=>{
        paidValue = paidValue + payment.amount;
        return 0;
      })
      return (bill.amount - paidValue);
    } else { 
      return paidAmount;
    }
  }

  callBillsApi = () => {
    new BillApi().getBills(() => { console.log("successcall") }, () => { console.log("errorCall") }, this.props.profileId, true)
  }

  loadSinglePayment = (payment, selectedCurrency, key, paymentAmount) => {
    const color = payment.amount < 0 ? 'red' : 'green'
    return <tr width={50} key={key}>
      <td>{this.dateFormat(payment.date)}</td>
      <td>{payment.notes}</td>
      <td style={{ color }}> {payment.type}  {selectedCurrency[0].symbol}{paymentAmount} </td>
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
      <center>
        <h5 onClick={() => this.handleAddPayment()} >No payments added yet..!  {<u className="loader-color">Click here</u>}  to add payment</h5>
      </center>
    </div>
  }

  loadHeader = (headerMessage) => {
    return <CardHeader>
      <strong>{headerMessage} {this.state.bill && this.state.bill.amount}</strong>
      <Button color="success" className="float-right" onClick={this.props.cancel}> Goto Bills </Button>
    </CardHeader>
  }
}

export default ViewPayment;