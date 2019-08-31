import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, CardBody, CardTitle, Container, Card, Row, Col, Button } from "reactstrap";
import { UserInvoiceApi } from '../../services/UserInvoiceApi';
import Store from '../../data/Store';
import '../../css/style.css';
import GeneralApi from '../../services/GeneralApi';
import BillingAddressApi from '../../services/BillingAddressApi';

class InvoiceConvertPdfFile extends Component {
    render(){
    
    const {invoice, invoiceId, firstName, lastName, company, addressLine1, addressLine2, city, 
        region, postCode, country, business, address1, address2, address4, address3, 
        contact, taxRef, invoiceDate, netTotal, taxTotal, grossTotal } = this.props.data
        return (
            <Container className="container-border">
               
                <br />
                <Card>
                    <CardBody>
                        <Row >
                            <Col sm={9}>
                                <CardTitle className="heading">INVOICE</CardTitle>
                                <span >Invoice number:&nbsp;&nbsp;{this.state.invoiceId} </span>
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
                                            {postCode && " - "+postCode}<br />
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
                <center style={{paddingLeft: 20}}>
                    <Button color="success" style={{ borderColor: 'green', color: "green", }}><Link to="/billing/paymentHistory" style={{color: "black"}} >Go back</Link></Button>
                </center>
            </Container>
           
        );
                                    }
}
 
export default InvoiceConvertPdfFile;