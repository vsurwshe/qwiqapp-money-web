import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Col, Row, FormGroup } from "reactstrap";
import Data from '../../data/SelectData';
import Select from 'react-select';

class UpdateBillForm extends Component {
    render() {
        const { currencies, userAmount, taxPercent, taxAmount, bill, categories, labels, contacts, billType } = this.props.updateForm;
        return (
            <AvForm onSubmit={this.props.updateProps.handleSubmitValue}>
                <Row>
                    <Col sm={3}>
                        <AvField type="select" label="currency" value={bill.currency} name="currency" errorMessage="Select Currency" required>
                            <option value="">Select</option>
                            {currencies.map((currency, key) => { return <option key={key} value={currency.code} h={currency.symbol} symbol={currency.symbol} >{currency.symbol}</option> })}
                        </AvField>
                    </Col>
                    <Col sm={3}>
                        <AvField type="select" name="label" label="Type of Bill" value={billType} errorMessage="Select Type of Bill" required>
                            <option value="">Select Type of Bill</option>
                            <option value="-">Payable</option>
                            <option value="+">Receivable</option>
                        </AvField>
                    </Col>
                    <Col>
                        <AvField name="amount" label="Amount" value={userAmount ? userAmount : 0} placeholder="Amount" type="text"
                            errorMessage="Invalid amount" onChange={e => { this.props.updateProps.handleSetAmount(e) }} required />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AvField name="taxPercent" value={taxPercent} placeholder="0" label="TaxPercent" type="number" errorMessage="Invalid tax%"
                            onChange={(e) => { this.props.updateProps.handleTaxAmount(e) }} />
                    </Col>
                    <Col>
                        <AvField name='dummy' label="Tax Amount" value={taxAmount} placeholder="0" type="number"
                            onChange={(e) => { this.props.updateProps.handleTaxPercent(e) }} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label >Category</label>
                        <Select options={Data.categories(categories)} defaultValue={Data.categories(categories).filter(item => { return item.value === bill.categoryId })}
                            styles={Data.singleStyles} placeholder="Select Categories " onChange={this.props.updateProps.categorySelected} required />
                    </Col>
                </Row> <br />
                <Row>
                    <Col>
                        <AvField name="billDate" label="Bill Date" value={this.props.updateProps.loadDateFormat(bill.billDate)} type="date" errorMessage="Invalid Date"
                            validate={{
                                date: { format: 'yyyy/MM/dd' }, dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
                                required: { value: true }
                            }} />
                    </Col>
                    <Col>
                        <AvField name="dueDays" label="Due Days" value={bill.dueDays} type="number" placeholder="No.of Days" errorMessage="Invalid days" />
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
                        <label >Select Labels</label> {this.props.updateProps.lablesOptions(labels, bill)}</Col>
                </Row><br />
                <Row>
                    <Col>
                        <label >Select Contacts</label>
                        <Select options={Data.contacts(contacts)} defaultValue={Data.contacts(contacts).filter(item => { return item.value === bill.contactId })}
                            placeholder="Select Contacts " onChange={this.props.updateProps.contactSelected} required />
                    </Col>
                </Row><br />
                <FormGroup>
                    <Button color="info"> Update </Button> &nbsp;&nbsp;
                    <Button type="button" onClick={this.props.updateProps.cancelUpdateBill}>Cancel</Button>
                </FormGroup>
            </AvForm>
        );
    }
}

export default UpdateBillForm;
