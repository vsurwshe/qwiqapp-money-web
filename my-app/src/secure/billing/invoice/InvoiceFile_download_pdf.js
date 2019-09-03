import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, CardBody, CardTitle, Container, Card, Row, Col } from "reactstrap";
import '../../../css/style.css';

class InvoiceConvertPdfFile extends Component {

    render() {
        const { invoice, invoiceId, firstName, lastName, company, addressLine1, addressLine2, city, region, postCode, country, business,
            address1, address2, address4, address3, contact, taxRef, invoiceDate, netTotal, taxTotal, grossTotal } = this.props.data;
        
             /*
             * convert invoice dom object into svg
             * setPage A4
             *  jspdf parametrised constructer convert dom object into png formate
             * finally image formate convert into .pdf file
             */
            if (this.props.download) {
            var data = document.getElementById('download');
            html2canvas(data).then(canvas => {
                var imgWidth = 200;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                const contentDataURL = canvas.toDataURL('image/png');
                let pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.setFontSize(12);
                pdf.save(`billing invoice ${invoiceId}.pdf`);
            });
        }

        return <Container className="container-border" id="download"> <br />
            <Card  >
                <CardBody>
                    <Row >
                        <Col sm={9}>
                            <CardTitle className="heading">INVOICE</CardTitle>
                            <span >Invoice number:&nbsp;&nbsp;{invoiceId} </span>
                            <p >Date:  {invoiceDate && this.props.customDateFormat(invoiceDate)}</p>
                            <br />
                            <Row>
                                <Col sm={3}>
                                    <hr />
                                </Col>
                            </Row>
                            <b>To:</b>  {firstName && <>{firstName}</>}{lastName && <>{lastName} <br /></>}
                            <div style={{ paddingLeft: 25 }}>
                                {company && <>{company}<br /></>}
                                {addressLine1 && <>{addressLine1}<br /></>}
                                {addressLine2}
                                {city}<br />
                                {region}
                                {postCode && " - " + postCode}<br />
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

    }
}

export default InvoiceConvertPdfFile;