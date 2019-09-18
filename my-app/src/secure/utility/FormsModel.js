import React from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, FormGroup, Col, Row} from "reactstrap";
import Select from 'react-select';
import Data from '../../data/SelectData';

// ======================= This Bill Form Code =======
export const BillFormUI = (props) => {
  let categoryName;
  const {currencies, doubleClick, dueDate, labels, contacts, categories, billDate, moreOptions, bill, billType,amount, dueDays} = props.data;
  const { currency, description } = bill ? bill  : '';
  if (bill) {
    categoryName = Data.categories(categories).filter(item => { return item.value === bill.categoryId })
  }
 
  return <AvForm onSubmit={props.handleSubmitValue}>
  <Row>
    <Col sm={3}>
      <AvField type="select" id="symbol" name="currency" value={currency } label="Currency" errorMessage="Select Currency" required>
        <option value="">Select</option>
        {currencies.map((currencies, key) => {
          return <option key={key} value={currencies.code}
            data={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option>
        })}
      </AvField>
    </Col>
    <Col sm={3}>
      <AvField type="select" name="label" label="Type of Bill" value={billType} errorMessage="Select Type of Bill" required>
        <option value="">Select Type of Bill</option>
        <option value="-">Payable</option>
        <option value="+">Receivable</option>
      </AvField>
    </Col>
    <Col sm={6}>
      <AvField name="amount" id="amount" label="Amount" value={amount} placeholder="Amount" type="number" errorMessage="Invalid amount"
        onChange={e => { props.handleSetAmount(e) }} required />
    </Col>
  </Row>
  <Row>
    <Col>
      {/* Categories loading in select options filed */}
      <label>Category</label>
      <Select options={Data.categories(categories)} styles={Data.singleStyles} defaultValue={categoryName} placeholder="Select Categories " onChange={props.categorySelected} required /></Col>
    <Col>
    <AvField name="billDate" label="Bill Date" value={billDate} type="date" onChange={(e) => { props.handleBillDate(e) }} errorMessage="Invalid Date" validate={{
      date: { format: 'dd/MM/yyyy' },
      dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
      required: { value: true }
    }} /></Col>
  </Row>
  <Row>
    <Col>
      <AvField name="dueDays" label="Due Days" placeholder="No.of Days" onChange={e => { props.handleDate(e) }} value={dueDays} type="number" errorMessage="Invalid Days" />
    </Col>
    <Col>
      <AvField name="dueDate" label="Due Date" disabled value={dueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} />
    </Col>
  </Row>
  <Row>
    <Col>
      <label>Description/Notes</label>
      <AvField name="description" type="text" list="colors"  value={description}placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
  </Row>
  <Button className="m-0 p-0" color="link" onClick={() => props.toggleCustom()} aria-expanded={moreOptions} aria-controls="exampleAccordion1">
    More Options
  </Button>
  {props.loadMoreOptions(labels, contacts)} <br /> 
  <FormGroup >
    <center>
      <Button color="success" disabled={doubleClick}> {props.buttonText}  </Button> &nbsp;&nbsp;
      <Button type="button" onClick={props.cancel}>Cancel</Button>
    </center>
  </FormGroup>
</AvForm>
}

