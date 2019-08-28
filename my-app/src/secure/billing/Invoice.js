import React, { Component } from 'react';
import { Table, CardBody, CardTitle, Container, Card, Row, Col } from "reactstrap";
import { UserInvoiceApi } from '../../services/UserInvoiceApi';
import Store from '../../data/Store';
import '../../css/style.css';
import GeneralApi from '../../services/GeneralApi';
import BillingAddressApi from '../../services/BillingAddressApi';

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
        error.catch((err) => {
            console.log(err)
        });
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

    invoiceTable = (invoice, invoiceData, userBillingAddress, businessAddress) => {
        const { firstName, lastName, company, addressLine1, addressLine2, city, region, postCode, country } = userBillingAddress;
        const { business, address1, address2, address4, address3, contact, taxRef } = businessAddress;
        const { invoiceDate, netTotal, taxTotal, grossTotal } = invoiceData;
        return (
            <Container className="container-border">
                <Card>
                    <CardBody>
                        <Row >
                            <Col sm={9}>
                                <CardTitle className="heading">INVOICE</CardTitle>
                                <span >Invoice Number:&nbsp;&nbsp;{this.state.invoiceId} </span>
                                <p >Date:  {invoiceDate && this.customDateFormat(invoiceDate)}</p>
                                <br />
                                <Row>
                                    <Col sm={3}>
                                        <hr />
                                    </Col>
                                </Row>
                                    <b>To:</b>  {firstName && <>{firstName}</>}{lastName && <>{lastName} <br /></>}   
                                    <div style={{paddingLeft:25}}>
                                            {company && <>{company}<br /></>}
                                            {addressLine1 && <>{addressLine1}<br /></>}
                                            {addressLine2}
                                            {city}<br />
                                            {region}
                                            {postCode}<br />
                                            {country}<br />
                                    </div>
                            </Col>
                            <Col sm={3}>
                                <div className="float-right">
                                    {business}<br />
                                    {address1}<br />
                                    {address2}<br />
                                    {address4}<br />
                                    {address3}<br /><br />
                                    {contact && <>
                                        {(contact).split(',')[0]} <br />
                                        {(contact).split(',')[1]}<br />
                                    </>}
                                    {taxRef}
                                </div>
                            </Col>
                        </Row>
                        <br />
                    </CardBody>
                </Card>
                <Table bordered >
                    <thead>
                        <tr className="table-header-color" >
                            <th>Quantity</th>
                            <th>Description</th>
                            <th>Price (£)</th>
                            <th>Tax</th>
                            <th>Net Total (£)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice}
                    </tbody>
                </Table>
                <Table>
                    <tbody className="tbody-net">
                        <tr>
                            <td> <h6>Net Total :</h6> </td>
                            <td><h6>£ {netTotal}</h6></td>
                        </tr>
                        <tr>
                            <td> <h6>Tax :</h6> </td>
                            <td><h6>£ {taxTotal}</h6></td>
                        </tr>
                        <tr>
                            <td><h4>Gross Total : </h4></td>
                            <td><h4>£ {grossTotal}</h4></td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
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