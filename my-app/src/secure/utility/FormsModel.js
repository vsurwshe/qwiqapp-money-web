import React from 'react';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import { Button, FormGroup, Col, Row, Label, Collapse, Input, Tooltip } from "reactstrap";
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
        <AvField name="dueDays" label="Due Days" placeholder="0" onChange={e => { props.handleDate(e) }} value={dueDays} type="number" errorMessage="Invalid Days" />
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
    {!props.data.moreOptions &&
      <Button className="m-0 p-0" color="link" onClick={() => props.toggleCustom()} aria-expanded={moreOptions} aria-controls="exampleAccordion1">
        More Options
    </Button>}
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
        {getCurrency(currencies, currencyCode)}
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

export const CategoryLabelForm = (props) => {
  const { doubleClick, collapse, parentId, chkMakeParent, type, componentType, items, itemName, itemColor, notes, updateItem } = props.data
  return <AvForm onValidSubmit={props.handleSubmitValue}>
    <AvField type="text" name="name" label={componentType + " name"} errorMessage="Category Name Required" value={itemName} placeholder="Enter Category name" required />
    {componentType === "Label" ? <AvField type="text" name="notes" value={notes} placeholder="Description / Notes" label="Description / Notes" />
      : <AvField type="select" name="type" label="Type" value={type ? type : "EXPENSE_PAYABLE"} errorMessage="Select Type of Category" >
        <option value="EXPENSE_PAYABLE">Payable</option>
        <option value="INCOME_RECEIVABLE">Receivable</option>
      </AvField>
    }
    <AvField type="color" name="color" list="colors" label={componentType + " color"} value={itemColor} />

    {items.length > 0 && // checking Label / Categories are there, then only showing "Nest option" while creating Label / Categories 
      (updateItem ? // checking the item(Label / Categories) is creating / updating, if creating then showing "Nest option"
        (updateItem.parentId ? // Checking whether Label / Categories has ParentId. If parentId is there then we are showing "Make it as Parent" or else checking for subLabel/subcategory 
          (!chkMakeParent && <><Label style={{ paddingLeft: 20 }} check>
            <AvInput type="checkbox" name="makeParent" onChange={props.toggle} /> Make it as Parent </Label> <br /></>) // if selected make it as parent, then assigning "null" to "parentId"
          : !(updateItem.subLabels || updateItem.subCategories) && (!collapse &&
            <><Label style={{ paddingLeft: 20 }} check>
              <AvInput type="checkbox" name="checkbox1" onChange={props.toggle} /> Nest {componentType} under </Label> <br /> </>)) //checking for subItems, if there dont show anything or else showing "Nest option"
        : !collapse && <><Label style={{ paddingLeft: 20 }} check>
          <AvInput type="checkbox" name="checkbox1" onChange={props.toggle} /> Nest {componentType} under </Label> <br /> <br /></>) // If creating Label/ category then showing "Nest option"
    }

    <Collapse isOpen={collapse}>
      <AvField type="select" name="parentId" label={"Select " + componentType + " name"}
        value={parentId} required={collapse}>
        <option value="">Select {componentType}</option>
        {items.map((item, key) => { return <option key={key} value={item.id}>{item.name}</option> })}
      </AvField>
    </Collapse><br />
    <center>
      <FormGroup>
        <Button color="info" disabled={doubleClick} > {props.buttonText} </Button> &nbsp;&nbsp;
        <Button active color="light" type="button" onClick={props.cancelCategory} >Cancel</Button>
      </FormGroup>
    </center>
  </AvForm>
}

export const ContactFormUI = (props) => {
  const { countries, labels, selectedCountry, contact } = props.data
  const { name, organization, phone, address1, address2, email, postcode, state, website } = contact ? contact : ""
  return (<>
    <Row>
      <Col><AvField name="name" placeholder="Name" value={name} validate={{ myValidation: props.nameOrOrganization }} onChange={props.validateOrganization} /></Col>
      <Col><AvField name="organization" placeholder="Organization" value={organization} validate={{ myValidation: props.nameOrOrganization }} onChange={props.validateName} /></Col>
    </Row>
    <Row>
      <Col><AvField name="phone" placeholder="Phone Number" value={phone} validate={{ pattern: { value: '^[0-9*+-]+$' } }} errorMessage="Please enter valid Phone number" required /></Col>
      <Col><AvField name="email" placeholder="Email" type="text" value={email} validate={{ email: true }} errorMessage="Please enter valid Email id" required /></Col></Row>
    <Row>
      <Col><AvField name="address1" placeholder="Address 1" value={address1} /></Col>
      <Col><AvField name="address2" placeholder="Address 2" value={address2} /></Col>
    </Row>
    <Row>
      <Col><AvField name="postcode" placeholder="Postal Code" value={postcode} errorMessage="Enter Valid Postal Code" validate={{ pattern: { value: '^[0-9A-Za-z]' } }} /></Col>
      <Col><AvField name="state" placeholder="State" value={state} /></Col>
      <Col>
        <Input type="select" onChange={e => props.handleCountrySelect(e)} value={selectedCountry} placeholder="Select country" required>
          <option value="">Select Country</option>
          {countries.map((country, key) => {
            return <option key={key} value={country.code}>{country.name + ' (' + country.short + ')'}</option>;
          })}
        </Input>
      </Col>
      <Col><AvField name="website" placeholder="Website" value={website} /></Col>
    </Row>
    <Row><Col>{labels.length === 0 ? <center>You dont have Labels</center> : props.loadAvCollapse(contact)}</Col></Row> <br />
  </>);
}

// ==============ProfileFormUI ===========

export const ProfileFormUI = (props) => {
  const { profile, profileName, tooltipOpen, buttonMessage, currencies } = props.data;
  const currencySymbol = profile ? profile.currency : 'GBP';
  return <div>
    <AvForm onValidSubmit={props.handleSubmit}>
      <Row>
        <Col sm={4}>
          {getCurrency(currencies, currencySymbol)}
        </Col>
        <Col sm={8}>
          <Label>Profile Name :</Label>
          <AvField type="text" name="name" value={profileName} placeholder="Enter Profile name" id="tool-tip" required />
          <Tooltip target="tool-tip" isOpen={tooltipOpen} placement="right" toggle={props.toggle}>Profile Name</Tooltip>
        </Col>
      </Row>
      <center>
        <Button color="success"> {buttonMessage} </Button> &nbsp;
        <Button active color="light" type="button" onClick={props.handleEditProfileCancel}>Cancel</Button>
      </center>
    </AvForm>
  </div>
}

const getCurrency = (currencies, currencySymbol) => {
  if (currencies.length > 0) {
    return <AvField type="select" id="symbol" name="currency" value={currencySymbol} label="Currency">
      <option value=""> Select</option>
      {currencies.map((currency, key) => {
        return <option key={key} value={currency.code}
          data={currency.symbol} symbol={currency.symbol} >{currency.symbol}</option>
      })}
    </AvField>
  }
}
