import React, { Component } from 'react';
import { Table, Card, CardBody, CardTitle } from "reactstrap";
import { UserInvoiceApi } from '../../services/UserInvoiceApi';
import Store from '../../data/Store';
import '../../css/style.css'

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            invoiceId: props.location.state.invoiceId,
            invoiceData: '',
            user: Store.getUser()
         }
    }
    
    componentDidMount = () => {
        new UserInvoiceApi().showInvoice(this.successCall, this.errorCall, this.state.invoiceId);
    }
    successCall = (responce) => {
        responce.then((resp)=>{
           this.setState({ invoiceData: resp.data });
        })
    }
    errorCall = (error) => {
        error.catch((err)=>{
            console.log(err)
        });
    }
    render() { 
        const {invoiceData} = this.state;
        return this.loadInvoice(invoiceData)
    }
    loadInvoice = (invoiceData) => {
        let rowData;
        if (invoiceData.invoiceItems) {
            rowData = invoiceData.invoiceItems.map((invoice, index)=>{
                return (<tr key={index} className="row-text-align">
                    <td>{invoice.quantity}</td>
                    <td>{invoice.description} </td>
                    <td>{invoice.price}</td>
                    <td>{invoice.taxPercent}</td>
                    <td>{invoice.grossTotal}</td>
                    </tr>)
                })
        }
        return (<Card>
            <CardBody>
                <u><CardTitle className="heading">GEEK SAPCE PVT.LTD</CardTitle></u>
                <b >Invoice #{this.state.invoiceId} </b>
                <br/><br/>
                <p> 
                    <b>Geek Space Business Centre</b><br/>
                    12th floor, Manjeera Trinity Corporate,<br/>
                    E-Seva Line,JNTU - Hitech City Road,<br/> 
                    Hyderabad, Telangana : 500072
                </p>
                <p className="p-style"> 
                    <span className="span-left">
                        <b>Invoice To<br/>
                        Mr / Ms. {this.state.user.name}</b><br/>
                        Email : {this.state.user.email}<br/>
                    </span>
                    <span className="span-right">
                        <b>Invoice Date: </b>{invoiceData.invoiceDate && invoiceData.invoiceDate.split('T')[0]}
                    </span>
                </p>
                <br/>
                <Table >
                    <thead>
                        <tr className="table-header-color" >
                            <th>QUANTITY</th>
                            <th>DESCRIPTION</th>
                            <th>PRICE</th>
                            <th>TAX</th>
                            <th>GrossTotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowData}
                    </tbody>
                </Table>
                <Table>
                   <tbody className="tbody-net">
                        <tr>
                            <td> <h6>Total Tax :</h6> </td>
                            <td><h6>{invoiceData.totalTax}</h6></td>
                        </tr>
                        <tr>
                            <td><h4>Net Total :</h4></td>
                            <td><h4>{invoiceData.netTotal}</h4></td>
                        </tr>
                    </tbody>
                </Table>
            </CardBody>
        </Card> );
    }
}
 
export default Invoice;