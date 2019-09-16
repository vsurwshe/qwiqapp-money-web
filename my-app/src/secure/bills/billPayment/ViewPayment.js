import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Table } from 'reactstrap';
import PaymentApi from '../../../services/PaymentApi';
import Store from '../../../data/Store';

class ViewPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments : [],
      bill: this.props.bill,
      currencies: Store.getCurrencies(),
      dropdownOpen: [],
      hoverAccord: [],
      accordion: [],
      onHover: false,
    };
  }

  componentDidMount=()=>{
   this.getPayments();
  }

  getPayments=()=>{
    new PaymentApi().getBillPayment(this.paymentSuccessCall, this.errorCall, this.props.profileId, this.state.bill.id)
  }

  paymentSuccessCall= async (payments)=>{
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

  errorCall=(error)=>{
    console.error("Error : ",error);
  }

  hoverAccordion = (keyIndex) => {
    const prevState = this.state.hoverAccord;
    const state = prevState.map((value, index) => keyIndex === index ? !value : false);
    this.setState({ hoverAccord: state });
  }

  onHover = (e, keyIndex) => {
    this.setState({ onHover: true });
    this.hoverAccordion(keyIndex)
  }

  onHoverOff = (e, keyIndex) => {
    this.setState({ onHover: false });
    this.hoverAccordion(keyIndex)
  }

  render() {
    const {payments, bill, currencies} = this.state;
    let selectedCurrency;
    if( payments.length === 0 ){
      return this.noPaymentsAdded();
    } else {
      selectedCurrency = currencies.filter((currency, index)=>{return currency.code === bill.currency})
      return this.loadBillPayments(payments, selectedCurrency);
    }
  }

  loadBillPayments = (payments, selectedCurrency) => {
    // return <Container>
    return <Card>
        {this.loadHeader("Bill Payments")}
        <CardBody>
          <Table style={{ bordercolor: "#DEE9F2" }}>
            <thead className="table-header-color" >
              <tr>
                <th> Bill Id </th>
                <th>Bill Amount</th>
                <th>Paid Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index)=>{
                return this.loadSinglePayment(payment, index, selectedCurrency)
              })}
            </tbody>
          </Table>
          </CardBody>
        </Card>
      // </Container>
  }

  loadSinglePayment = (payment, index, selectedCurrency) => {
    return <tr onPointerEnter={(e) => this.onHover(e, index)} onPointerLeave={(e) => this.onHoverOff(e, index)} width={50} key={index}>
      <td>{this.state.bill.id}</td>
      <td>{selectedCurrency[0].symbol} {this.state.bill.amount}</td>
      <td> {selectedCurrency[0].symbol}{payment.amount} </td>
      <td> {payment.notes} </td>
    </tr>
  }

  noPaymentsAdded = () =>{
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

  loadHeader = (headerMessage) =>{
    return <CardHeader>
        <strong>{headerMessage}</strong>
        <Button color="success" className="float-right" onClick={this.props.cancel}> Goto Bills </Button>
    </CardHeader>
  }
}

export default ViewPayment;