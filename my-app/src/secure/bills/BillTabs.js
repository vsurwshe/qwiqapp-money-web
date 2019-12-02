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
      activeTab: new Array(4).fill("1"),
      profile: Store.getProfile()
    };
  }

  componentDidMount() {
    const {form} =this.props
    if (form === "form") {
      this.toggle(0, "1");
    } else if (form === "payments") {
      this.toggle(0, "2");
    } else {
      this.toggle(0, "3");
    }
  }
  
  // This is tabs method toggle 
  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({ activeTab: newArray });
  }

  tabPane() {
    const { categories, bill, contacts, getContacts, getLabels, labels, profileId } = this.props.tabData
    const { paidAmount, cancelButton,payform } = this.props

    return (
      <>
        <TabPane tabId="1">
          {bill ? <BillForm cancelButton={cancelButton} bill={bill} profileId={profileId} labels={labels} categories={categories} contacts={contacts} getContacts={getContacts} getLabels={getLabels} />
            : <BillForm cancelButton={cancelButton} profileId={profileId} labels={labels} categories={categories} contacts={contacts} getContacts={getContacts} getLabels={getLabels} />}
        </TabPane>
        <TabPane tabId="2">
          <ViewPayment payform={payform} bill={bill} paidAmount={paidAmount} profileId={profileId} cancel={cancelButton} />
        </TabPane>
        {<TabPane tabId="3"><BillAttachments profileId={profileId} bill={bill} cancelButton={cancelButton} /></TabPane>}
      </>
    );
  }
  render() {
    const { profile } = this.state;
    const { bill } = this.props.tabData;
    let featureAttachment = profile && profile.features.length > 0 ? profile.features.includes(profileFeature.ATTACHMENTS) : false
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
                  <Button className="float-right" color="info" onClick={()=>this.props.cancelButton()} >Goto bills</Button> </CardHeader>
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
    const {activeTab} = this.state
    return <Col className="mb-4">
      <Nav tabs>
        <NavItem> <NavLink active={activeTab[0] === "1"} onClick={() => { this.toggle(0, "1") }} > Bills Form </NavLink> </NavItem>
        {bill && <NavItem>
          <NavLink active={activeTab[0] === "2"} onClick={() => { this.toggle(0, "2"); }} > Payment History </NavLink>
        </NavItem>}
        {bill && featureAttachment && <NavItem>
          <NavLink active={activeTab[0] === "3"} onClick={() => { this.toggle(0, "3"); }} > Attachments </NavLink>
        </NavItem>}
      </Nav>
      <TabContent activeTab={this.state.activeTab[0]}>
        {this.tabPane()}
      </TabContent>
    </Col>
  }
}

export default BillTabs;
