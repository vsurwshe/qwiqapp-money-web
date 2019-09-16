import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button,  Col, Card, CardBody, CardHeader, Container, Input, Label, Row, Alert } from 'reactstrap';
import Bills from '../../bills/Bills';
import PaymentApi from '../../../services/PaymentApi';
import Store from '../../../data/Store';
import Config from '../../../data/Config';

class BillPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bill: props.bill,
            currencies: Store.getCurrencies(),
            billAmount: props.bill.amount,
            payAmount: props.markPaid ? props.bill.amount : 0,
            payDate: props.markPaid ? this.handlePaidDate() : '',
            alertColor: '',
            alertMessage: '',
            billType: props.bill.amount > 0
        };
    }

    componentDidMount = () => {
        if (this.props.bill.amount < 0) {
            let tempAmount = "" + this.props.bill.amount;
            this.setState({ amount: tempAmount.split('-')[1] });
        }
    }

    handleSubmitValue=async (event, errors, values)=>{
        if (errors.length === 0) {
            this.setState({ doubleClick: true });
            let date = values.date.split("-")[0]+values.date.split("-")[1]+values.date.split("-")[2];
            let data = {...values, "date": date }
            await new PaymentApi().addBillPayment(this.handleSuccessCall, this.handleErrorCall, this.props.profileId, this.props.bill.id, data);
        } else {
            this.setState({ doubleClick: false });
        }
    }

    handleSuccessCall = (response) => {
        this.setState({ alertColor: "success", alertMessage: "your bill payment is succesfull" });
        setTimeout(()=>{
            this.setState({ cancelPayment: true, alertColor:"", alertMessage: "" });
        }, Config.apiTimeoutMillis)

    }
    handleErrorCall = (error) => {
        console.log(error);
        this.setState({ doubleClick: false });
    }

    handlePaidDate = () => {
        let today = new Date()
        return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(today);
    }
    calculate = () => { this.setState({ calculate: !this.state.calculate }); }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

    handleBillType = () => {
        this.setState({ billType: !this.state.billType });
    }

    render() {
        const { cancelPayment, currencies } = this.state
        const { bill } = this.props
        let selectedCurrency = currencies.filter((currency, index)=>{return currency.code === bill.currency})
        return cancelPayment ? <Bills /> : <div> {this.loadPayment(bill, selectedCurrency[0])} </div>
    }

    loadPayment = (bill, selectedCurrency) => {
        const name= bill.description ? bill.description : bill.categoryName.name
        let billDate = (bill.billDate +"").slice(0,4)+"-"+ (bill.billDate +"").slice(4,6)+"-"+ (bill.billDate +"").slice(6, 8);
        return <Card className="card-accent-primary">
            <CardHeader> Bill Payment</CardHeader>
            <CardBody>
                <Container>
                    {this.state.alertMessage && <Alert color={this.state.alertColor} >{this.state.alertMessage}</Alert>}
                    <div className="control Container">
                        <Row>
                            <Col sm={3}>
                            <Label>Bill Type</Label>
                            </Col> 
                            <Col sm={5}><Label className="radio">
                            <p style={{color:"#cc0000"}}><Input type="radio" checked={!this.state.billType} onClick={this.handleBillType} /> Paid</p>
                          </Label> &nbsp; &nbsp; &nbsp; &nbsp;
                          <Label className="radio">
                            <p style={{color:"#006600"}}><Input type="radio" checked={this.state.billType} onClick={this.handleBillType} /> Receivable</p>
                        </Label></Col></Row>
                    </div> <br />
                    <AvForm onSubmit={this.handleSubmitValue}>
                        <Row>
                            <Col sm ={3} md ={3} xl={3} lg ={3}>Bill amount:</Col>
                            <Col> {bill.currency} &nbsp;{this.state.billAmount} </Col>
                        </Row> <br />
                        <Row>
                            <Col sm ={3} md ={3} xl={3} lg ={3}>Bill date:</Col>
                            <Col>{billDate}</Col>
                        </Row> <br />
                        <Row>
                            <Col sm ={3} md ={3} xl={3} lg ={3}>note/ description: </Col>
                            <Col>{name}</Col>
                        </Row> <br /><br />
                        <Row>
                            <Col xs="12" sm="5">
                            <Label >Bill Pay Amount</Label> &nbsp;({selectedCurrency.symbol})
                            <AvField type="number" name="amount" placeholder="Amount" value={this.state.payAmount} required />
                            </Col>
                            <Col xs="6" sm="4">
                            <Label >Pay Date</Label>
                            <AvField type="date" name="date" value={this.state.payDate} required />                            
                            </Col>
                            <Col xs="6" sm="3">
                            <Label >Bill Notes</Label>
                            <AvField type="text" name="notes"  placeholder=" Bill payment discriptions" />
                            </Col>
                               </Row>
                        <FormGroup >
                            <center>
                            <Button color="success" disabled={this.state.doubleClick}> Save  </Button> &nbsp;&nbsp;
                            <Button type="button" onClick={this.cancelPayment}>Cancel</Button></center>
                        </FormGroup>
                    </AvForm>
                </Container>
            </CardBody>
        </Card>
    }
}

export default BillPayment;