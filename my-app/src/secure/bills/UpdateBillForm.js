import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Col, Input, Row, FormGroup } from "reactstrap";
import Data from '../../data/SelectData';
import Select from 'react-select';
import Config from '../../data/Config';

class UpdateBillForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            billDate: this.props.loadDateFormat(this.props.updateForm.bill.billDate),
            checked: this.props.updateForm.bill.notificationEnabled,
            dueDate: this.props.loadDateFormat(this.props.updateForm.bill.dueDate_),
            notifyDate: this.props.loadDateFormat(this.props.updateForm.bill.notifyDate_),
            updateSuccess: this.props.updateForm.updateSuccess,
            dueDays: this.props.updateForm.bill.dueDays
        };
    }

    handleBillDate = (e) => {
        this.setState({ billDate: e.target.value })
        this.setDueDate(e.target.value, this.state.dueDays)
    }

    handleNotificationEnabled = () => {
        this.setState({ checked: !this.state.checked });
        this.props.handleNotificationEnabled();
    }

    handleDueDate = (e) => {
        let value = e.target.value;
        this.setDueDate(this.state.billDate, value)
    }

    setDueDate = (billDateValue, value) => {
        if (billDateValue && value) {
            this.props.callAlertTimer("", "")
            let billDate = new Date(billDateValue);
            billDate.setDate(billDate.getDate() + parseInt(value - 1))
            let dueDate = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(billDate);
            this.setState({ dueDate });
        } else {
            this.props.callAlertTimer("danger", "Please enter billdate and due days ")
        }
    }

    // shows the response messages for user
    callAlertTimer = (alertColor, content) => {
        this.setState({ alertColor, content });
        setTimeout(() => {
            this.setState({ alertColor: '', updateSuccess: true });
        }, Config.notificationMillis);
    };

    handleNotifyDate = (e) => {
        let value = e.target.value;
        if (this.state.billDate && value) {
            this.props.callAlertTimer("", "")
            let billDate = new Date(this.state.billDate);
            billDate.setDate(billDate.getDate() + parseInt(value - 1))
            let notifyDate = new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(billDate);
            this.setState({ notifyDate });
        } else {
            this.props.callAlertTimer("danger", "Please enter billdate and notify days ")
        }
    }

    render() {
        const { currencies, amount, taxPercent, bill, categories, labels, contacts, billType, taxAmount } = this.props.updateForm;
        const { checked } = this.state;
        return <AvForm onSubmit={this.props.handleSubmitValue}>
            <Row>
                <Col sm={3}>
                    <AvField type="select" label="currency" value={bill.currency} name="currency" errorMessage="Select Currency" required>
                        <option value="">Select</option>
                        {currencies.map((currency, key) => { return <option key={key} value={currency.code} h={currency.symbol} symbol={currency.symbol} >{currency.symbol}</option> })}
                    </AvField>
                </Col>
                <Col sm={3}>
                    <AvField type="select" name="label" label="Type of Bill" errorMessage="Select Type of Bill" value={billType} required>
                        <option value="">Select Type of Bill</option>
                        <option value="-">Payable</option>
                        <option value="+">Receivable</option>
                    </AvField>
                </Col>
                <Col>
                    <AvField name="amount" label="Amount" value={amount ? amount : 0} placeholder="Amount" type="text"
                        errorMessage="Invalid amount" onChange={e => { this.props.handleSetAmount(e) }} required />
                </Col>
            </Row>
            <Row>
                <Col>
                    <AvField name="taxPercent" value={taxPercent} placeholder="0" label="TaxPercent" type="number" errorMessage="Invalid tax%"
                        onChange={(e) => { this.props.handleTaxAmount(e) }} />
                </Col>
                <Col>
                    <AvField name='dummy' label="Tax Amount" value={taxAmount} placeholder="0" type="number"
                        onChange={(e) => { this.props.handleTaxPercent(e) }} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <label >Category</label>
                    <Select options={Data.categories(categories)} defaultValue={Data.categories(categories).filter(item => { return item.value === bill.categoryId })}
                        styles={Data.singleStyles} placeholder="Select Categories " onChange={this.props.categorySelected} required />
                </Col>
            </Row> <br />
            <Row>
                <Col>
                    <AvField name="billDate" label="Bill Date" value={this.state.billDate} type="date" errorMessage="Invalid Date" onChange={(e) => this.handleBillDate(e)}
                        validate={{
                            date: { format: 'yyyy/MM/dd' }, dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                            required: { value: true }
                        }} />
                </Col>
                <Col>
                    <AvField name="dueDays" label="Due Days" value={bill.dueDays} type="number" placeholder="No.of Days" errorMessage="Invalid days" onChange={e => { this.handleDueDate(e) }} />
                </Col>
                <Col>
                    <AvField name="dueDate" label="Due Date" disabled value={this.state.dueDate} type="date" errorMessage="Invalid Date"
                        validate={{
                            date: { format: 'yyyy/MM/dd' }, dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                            required: { value: true }
                        }} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <label >Description/Notes</label>
                    <AvField name="description" type="text" value={bill.description} list="colors" errorMessage="Invalid Notes" placeholder="Ex: Recharge " />
                </Col>
            </Row>
            <Row>
                <Col>
                    <label >Select Labels</label> {this.props.lablesOptions(labels, bill)}</Col>
            </Row><br />
            <Row>
                <Col>
                    <label >Select Contacts</label>
                    <Select options={Data.contacts(contacts)} defaultValue={Data.contacts(contacts).filter(item => { return item.value === bill.contactId })}
                        placeholder="Select Contacts " onChange={this.props.contactSelected} required />
                </Col>
            </Row><br />
            <Row>
                <Col style={{ marginLeft: 20 }}>
                    <Input name="check" type="checkbox" checked={checked} value={checked} onChange={this.handleNotificationEnabled} />Notification enabled</Col>
            </Row> <br />
            {checked &&
                <Row>
                    {/* disabled  */}
                    <Col><AvField name="notifyDays" label="Notify Days" placeholder="Notify Days" type="number" value={bill.notifyDays} onChange={(e) => { this.handleNotifyDate(e) }} errorMessage="Invalid notify-days" /></Col>
                    <Col><AvField name="notifyDate" label="notify Date" value={this.state.notifyDate} type="date" disabled errorMessage="Invalid Date"
                        validate={{
                            date: { format: 'yyyy/MM/dd' }, dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                            required: { value: true }
                        }}
                    /></Col>
                </Row>
            }
            <FormGroup>
                <Button color="info"> Update </Button> &nbsp;&nbsp;
                    <Button type="button" onClick={this.props.cancelUpdateBill}>Cancel</Button>
            </FormGroup>
        </AvForm>
    }
}
export default UpdateBillForm;