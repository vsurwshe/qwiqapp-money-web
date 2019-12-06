import React, { Component } from "react";
import { Card, CardHeader, CardBody, Row, Col, Button, Nav, NavItem, NavLink, TabPane, TabContent } from "reactstrap";
import BillForm from "./BillForm";
import ViewPayment from "./billPayment/ViewPayment";
import BillAttachments from "./billAttachments/BillAttachments";
import Store from "../../data/Store";
import { profileFeature } from "../../data/GlobalKeys";

class BillTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab,
      profile: Store.getProfile()
    };
  }

  handlePaymentsCount = (paymentsCount) => {this.setState({paymentsCount});}
  handleAttachmentsCount = (attachmentCount) => {this.setState({attachmentCount});}
  toggleTabs(activeTab) { this.setState({ activeTab }); }

  tabPane() {
    const { categories, bill, contacts, getContacts, getLabels, labels, profileId } = this.props.tabData;
    const { paidAmount, cancelButton,payform } = this.props;

    return (
      <>
        <TabPane tabId={1}>
          {bill ? <BillForm cancelButton={cancelButton} bill={bill} profileId={profileId} labels={labels} categories={categories} contacts={contacts} getContacts={getContacts} getLabels={getLabels} />
            : <BillForm cancelButton={cancelButton} profileId={profileId} labels={labels} categories={categories} contacts={contacts} getContacts={getContacts} getLabels={getLabels} />}
        </TabPane>
        <TabPane tabId={2}>
          <ViewPayment payform={payform} bill={bill} paidAmount={paidAmount} profileId={profileId} cancel={cancelButton} paymentCount={this.handlePaymentsCount} />
        </TabPane>
        {<TabPane tabId={3}><BillAttachments profileId={profileId} bill={bill} cancelButton={cancelButton} attachmentCount={this.handleAttachmentsCount}/></TabPane>}
      </>
    );
  }
  render() {
    const { profile } = this.state;
    const { bill } = this.props.tabData;
    let featureAttachment = profile && profile.features.length ? profile.features.includes(profileFeature.ATTACHMENTS) : false
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <Button className="float-right" color="info" onClick={()=>this.props.cancelButton(true)} >Back to bills</Button> </CardHeader>
          <CardBody>
            <Row>
              {this.loadTabs(bill, featureAttachment)}
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }

  loadTabs = (bill, featureAttachment) => {
    const {activeTab, paymentsCount, attachmentCount } = this.state;
    return <Col className="mb-4">
      <Nav tabs>
        <NavItem> <NavLink active={activeTab === 1} onClick={() => { this.toggleTabs(1) }}> Bill Details </NavLink> </NavItem>
        {bill && <NavItem>
          <NavLink active={activeTab === 2} onClick={() => { this.toggleTabs(2); }} > Payments { paymentsCount>0 && `( ${paymentsCount} )` }  </NavLink>
        </NavItem>}
        {bill && featureAttachment && <NavItem>
          <NavLink active={activeTab === 3} onClick={() => { this.toggleTabs(3); }} > Attachments {attachmentCount>0 && `( ${attachmentCount } )`} </NavLink>
        </NavItem>}
      </Nav>
      <TabContent activeTab={activeTab}> {this.tabPane()} </TabContent>
    </Col>
  }
}

export default BillTabs;
