import React, { Component } from "react";
import { Card, CardBody, Row, Col, Nav, NavItem, NavLink, TabPane, TabContent } from "reactstrap";
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
    if (this.props.for === "form") {
      this.toggle(0, "1");
    } else if (this.props.for === "payments") {
      this.toggle(0, "2");
    } else {
      this.toggle(0, "3");
    }
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({ activeTab: newArray });
  }

  tabPane() {
    const { categories, bill, contacts, getContacts, getLabels, labels, profileId } = this.props.tabData
    const { paidAmount, cancelButton } = this.props

    return (
      <>
        <TabPane tabId="1">
          {bill ? <BillForm cancelButton={cancelButton} bill={bill} profileId={profileId} labels={labels} categories={categories} contacts={contacts} getContacts={getContacts} getLabels={getLabels} />
            : <BillForm cancelButton={cancelButton} profileId={profileId} labels={labels} categories={categories} contacts={contacts} getContacts={getContacts} getLabels={getLabels} />}
        </TabPane>
        <TabPane tabId="2">
          <ViewPayment bill={bill} paidAmount={paidAmount} profileId={profileId} cancel={cancelButton} />
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
          <CardBody>
            <Row>
              <Col className="mb-4">
                <Nav tabs>
                  <NavItem>
                    <NavLink active={this.state.activeTab[0] === "1"} onClick={() => { this.toggle(0, "1") }} > Bills Form </NavLink>
                  </NavItem>
                  {bill && <NavItem>
                    <NavLink active={this.state.activeTab[0] === "2"} onClick={() => { this.toggle(0, "2"); }} > Payment History </NavLink>
                  </NavItem>}
                  {bill && featureAttachment && <NavItem>
                    <NavLink active={this.state.activeTab[0] === "3"} onClick={() => { this.toggle(0, "3"); }} > Attachments </NavLink>
                  </NavItem>}
                </Nav>
                <TabContent activeTab={this.state.activeTab[0]}>
                  {this.tabPane()}
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default BillTabs;
