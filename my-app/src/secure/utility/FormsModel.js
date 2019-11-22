import React from 'react';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import { Button, FormGroup, Col, Row, Label, Collapse, Input } from "reactstrap";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Data from '../../data/SelectData';
import Store from '../../data/Store';
import { userAction, profileFeature, billType, DEFAULT_CURRENCY } from '../../data/GlobalKeys';
import '../../css/style.css';
import { UpgradeProfileType } from '../profiles/UpgradeProfileType';
import { DeleteModel } from './DeleteModel';

// ======================= This Bill Form Code =======
export const BillFormUI = (props) => {
  const featureMultiCurrency = Store.getProfile().features.includes(profileFeature.MULTICURRENCY);
  let categoryName;
  const { bill, currencies, labels, contacts, categories, type, amount, dueDays, dueDate, billDate, moreOptions, doubleClick } = props.data;
  
  // If bill exists, take currency from bill. If not, takes the default currency from selected Profile
  const { currency, description } = bill ? bill : Store.getProfile(); 
  if (bill) {
    categoryName = Data.categoriesOrLabels(categories).filter(item => { return item.value === bill.categoryId })
  }
  return <AvForm onSubmit={props.handleSubmitValue}>
    <Row>
      <Col sm={3}>
        <AvField type="select" id="symbol" name="currency" value={currency} disabled={!featureMultiCurrency} label="Currency" errorMessage="Select Currency" required>
          <option value="">Select</option>
          {currencies.map((currency, key) => {
            return <option key={key} value={currency.code}
              data={currency.symbol} symbol={currency.symbol} >{currency.code + " - "+ currency.name}</option>
          })}
        </AvField>
      </Col>
      <Col sm={3}>
        <AvField type="select" name="amountType" label="Type of Bill" value={type} errorMessage="Select Type of Bill" required>
          <option value={billType.PAYABLE}>Payable</option>
          <option value={billType.RECEIVABLE}>Receivable</option>
        </AvField>
      </Col>
      <Col sm={6}>
        <AvField name="amount" id="amount" label={<>Amount <b className="text-color"> *</b></>} value={amount} placeholder="Amount" type="number" errorMessage="Invalid amount"
          onChange={e => { props.handleSetAmount(e) }} required />
      </Col>
    </Row>
    <Row>
      <Col>
        <label > Category <b className="text-color">*</b> </label>
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
        <AvField name="description" type="textarea" list="colors" value={description} placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
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

// =============== Categories Form =============
export const CategoryLabelForm = (props) => {
  const { doubleClick, collapse, parentId, chkMakeParent, type, componentType, items, itemName, itemColor, notes, updateItem, hideCancel } = props.data
  return <AvForm onValidSubmit={props.handleSubmitValue}>
    <AvField type="text" name="name" label={<>{componentType} Name <b className="text-color"> * </b></>} errorMessage={componentType + " Name Required"} value={itemName} placeholder={"Enter "+ componentType +" name"} required />
    {componentType === "Label" ? <AvField type="textarea" name="notes" value={notes} placeholder="Description / Notes" label="Description / Notes" />
      : <AvField type="select" name="type" label="Type" value={type ? type :billType.PAYABLE } errorMessage="Select Type of Category" >
        <option value={billType.PAYABLE}>Payable</option>
        <option value={billType.RECEIVABLE}>Receivable</option>
      </AvField>
    }
    <AvField type="color" name="color" list="colors" label={componentType + " Color"} value={itemColor} />

    {items && (items.length > 0 && // checking Label / Categories are there, then only showing "Nest option" while creating Label / Categories 
      (updateItem ? // checking the item(Label / Categories) is creating / updating, if creating then showing "Nest option"
        (updateItem.parentId ? // Checking whether Label / Categories has ParentId. If parentId is there then we are showing "Make it as Parent" or else checking for subLabel/subcategory 
          (!chkMakeParent && <><Label style={{ paddingLeft: 20 }} check>
            <AvInput type="checkbox" name="makeParent" onChange={props.toggle} /> Make it as Parent </Label> <br /></>) // if selected make it as parent, then assigning "null" to "parentId"
          : !(updateItem.subLabels || updateItem.subCategories) && (!collapse &&
            <><Label style={{ paddingLeft: 20 }} check>
              <AvInput type="checkbox" name="checkbox1" onChange={props.toggle} /> Nest {componentType} under </Label> <br /> </>)) //checking for subItems, if there dont show anything or else showing "Nest option"
        : !collapse && <><Label style={{ paddingLeft: 20 }} check>
          <AvInput type="checkbox" name="checkbox1" onChange={props.toggle} /> Nest {componentType} under </Label> <br /> <br /></>)) // If creating Label/ category then showing "Nest option"
    }

    <Collapse isOpen={collapse}>
      <AvField type="select" name="parentId" label={"Select " + componentType + " name"}
        value={parentId} required={collapse}>
        <option value="">Select {componentType}</option>
        {items && items.map((item, key) => { return <option key={key} value={item.id}>{item.name}</option> })}
      </AvField>
    </Collapse><br />
    <center>
      <FormGroup>
        <Button color="info" disabled={doubleClick} > {props.buttonText} </Button> &nbsp;&nbsp;
        {!hideCancel && <Button active color="light" type="button" onClick={props.cancelCategory} >Cancel</Button>}
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
    <Row><Col>{labels && (!labels.length ? <center>You dont have Labels</center> : props.loadAvCollapse(contact))}</Col></Row> <br />
  </>);
}

// ==============ProfileFormUI ===========

export const ProfileFormUI = (props) => {
  const { profile, profileName, buttonMessage, currencies, profileType, profileTypes, action, user, userConfirmUpgrade } = props.data;
  const currencySymbol = profile ? profile.currency : DEFAULT_CURRENCY;
  let url = action === userAction.VERIFY_EMAIL ? "/verify" : (action === userAction.ADD_BILLING ? "/billing/address" : "/billing/paymentHistory");
  // Default value set while creating profile in AvForm
  const defaultValues = { type: 0 }
  return <AvForm onValidSubmit={props.handleSubmit} model={defaultValues}>
        {!profileName && <Row>
        <Col sm={3} ><Label>Profile Types</Label> </Col>
        <Col sm={6}>
        <AvField type="select" id="symbol" name="type" onChange={props.setButtonText} value={profileType}>  
        {profileTypes.map((profile, key) => { return <option key={key} value={profile.type} data={profile.symbol} symbol={profile.symbol} >{`${profile.name} ${"-"} ${profile.cost} ${"per month - "} ${profile.description}`}</option> })}
      </AvField></Col>
        </Row>}
    {!action || (profileType === 0) ?
      // This Block execute only when user action is null or user selects to create a Free Profile
      <> 
      <Row>
        <Col sm={3}> <Label>Profile Name</Label> </Col>
        <Col sm={6}><AvField type="text" name="name" value={profileName} placeholder="Enter Profile name" id="tool-tip" required /> </Col>      
      </Row>
      {getCurrency(currencies, currencySymbol)} <br/><br/>
        <center>
          <FormGroup>
            <Row>
              <Button color="success"> {buttonMessage} </Button> &nbsp;
              <Button active color="light" type="button" onClick={props.handleEditProfileCancel}>Cancel</Button>
              {user && !user.action && <UpgradeProfileType userProfile={profile} profileTypes={profileTypes} handleUserConfirm={props.handleUserConfirm}/>}
            </Row>
          </FormGroup>
          {/* {props.handleConfirmUpgrade} */}
          { userConfirmUpgrade && <DeleteModel
          danger={userConfirmUpgrade}
          headerMessage="Upgrade Profile"
          bodyMessage="Upgrading a profile may incur some charges. Are you sure you want to upgrade "
          toggleDanger={props.handleUserConfirm}
          delete={props.handelUpgradeProfile}
          cancel={props.handleConfirmUpgrade}
          buttonText="Upgrade Profile"
        />}
        </center>
      </> :
      // This Block execute when user actions are "ADD_BILLING" , "ADD_CREDITS_LOW" & "VERIFY_EMAIL"
      <center>
        <Button type="button" color="info"><Link to={url} style={{ color: "black" }}> {action}</Link></Button> &nbsp;
        <Button active color="light" type="button" onClick={props.handleEditProfileCancel}>Cancel</Button> &nbsp;
      </center>
    }
  </AvForm>
}

// Currency for profile form
const getCurrency = (currencies, currencySymbol) => {
  if (currencies.length) {
    return <div>
      <Row>
      <Col sm={3}> <Label>Default Currency </Label> </Col>
      <Col sm={6}> <AvField type="select" id="symbol" name="currency" value={currencySymbol}>  
        {currencies.map((currency, key) => { return <option key={key} value={currency.code} data={currency.symbol} symbol={currency.symbol} >{currency.code + " - " + currency.name}</option> })}
      </AvField>
      </Col></Row>
    </div>
  }
}
