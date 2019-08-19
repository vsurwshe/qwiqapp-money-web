import React, { Component } from 'react';
import { Table, CardBody, CardTitle, Container, Card, Row, Col } from "reactstrap";
import { UserInvoiceApi } from '../../services/UserInvoiceApi';
import Store from '../../data/Store';
import '../../css/style.css';
import GeneralApi from '../../services/GeneralApi';

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceId: props.location.state.invoiceId,
            invoiceData: '',
            user: Store.getUser(),
            businessAddress: '',
            userBillingAddress:Store.getBillingAddress(),
        }
    }

    componentDidMount = () => {
        new UserInvoiceApi().showInvoice(this.successCall, this.errorCall, this.state.invoiceId);
        new GeneralApi().settings((businessAddress) => { this.setState({ businessAddress }) },
            (error) => { console.log('businessAddress is getting error: ', error) })
    }
    successCall = (responce) => {
        responce.then((resp) => {
            this.setState({ invoiceData: resp.data });
        })
    }
    errorCall = (error) => {
        error.catch((err) => {
            console.log(err)
        });
    }
    render() {
        const { invoiceData, businessAddress,userBillingAddress } = this.state;
         
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
        return this.invoiceTable(rowData,invoiceData, userBillingAddress,businessAddress);
    }
    invoiceTable=(invoice, invoiceData,userBillingAddress,businessAddress)=>{
        return (
            <Container className="container-border">
                <Card>
                    <CardBody>
                        <Row >
                            <Col sm={9}>
                                <CardTitle className="heading">INVOICE</CardTitle>
                                <span >Invoice id: #{this.state.invoiceId} </span>
                                  <p >Date:  {invoiceData.invoiceDate && this.customeDateFormate(invoiceData.invoiceDate)}</p> 
                                <br />
                                <Row>
                                    <Col sm={3}>
                                    <hr/>
                                    </Col>
                                </Row>
                                <p>
                               {userBillingAddress.firstName && <><b>Name: </b>{userBillingAddress.firstName}</>} 
                                            {userBillingAddress.lastName && <>&nbsp;{userBillingAddress.lastName} <br/></>}
                                            {userBillingAddress.company && <><b>Organization: </b> {userBillingAddress.company}<br/></>}
                                 <b>Address:</b> {userBillingAddress.addressLine1}<br/>
                                                <span >{userBillingAddress.addressLine2}, &nbsp;
                                                 {userBillingAddress.city}<br/>
                                                 {userBillingAddress.region}-
                                                 {userBillingAddress.postCode}<br/>
                                                 {userBillingAddress.country}<br/>
                                                 </span>
                                </p>
                               </Col>
                            <Col sm={3}>
                                <b>Business Address</b><br />
                                <span>
                                    {businessAddress.business}<br />
                                    {businessAddress.address1}<br />
                                    {businessAddress.address2}<br />
                                    {businessAddress.address4}<br />
                                    {businessAddress.address3}<br /><br/>
                                    {businessAddress.contact && <>
                                        {(businessAddress.contact).split(',')[0]} <br />
                                        {(businessAddress.contact).split(',')[1]}<br />
                                    </>}
                                    {businessAddress.taxRef}
                                </span>
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
                            <td><h6>£ {invoiceData.netTotal}</h6></td>
                        </tr>
                        <tr>
                            <td> <h6>Tax :</h6> </td>
                            <td><h6>£ {invoiceData.taxTotal}</h6></td>
                        </tr>
                        <tr>
                            <td><h4>Gross Total : </h4></td>
                            <td><h4>£ {invoiceData.netTotal}</h4></td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }
    customeDateFormate=(invoiceDate)=>{
       if (invoiceDate) {
        let date=invoiceDate.split('T')[0].toString();
        var monthNames = [
         "Jan", "Feb", "Mar",
         "Apr", "May", "Jun", "Jul",
         "Aug", "Sep", "Oct",
         "Nov", "Dec"
       ];
         var inDate=new Date(date);
       const day = inDate.getDate();
       const month = inDate.getMonth();
       const year = inDate.getFullYear();

       return `${day} ${monthNames[month]} ${year}`;
       }
    }
}

export default Invoice;