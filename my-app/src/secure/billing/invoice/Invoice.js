import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { UserInvoiceApi } from '../../../services/UserInvoiceApi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Store from '../../../data/Store';
import '../../../css/style.css';
import GeneralApi from '../../../services/GeneralApi';
import BillingAddressApi from '../../../services/BillingAddressApi';
import ReactToPrint from 'react-to-print';
import InvoiceConvertPdfFile from './InvoiceConvertPdfFile';

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceId: props.match.params.id,
            invoiceData: '',
            user: Store.getUser(),
            businessAddress: '',
            userBillingAddress: [],
        }
    }

    componentDidMount = () => {
        new UserInvoiceApi().showInvoice(this.successCall, this.errorCall, this.state.invoiceId);
        new GeneralApi().settings(this.settingsSuccessCall, this.errorCall);
        new BillingAddressApi().getBillings(this.userBillingAddress, this.errorCall);
    }

    settingsSuccessCall = (businessAddress) => {
        this.setState({ businessAddress })
    }

    successCall = (response) => {
        response.then((resp) => {
            this.setState({ invoiceData: resp.data });
        })
    }

    userBillingAddress = (userBillingAddress) => {
        this.setState({ userBillingAddress });
    }

    errorCall = (error) => {
        console.log(error)
    }
    
    render() {
        const { invoiceData, businessAddress, userBillingAddress } = this.state;
        let rowData;
        if (invoiceData.invoiceItems) {
            rowData = invoiceData.invoiceItems.map((invoice, index) => {
                return (<tr key={index} className="row-text-align">
                    <td>{invoice.quantity}</td>
                    <td>{invoice.description} </td>
                    <td>{invoice.price}</td>
                    <td>{invoice.taxPercent}%</td>
                    <td>{invoice.grossTotal}</td>
                </tr>)
            })
        }
        return this.invoiceTable(rowData, invoiceData, userBillingAddress, businessAddress);
    }

    callDownload = () => {
        html2canvas(document.querySelector("#download")).then(canvas => {
            document.body.appendChild(canvas);  // if you want see your screenshot in body.
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("download.pdf"); 
        });
    }
    invoiceTable = (invoice, invoiceData, userBillingAddress, businessAddress) => {
        const { firstName, lastName, company, addressLine1, addressLine2, city, region, postCode, country } = userBillingAddress;
        const { business, address1, address2, address4, address3, contact, taxRef } = businessAddress;
        const { invoiceDate, netTotal, taxTotal, grossTotal } = invoiceData;
        let data = {
            "firstName": firstName,
            "lastName": lastName,
            "company": company,
            "addressLine1": addressLine1,
            "addressLine2": addressLine2,
            "city": city,
            "region": region,
            "postCode": postCode,
            "country": country,
            "business": business,
            "address1": address1,
            "address2": address2,
            "address3": address3,
            "address4": address4,
            "contact": contact,
            "taxRef": taxRef,
            "invoiceDate": invoiceDate,
            "netTotal": netTotal,
            "taxTotal": taxTotal,
            "grossTotal": grossTotal,
            "invoice": invoice,
            "invoiceId": this.state.invoiceId
        }
        return (
            <div>
                <Button color="success" style={{ borderColor: 'green', color: "green", }}><Link to="/billing/paymentHistory" style={{color: "black"}} >payment History</Link></Button>
                {/* <Link to="/billing/paymentHistory"  >payment History</Link> */}
                <span className="float-right" >
                    <Button color="primary" onClick={this.callDownload} >Download</Button> &nbsp;
                    <Button color="danger" >ConvertPDF</Button> &nbsp;
                        <ReactToPrint trigger={() => <Button color="success" href="#"> print</Button>} content={() => this.componentRef} /></span> &nbsp;
                    <br />
                <div id="download">
                <InvoiceConvertPdfFile ref={el => (this.componentRef = el)} data={data} customDateFormat={this.customDateFormat} /></div>
            </div>
        )
    }

    customDateFormat = (invoiceDate) => {
        if (invoiceDate) {
            let date = invoiceDate.split('T')[0].toString();
            var monthNames = [
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"
            ];
            var inDate = new Date(date);
            const day = inDate.getDate();
            const month = inDate.getMonth();
            const year = inDate.getFullYear();
            return `${day} ${monthNames[month]} ${year}`;
        }
    }
}
export default Invoice;




