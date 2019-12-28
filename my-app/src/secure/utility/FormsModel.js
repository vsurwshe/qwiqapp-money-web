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
  const { currency, description, reference } = bill ? bill : Store.getProfile();
  if (bill) {
    categoryName = Data.categoriesOrLabels(categories).filter(item => { return item.value === bill.categoryId })
  }
  return <AvForm onSubmit={props.handleSubmitValue}>
    <Row>
      <Col sm={4}>
        <Row>
          <Col sm={3} md={3}> <label>Currency</label> </Col>
          <Col sm={9} md={9}>
            <AvField type="select" id="symbol" name="currency" value={currency} disabled={!featureMultiCurrency} errorMessage="Select Currency" required>
              <option value="">Select</option>
              {currencies.map((currency, key) => {
                return <option key={key} value={currency.code}
                  data={currency.symbol} symbol={currency.symbol} >{currency.code + " - " + currency.name}</option>
              })}
            </AvField></Col>
        </Row>
      </Col>
      <Col sm={4}>
        <Row>
          <Col sm={3} md={3}> <label>Billtype</label> </Col>
          <Col sm={9} md={9}> <AvField type="select" name="amountType" value={type} errorMessage="Select Type of Bill" required>
            <option value={billType.PAYABLE}>Payable</option>
            <option value={billType.RECEIVABLE}>Receivable</option>
          </AvField> </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col sm={3} md={3}> <label>Amount<b className="text-color">*</b></label> </Col>
          <Col sm={9} md={9}> <AvField name="amount" id="amount" value={amount} placeholder="Amount" type="number" errorMessage="Invalid amount"
            onChange={e => { props.handleSetAmount(e) }} required />
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col sm={4}>
        <Row>
          <Col sm={3} md={3}> <label>Category<b className="text-color">*</b> </label></Col>
          <Col sm={9} md={9}>
            <Select options={Data.categoriesOrLabels(categories)} styles={Data.singleStyles} defaultValue={categoryName} placeholder="Select Categories " onChange={props.categorySelected} required />
          </Col>
        </Row>
      </Col>
      <Col sm={4}>
        <Row>
          <Col sm={3} md={3}> <label>Billdate</label></Col>
          <Col sm={9} md={9}> <AvField name="billDate" value={billDate} type="date" onChange={(e) => { props.handleBillDate(e) }} errorMessage="Invalid Date" validate={{
            date: { format: 'dd/MM/yyyy' },
            dateRange: { format: 'YYYY/MM/DD', start: { value: '1900/01/01' }, end: { value: '9999/12/31' } },
            required: { value: true }
          }} /></Col>
        </Row>
      </Col>
      <Col>
        <div style={{ paddingLeft: 18 }}>
          <Row> Due in &nbsp;
            <AvField name="dueDays" placeholder="0" onChange={e => { props.handleDate(e) }} value={dueDays} type="number" style={{ all: 'unset', borderBottom: '1px solid', width: 50 }} errorMessage="Invalid Days" /> &nbsp;  days from Bill date, on {dueDate}
          </Row>
        </div>
      </Col>
    </Row>
    <Row>
      <Col >
        <Row>
          <Col sm={1}> <label>Reference</label></Col>
          <Col><AvField name="reference" type="text" list="colors" value={reference} placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col>
        <Row>
          <Col sm={1}> <label>Description / Notes</label> </Col>
          <Col> <AvField name="description" type="textarea" list="colors" value={description} placeholder="Ex: Recharge" errorMessage="Invalid Notes" /></Col>
        </Row>
      </Col>
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
    <Row>
      <Col sm={3} >
        <Label><>{componentType} name <b className="text-color"> * </b></></Label>
      </Col>
      <Col sm={8}>
        <AvField type="text" name="name" errorMessage={componentType + " name required"} value={itemName} placeholder={"Enter " + componentType.toLowerCase() + " name"} required />
      </Col>
    </Row>
    {componentType === "Label" ?
      <Row>
        <Col sm={3} >
          <Label>Description / Notes </Label>
        </Col>
        <Col sm={8}> <AvField type="textarea" name="notes" value={notes} placeholder="Description / Notes" /> </Col>
      </Row>
      : <Row>
        <Col sm={3} > <Label>Type</Label> </Col>
        <Col sm={8}><AvField type="select" name="type" value={type ? type : billType.PAYABLE} errorMessage="Select Type of Category" >
          <option value={billType.PAYABLE}>Payable</option>
          <option value={billType.RECEIVABLE}>Receivable</option>
        </AvField></Col>
      </Row>
    }
    <Row>
      <Col sm={3} > <Label>{componentType + " color"} </Label> </Col>
      <Col sm={8}><AvField type="color" name="color" list="colors" value={itemColor} /> </Col>
    </Row>

    {items && (items.length > 0 && // checking Label / Categories are there, then only showing "Nest option" while creating Label / Categories 
      (updateItem ? // checking the item(Label / Categories) is creating / updating, if creating then showing "Nest option"
        (updateItem.parentId ? // Checking whether Label / Categories has parentId. If parentId is there then we are showing "Make it as Parent" or else checking for subLabel/subcategory 
          (!chkMakeParent && <><Label style={{ paddingLeft: 20 }} check>
            <AvInput type="checkbox" name="makeParent" onChange={props.toggle} /> Make it as Parent </Label> <br /><br /></>) // if selected make it as parent, then assigning "null" to "parentId"
          : !(updateItem.subLabels || updateItem.subCategories) && // Checking whether Label / Categories has subLabels/subCategories. If subLabels/subCategories are not there then showing "nest option"
          <><Label style={{ paddingLeft: 20 }} check>
            <AvInput type="checkbox" name="checkbox1" onChange={props.toggle} /> Nest {componentType.toLowerCase()} under </Label> <br /><br /> </>) //checking for subItems, if there dont show anything or else showing "Nest option"
        : <><Label style={{ paddingLeft: 20 }} check>
          <AvInput type="checkbox" name="checkbox1" onChange={props.toggle} /> Nest {componentType.toLowerCase()} under </Label> <br /> <br /></>) // If creating Label/ category then showing "Nest option"
    )
    }

    {/* It loads the options of Labels/Categories, when user selects Nest Category/label under */}
    {collapse && <Collapse isOpen={collapse}>
      <Row>
        <Col sm={3}> <Label>{"Select parent " + componentType.toLowerCase()}</Label> </Col>
        <Col sm={8}>
          <AvField type="select" name="parentId" value={parentId} required={collapse}>
            <option value="">Select parent {componentType}</option>
            {items.map((item, key) => { return <option key={key} value={item.id}>{item.name}</option> })}
          </AvField>
        </Col>
      </Row>
    </Collapse>}<br />
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
    </Row>
    <Row>
      <Col>
        <AvField name="website" placeholder="Website" value={website} />
      </Col>
      <Col> {(labels && labels.length) ? props.loadAvCollapse(contact) : <center>You don't have Labels</center>} </Col>
    </Row> <br />
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
    <Col sm={12} md={{ size: 8, offset: 1 }} lg={{ size: 5, offset: 3 }}>
      {!profileName && showProfileType(props, profileType, profileTypes)}  {/* This method is called when user clicks on create profile (no profile name) */}
      {!action || (profileType === 0) ?
        // This Block execute only when user action is null or user selects to create a Free Profile
        showProfileForm(props, profile, profileName, profileTypes, currencies, currencySymbol, user, buttonMessage, userConfirmUpgrade)
        // This Block execute when user actions are "ADD_BILLING" , "ADD_CREDITS_LOW" & "VERIFY_EMAIL"
        : <>
          <Row>
            {(user.action === userAction.ADD_CREDITS || user.action === userAction.ADD_CREDITS_LOW) ? <Col sm={{ size: 12, offset: 1 }} md={{ size: 12, offset: 1 }}><p>! No sufficient credits available to create new profile, please click on add credits to make a payment. </p><br /></Col>
              : <Col sm={{ size: 8, offset: 1 }} md={{ size: 12, offset: 1 }} ><p>! No billing address added, please click on add billing to continue. </p><br /></Col>}
          </Row>
          <center>
            <Row>
              <Col sm={{ size: 8, offset: 1 }} md={{ size: 8, offset: 2 }}>
                <Button type="button" color="info"><Link to={url} style={{ color: "black" }}> {action === userAction.ADD_BILLING ? "Add Billing" : "Add Credits"}</Link></Button> &nbsp;
                <Button active color="light" type="button" onClick={props.handleEditProfileCancel}>Cancel</Button> &nbsp;
              </Col>
            </Row>
          </center>
        </>
      }
    </Col>
  </AvForm>
}

const showProfileType = (props, profileType, profileTypes) => {
  return <Row>
    <Col sm={3}><Label style={{ marginTop: 7 }}>Profile Type</Label> </Col>
    <Col sm={8}>
      <AvField type="select" id="symbol" name="type" onChange={props.setButtonText} value={profileType}>
        {profileTypes.map((profile, key) => { return <option key={key} value={profile.type} data={profile.symbol} symbol={profile.symbol} >{`${profile.name} - ${profile.cost} per month - ${profile.description}`}</option> })}
      </AvField></Col>
  </Row>
}

// Currency for profile form
const getCurrency = (currencies, currencySymbol) => {
  if (currencies.length) {
    return <div>
      <Row>
        <Col sm={3}><Label>Default Currency </Label> </Col>
        <Col sm={8}><AvField type="select" id="symbol" name="currency" value={currencySymbol}>
          {currencies.map((currency, key) => { return <option key={key} value={currency.code} data={currency.symbol} symbol={currency.symbol} >{currency.code + " - " + currency.name}</option> })}
        </AvField>
        </Col>
      </Row>
    </div>
  }
}

const showProfileUpgrade = (props, profile, profileTypes) => {
  return <><Row>
    <Col sm={3}><Label>Profile type  </Label></Col>
    <Col sm={9}>&nbsp;{props.loadProfileType(profile.type)} &nbsp;&nbsp;&nbsp;
      <UpgradeProfileType userProfile={profile} profileTypes={profileTypes} handleUserConfirm={props.handleUserConfirm} />
    </Col>
  </Row><br /></>
}

const showProfileForm = (props, profile, profileName, profileTypes, currencies, currencySymbol, user, buttonMessage, userConfirmUpgrade) => {
  return <>
    <Row>
      <Col sm={3}><Label>Profile Name</Label> </Col>
      <Col sm={8}><AvField type="text" name="name" value={profileName} placeholder="Enter Profile name" id="tool-tip" required /> </Col>
    </Row>
    {getCurrency(currencies, currencySymbol)}<br />
    {((user && !user.action) && (profile && profile.upgradeTypes)) && showProfileUpgrade(props, profile, profileTypes)}
    {userConfirmUpgrade && confirmDeleteModel(props, userConfirmUpgrade)}
    <center>
      <Row> <Col sm={{ size: 8, offset: 3 }} md={{ size: 8, offset: 3 }} lg={{ size: 8, offset: 2 }} >
        <Button color="success"> {buttonMessage} </Button>&nbsp;&nbsp;
        <Button active color="light" type="button" onClick={props.handleEditProfileCancel}>Cancel</Button>
      </Col> </Row>
    </center>
  </>
}

const confirmDeleteModel = (props, userConfirmUpgrade) => {
  return <DeleteModel danger={userConfirmUpgrade} headerMessage="Upgrade Profile" toggleDanger={props.handleUserConfirm} delete={props.handleUpgradeProfile}
    bodyMessage="Upgrading a profile may incur some charges. Are you sure you want to upgrade " buttonText="Upgrade Profile" cancel={props.handleConfirmUpgrade} />
}
