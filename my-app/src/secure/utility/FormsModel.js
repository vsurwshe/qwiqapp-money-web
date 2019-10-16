import React from 'react';
import { AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, FormGroup, Col, Row, Input, Label, Collapse } from "reactstrap";
import Select from 'react-select';
import Data from '../../data/SelectData';
import Store from '../../data/Store';

// ======================= This Bill Form Code =======
export const BillFormUI = (props) => {
  let categoryName;
  const { bill, currencies, labels, contacts, categories, type, amount, dueDays, dueDate, billDate, moreOptions, doubleClick } = props.data;
  const { currency, description } = bill ? bill : '';
  if (bill) {
    categoryName = Data.categoriesOrLabels(categories).filter(item => { return item.value === bill.categoryId })
  }
  return <AvForm onSubmit={props.handleSubmitValue}>
    <Row>
      <Col sm={3}>
        <AvField type="select" id="symbol" name="currency" value={currency} label="Currency" errorMessage="Select Currency" required>
          <option value="">Select</option>
          {currencies.map((currencies, key) => {
            return <option key={key} value={currencies.code}
              data={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option>
          })}
        </AvField>
      </Col>
      <Col sm={3}>
        <AvField type="select" name="type" label="Type of Bill" value={type} errorMessage="Select Type of Bill" required>
          <option value="EXPENSE_PAYABLE">Payable</option>
          <option value="INCOME_RECEIVABLE">Receivable</option>
        </AvField>
      </Col>
      <Col sm={6}>
        <AvField name="amount" id="amount" label="Amount" value={amount} placeholder="Amount" type="number" errorMessage="Invalid amount"
          onChange={e => { props.handleSetAmount(e) }} required />
      </Col>
    </Row>
    <Row>
      <Col>
        <label>Category</label>
        <Select options={Data.categoriesOrLabels(categories)} styles={Data.singleStyles} defaultValue={categoryName} placeholder="Select Categories " onChange={props.categorySelected} required /></Col>
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
        <label>Description / Notes</label>
        <AvField name="description" type="text" list="colors" value={description} placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
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


// ======================= This RecurBill Form Code =======
export const RecurBillFormUI = (props) => {
  const { currencies, categories, categoryName, billDate, dueDays, dueDate, description, updateAmount, currencyCode, billType, doubleClick, moreOptions } = props.data
  return <AvForm onSubmit={props.handleSubmitValue}>
    <Row>
      <Col sm={3}>
        <AvField type="select" id="symbol" name="currency" value={currencyCode} label="Currency" errorMessage="Select Currency" required>
          <option value="">Select</option>
          {currencies.map((currencies, key) => {
            return <option key={key} value={currencies.code}
              data={currencies.symbol} symbol={currencies.symbol} >{currencies.symbol}</option>
          })}
        </AvField>
      </Col>
      <Col sm={3}>
        <AvField type="select" name="type" label="Type of Bill" value={billType} errorMessage="Select Type of Bill" required>
          <option value="EXPENSE_PAYABLE">Payable</option>
          <option value="INCOME_RECEIVABLE">Receivable</option>
        </AvField>
      </Col>
      <Col sm={6}>
        <AvField name="amount" id="amount" label="Amount" value={updateAmount > 0 ? updateAmount : -(updateAmount)} placeholder="Amount" type="number" errorMessage="Invalid amount"
          onChange={e => { props.handleSetAmount(e) }} required />
      </Col>
    </Row>
    <Row>
      <Col>
        <label >Category</label>
        <Select options={Data.categoriesOrLabels(categories)} defaultValue={categoryName} styles={Data.singleStyles} placeholder="Select Categories " onChange={props.categorySelected} required /></Col>
      <Col><AvField name="billDate" label="Bill Date" value={billDate} type="date"
        onChange={(e) => { props.handleBillDate(e) }} errorMessage="Invalid Date" validate={{
          date: { format: 'dd/MM/yyyy' },
          dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
          required: { value: true }
        }} /></Col>
    </Row>
    <Row>
      <Col><AvField name="dueDays" label="Due Days" placeholder="No.of Days" onChange={e => { props.handleDate(e) }} value={dueDays} type="number" errorMessage="Invalid Days" /></Col>
      <Col><AvField name="dueDate" label="Due Date" disabled value={dueDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} /></Col>
    </Row>
    {Store.getProfile().type > 0 && props.selectEveryRecurBill()}
    <Row>
      <Col>
        <label >Description / Notes</label>
        <AvField name="description" type="text" list="colors" value={description} placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
    </Row>
    <Button className="m-0 p-0" color="link" onClick={() => props.toggleCustom()} aria-expanded={moreOptions} aria-controls="exampleAccordion1"> More Options </Button>
    {moreOptions && <LoadMoreOptions data={props} moreOptions={moreOptions} />
    }
    <FormGroup >
      <center><Button color="success" disabled={doubleClick}> {props.buttonText} </Button> &nbsp;&nbsp;
      <Button type="button" onClick={props.cancelRecurBill}>Cancel</Button></center>
    </FormGroup>
  </AvForm>
}

export const LoadMoreOptions = (props) => {
  let labelName, contactName;
  const { labels, contacts, recurBill, taxPercent, taxAmount, checked, notifyDate, notifyDays } = props.data.data
  if (recurBill) {
    const options = Data.categoriesOrLabels(labels);
    labelName = !recurBill.labelIds ? '' : recurBill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat();
    contactName = Data.contacts(contacts).filter(item => { return item.value === recurBill.contactId })
  }
  let taxAmt = taxAmount > 0 ? taxAmount : -taxAmount
  return <Collapse isOpen={props.moreOptions} data-parent="#exampleAccordion"><br />
    <Row>
      <Col>
        <AvField name="taxPercent" id="taxPercent" value={taxPercent} placeholder={0} label="Tax (in %)" type="number" onChange={(e) => { props.data.handleTaxAmount(e) }} />
      </Col>
      <Col>
        <AvField name='dummy' label="Tax Amount" value={Math.round(taxAmt * 100) / 100} placeholder="0" type="number" onChange={(e) => { props.data.handleTaxPercent(e) }} />
      </Col>
    </Row>
    <Row>
      <Col>
        <label >Select Labels</label>
        <Select isMulti options={Data.categoriesOrLabels(labels)} defaultValue={labelName} styles={Data.colourStyles} placeholder="Select Labels " onChange={props.data.labelSelected} /></Col>
      <Col>
        <label >Contact Name</label>
        <Select options={Data.contacts(contacts)} defaultValue={contactName} placeholder="Select Contact " onChange={props.data.contactSelected} /></Col>
    </Row><br />
    <Row style={{ marginLeft: 7 }}>
      <Col><Input name="check" type="checkbox" checked={checked} onChange={props.data.handleChackboxState} />Enable Notification</Col>
    </Row> <br />
    {checked && <LoadNotifications notifyDays={notifyDays} notifyDate={notifyDate} handleDate={props.data.handleDate} />}
  </Collapse>
}

export const LoadNotifications = (props) => {
  return <Row>
    <Col><AvField name="notifyDays" label="Notify Days" placeholder="Ex: 2" value={props.notifyDays} type="number" onChange={(e) => { props.handleDate(e) }} errorMessage="Invalid notify-days" /></Col>
    <Col><AvField name="notifyDate" label="notify Date" disabled value={props.notifyDate} type="date" errorMessage="Invalid Date" validate={{ date: { format: 'dd/MM/yyyy' } }} /></Col>
  </Row>
}

// =============== Categories Form =============

export const CategoryFormUI = (props) => {
  const { doubleClick, collapse, categories, categoryName, categoryColor, parentId, chkMakeParent } = props.data
  return <AvForm onValidSubmit={props.handleSubmitValue}>
    <AvField type="text" name="name" label="Category Name " errorMessage="Category Name Required" value={categoryName} placeholder="Enter Category name" required />
    <AvField type="color" name="color" list="colors" label="Category Color" value={categoryColor} placeholder="Enter Category Color" />
    <AvGroup check>
      {  //While user wants to make it as subcategory while adding or editing category, Collapse is displayed based on this condition
        !collapse && !parentId ?
          <Label check> <AvInput type="checkbox" name="checkbox1" onChange={props.toggle} /> Nest Category under </Label> :
          (parentId && !chkMakeParent) && <Label check> <AvInput type="checkbox" name="makeParent" onChange={props.toggle} /> Make it as Parent </Label>
        //  While updating a subcategory(it has parentId), Make it as Parent option is shown depending on the 'chkMakeParent' value
      }
    </AvGroup><br />
    <Collapse isOpen={collapse}>
      <AvField type="select" name="parentId" label="SelectParent Category" onChange={e => { props.handleInput(e) }} value={parentId} required={collapse}>
        <option value="">Select Category</option>
        {categories.map((category, key) => { return <option key={key} value={category.id}>{category.name}</option> })}
      </AvField>
    </Collapse><br />
    <FormGroup>
      <Button color="info" disabled={doubleClick} > {props.buttonText} </Button> &nbsp;&nbsp;
      <Button active color="light" type="button" onClick={props.cancelCategory} >Cancel</Button>
    </FormGroup>
  </AvForm>
}