import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Button,  Col, Card, CardBody, CardHeader, Container, Input, Label,Row } from 'reactstrap';
import Bills from '../../bills/Bills';
import PaymentApi from '../../../services/PaymentApi';

class BillPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bill: props.bill,
            amount: props.bill.amount,
            alertColor: '',
            content: '',
            billType: props.bill.amount > 0
        };
    }

    componentDidMount = () => {
        if (this.props.bill.amount < 0) {
            let tempAmount = "" + this.props.bill.amount;
            this.setState({ amount: tempAmount.split('-')[1] });
        }
    }

    calculate = () => { this.setState({ calculate: !this.state.calculate }); }

    cancelPayment = () => { this.setState({ cancelPayment: true }); }

    handleBillType = () => {
        this.setState({ billType: !this.state.billType });
    }

    render() {
        const { cancelPayment, amount } = this.state
        const { bill } = this.props
        return cancelPayment ? <Bills /> : <div> {this.loadPayment(bill, amount)} </div>
    }

    handleSubmitValue=async (event, errors, values)=>{
        if (errors.length === 0) {
            let date = values.date.split("-")[0]+values.date.split("-")[1]+values.date.split("-")[2];
            let data = {...values, "date": date }
            await new PaymentApi().addBillPayment((json)=>{console.log("Result ",json)},(error)=>{console.log("Error ",error)},this.props.profileId,this.props.bill.id,data);
        }
    }

    loadPayment = (bill, amount) => {
        const name= bill.description ? bill.description : bill.categoryName.name
        let billDate = (bill.billDate +"").slice(0,4)+"-"+ (bill.billDate +"").slice(4,6)+"-"+ (bill.billDate +"").slice(6, 8);
        return <Card className="card-accent-primary">
            <CardHeader> Bill Payment</CardHeader>
            <CardBody>
                <Container>
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
                            <Col> {bill.currency} &nbsp;{amount} </Col>
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
                            <Label >Bill Pay Amount</Label>
                            <AvField type="number" name="amount" placeholder="Amount" value={amount} required />
                            </Col>
                            <Col xs="6" sm="4">
                            <Label >Bill Date</Label>
                            <AvField type="date" name="date" required />                            
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