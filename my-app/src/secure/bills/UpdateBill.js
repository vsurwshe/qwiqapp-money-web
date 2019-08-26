import React, { Component } from "react";
import { Col, Alert,Card, CardHeader } from "reactstrap";
import Select from 'react-select';
import Lables from "./Bills";
import BillApi from "../../services/BillApi";
import Data from '../../data/SelectData';
import Bills from "./Bills";
import Config from "../../data/Config";
import UpdateBillForm from "./UpdateBillForm";
import Store from "../../data/Store";

class UpdateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertColor: "#000000",
      content: '',
      updateSuccess: false,
      profileId: props.pid,
      labels: props.lables,
      categories: props.categories,
      contacts: props.contacts,
      bill: props.bill,
      labelOption: props.bill.labelIds,
      categoryOptionUpdate: false,
      labelOptionUpdate: false,
      contactOptionUpdate: false,
      contactOption: props.bill.coontactId,
      categoryOption: props.bill.categoryId,
      currencies: [],
      userAmount: props.bill.amount,
      cancelUpdateBill: false,
      taxPercent: props.bill.taxPercent,
      taxAmount: props.bill.taxAmount, 
      sign: '',
      singClicked: false,
      taxAmtChanged: false,
      billTypeColor: props.bill.amount<0 ? "red" : "green",
      billTypeRequest: props.bill.amount<0 ? false : true,
      billTypeSymbol: props.bill.amount<0 ? "-" : "+",
      billType: props.bill.amount<0 ? "EXPENSE" : "INCOME"
    };
  }

  componentDidMount = async () => {
    let splitVal = (""+ this.state.userAmount).split('-')
    let taxAmt = (""+ this.state.taxAmount).split('-')
    if (splitVal.length === 1) {
      this.setState({userAmount: splitVal[0]});
    } else {
      this.setState({userAmount: splitVal[1], sign: splitVal[0]});
    }
    if ( taxAmt.length === 1 ) {
      this.setState({taxAmount: taxAmt[0]});
    } else {
      this.setState({taxAmount: taxAmt[1]});
    }
    const currencies =Store.getCurrencies();
      this.setState({ currencies })
  }

  cancelUpdateBill = () => {
    this.setState({ cancelUpdateBill: true })
  }

  // handle form submission values and errors
  handleSubmitValue = (event, errors, values) => {
    const { labelOption, categoryOption, categoryOptionUpdate, labelOptionUpdate, contactOptionUpdate, contactOption } = this.state
    if (errors.length === 0) {
      let billDate = values.billDate.split("-")[0] + values.billDate.split("-")[1] + values.billDate.split("-")[2];
      const newData = {
        ...values, "billDate": billDate, "categoryId": categoryOptionUpdate ? categoryOption.value : categoryOption,
        "contactId": contactOptionUpdate ? contactOption.value : contactOption,
        "labelIds": labelOption === null || labelOption === [] ? [] : (labelOptionUpdate ? labelOption.map(opt => { return opt.value }) : labelOption), "version": this.props.bill.version
      }
      newData.amount = parseInt(this.state.billTypeSymbol+ newData.amount)
      delete newData.label;
      delete newData.dummy;
      this.handleUpdate(event, newData);
    }
  }

  handleUpdate = (e, data) => {
    new BillApi().updateBill(this.successCall, this.errorCall, data, this.state.profileId, this.props.bill.id)
  };

  // updated bill
  successCall = json => {
    this.callAlertTimer("success", "Bill Updated Successfully... ");
  };

  // updated bill Error messages
  errorCall = err => {
    this.callAlertTimer("danger", "Unable to process request, Please Try Again... ");
  };

  // shows the response messages for user
  callAlertTimer = (alertColor, content) => {
    this.setState({ alertColor, content });
    setTimeout(() => {
      this.setState({ name: '', alertColor: '', updateSuccess: true });
    }, Config.notificationMillis);
  };

  labelSelected = (labelOption) => {
    this.setState({ labelOption, labelOptionUpdate: true })
  }

  categorySelected = (categoryOption) => {
    this.setState({ categoryOption, categoryOptionUpdate: true })
  }

  contactSelected = (contactOption) => {
    this.setState({ contactOption, contactOptionUpdate: true })
  }

  handleSetAmount = async e =>{
    await this.setState({userAmount: e.target.value});
    this.setTaxAmt(this.state.taxPercent)
  }

  handleTaxAmount = (e) => {
    let taxPercentage = parseInt(e.target.value);
    this.setTaxAmt(taxPercentage);
  }

  setTaxAmt = (taxPercentage) => {
    const {userAmount}  = this.state;
    let taxAmount;
    if ( userAmount && taxPercentage >= 0) {
      taxAmount = userAmount - ( userAmount * 100)/(taxPercentage +100) ;
    } 
    this.setState({taxAmount: taxAmount, taxPercent: taxPercentage });
  }

  handleTaxPercent = (e) => {
    const {userAmount}  = this.state;
    let taxAmtVal = parseInt(e.target.value);
    let taxPercent;
    if ( userAmount && taxAmtVal >= 0) {
      taxPercent = (userAmount * 100)/(userAmount - taxAmtVal) - 100 ;
    } 
    this.setState({taxAmount: taxAmtVal, taxPercent: taxPercent });
  }

  handleSign = () => {
    this.setState({singClicked: true});
  }

  render() {
    const { alertColor, content, updateSuccess, cancelUpdateBill } = this.state;
    if (cancelUpdateBill) {
      return <Bills />
    } else {
      return <div>{updateSuccess ? <Lables /> : this.updateFormFiled(alertColor, content)}</div>
    }
  }

  loadHeader = () => <CardHeader><strong>Update Bill</strong></CardHeader>

  handleBillType = async () =>{
    await this.setState({billTypeRequest: !this.state.billTypeRequest});
    this.handleBillTypeText()
  }
  handleBillTypeText = () =>{
    if (this.state.billTypeRequest) {
      this.setState({billTypeColor: "green", billTypeSymbol: "+", billType: "RECEIVABLE"});
    } else {
      this.setState({billTypeColor: "red", billTypeSymbol: "-", billType: "PAYABLE"});
    }
  }

  // when updating Form
  updateFormFiled = (alertColor, content) => {
    return (
      <div className="animated fadeIn" >
        <Card>
          {this.loadHeader()}
          <Col sm="12" md={{ size: 7, offset: 3 }}>
            <br />
            {alertColor === "" ? "" : <Alert color={alertColor}>{content}</Alert>}
            <UpdateBillForm updateForm={this.state} handleSubmitValue={this.handleSubmitValue} handleBillType={this.handleBillType} 
            handleSetAmount={this.handleSetAmount} handleTaxAmount={this.handleTaxAmount} handleTaxPercent= {this.handleTaxPercent} 
            contactSelected={this.contactSelected} lablesOptions={this.lablesOptions} categorySelected={this.categorySelected}
            loadDateFormat={this.loadDateFormat} cancelUpdateBill={this.cancelUpdateBill} />
          </Col>
        </Card>
      </div>)
  }

  loadDateFormat = (dateParam) => {
    let toStr = "" + dateParam
    let dateString = toStr.substring(0, 4) + "-" + toStr.substring(4, 6) + "-" + toStr.substring(6, 8)
    let date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);  //finalDate;
  }

  lablesOptions = (labels, bill) => {
    const options = Data.labels(labels)
    const data = bill.labelIds === null ? '' : bill.labelIds.map(id => { return options.filter(item => { return item.value === id }) }).flat();
    return <Select isMulti options={options} defaultValue={data} styles={Data.colourStyles} placeholder="Select Lables " autoFocus={true} onChange={this.labelSelected} />;
  }
}

export default UpdateBill;
