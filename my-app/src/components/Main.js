import React, { Component, Suspense } from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { Container } from "reactstrap";
import { AppFooter, AppHeader, AppSidebar, AppSidebarNav } from "@coreui/react";
import Dashboard from "../secure/Dashboard";
import Signup from "./Signup";
import Home from "./Home";
import Login from "./Login";
import Store from "../data/Store";
import SignupVerify from "../components/SignupVerify";
import Profiles from "../secure/profiles/Profiles";
import navigation from "../data/navigations";
import Lables from "../secure/labels/Labels";
import Categories from "../secure/categories/Categories";
import Contacts from "../secure/contacts/Contacts";
import UserApi from "../services/UserApi";
import ProfileApi from "../services/ProfileApi";
import ProfileForm from "../secure/profiles/ProfileForm";
import Bills from "../secure/bills/Bills";
import SetProfile from "../secure/profiles/SetProfile";
import DefaultHeader from "../secure/sidebar/DefaultHeader"
import BillingInfo from "../secure/billing/address/BillingInfo";
import EditBillingAddress from "../secure/billing/address/EditBillingAddress";
import PaymentHistory from '../secure/billing/payment/PaymentHistory';
import MakePayment from '../secure/billing/payment/MakePayment';
import GeneralApi from "../services/GeneralApi";
import EditUser from "../secure/editUser/EditUser";
import ChangePassword from "../secure/editUser/ChangePassword";
import ForgotPassword from '../components/ForgotPassword';
import Invoice from "../secure/billing/invoice/Invoice";
import Config from "../data/Config";
import AddBillAttachment from "../secure/bills/billAttachments/AddBillAttachment";
import BillAttachments from "../secure/bills/billAttachments/BillAttachments";
import { user_actions } from "../data/GlobalKeys";

const DefaultFooter = React.lazy(() => import("../secure/sidebar/DefaultFooter"));

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      profileNames: [],
      user: []
    }
  }

  componentDidMount = () => {
    if (Store.isAppUserLoggedIn()) {
      new ProfileApi().getProfiles(this.successCallProfiles, this.errorCall);
    }
  }
  successCallProfiles = async (profiles) => {
    if (profiles.length === 0 || profiles === null) {
      console.log("There is No Profile");
    } else {
      await Store.saveUserProfiles(profiles);
      if (Store.getSelectedValue() === 'false') {
        new ProfileApi().getProfileById((response)=>{Store.saveProfile(response)}, (error)=>console.log(error), profiles[0].id);
      }
      this.forceUpdate();
    }
    this.getUser();
    new GeneralApi().settings(this.getPaypalSettings, this.errorCall);
    new GeneralApi().getCurrencyList(this.getCurrenciesList, this.errorCall);
    new GeneralApi().getCountrylist(this.getCountriesList, this.errorCall);
  }

  getPaypalSettings = (data) => {
    Store.saveSetting(data)
  }

  getCurrenciesList = (currencies) => {
    Store.saveCurrencies(currencies)
  }

  getCountriesList = (countries) => {
    Store.saveCountries(countries)
  }

  getUser = () => {
    new UserApi().getUser(this.successCallUser, this.errorCall)
  }

  successCallUser = (userData) => {
    this.setState({ user: userData })
  }

  errorCall = (error) => {
    console.log("Error = ", error);
  }

  loading = () => (<div className="animated fadeIn pt-1 text-center">Loading...</div>);

  signOut(e) { e.preventDefault(); this.props.history.push("/login"); }

  // this function is called when user selects profile in default header dropdown
  changeFlagOnClick = () => {
    this.setState({ flag: !this.state.flag })
  }

  // this function is called when user manually selects profile in Manage Profiles table
  changeFlagValue = () => {
    const { changeFlag } = this.props.location.state
    this.setState({ flag: changeFlag })
    this.props.location.state = null
  }

  render() {
    if (Store.isAppUserLoggedIn()) {
      // this condtions checks, manually profile selected or not
      if (this.props.location.state) {
        this.changeFlagValue();
      }
      return this.loadSecureRoutes();
    } else {
      return this.loadRoutes();
    }
  }

  //This Method Routes Components
  loadRoutes() {
    return (
      <Switch>
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/verify" component={SignupVerify} />
        <PrivateRoute exact path="/editUser" component={EditUser} />
        <PrivateRoute exact path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/billing/address/add" component={EditBillingAddress} />
        <PrivateRoute exact path="/billing/address" component={BillingInfo} />
        <PrivateRoute exact path="/billing/addCredits" component={MakePayment} />
        <PrivateRoute exact path="/billing/paymentHistory" component={PaymentHistory} />
        <PrivateRoute exact path="/payment/invoice/:id" component={Invoice} />
        <PrivateRoute exact path="/createProfile" component={ProfileForm} />
        <PrivateRoute exact path="/profiles" component={Profiles} />
        <PrivateRoute exact path="/profiles/:id" component={SetProfile} />
        <PrivateRoute exact path="/listBills" component={Bills} />
        <PrivateRoute exact path="/listBills/:value" component={Bills} />
        <PrivateRoute exact path="/bills/attachments" component={BillAttachments} />
        <PrivateRoute exact path="/bills/attachments/add" component={AddBillAttachment} />
        <PrivateRoute path="/label/labels" component={Lables} />
        <PrivateRoute path="/listCategories" component={Categories} />
        <PrivateRoute exact path="/contact/viewContacts" component={Contacts} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/passwd/forgot" component={ForgotPassword} />
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
      </Switch>
    );
  }

  //This Method Call When user Log in Successfully.
  loadSecureRoutes = () => {
    const { user } = this.state
    return (
      <div className="app " style={{ backgroundColor: Config.settings().bgcolor }}>
        {this.loadHeader()}
        <div className="app-body">
          {this.loadSideBar()}
          <main className="main" >
            {Config.isLive() ? '' : <p> Non live Environment is: {Config.environment()}</p>}
            {this.loadNotification(user)}
            <Container fluid>
              <Suspense fallback={this.loading()}>{this.loadRoutes()}</Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }

  //This method calls the DefaultHeader Component
  loadHeader = () => {
    return (
      <AppHeader fixed>
        <Suspense fallback={this.loading()}>
          <DefaultHeader onLogout={e => this.signOut(e)} onFlagChange={this.changeFlagOnClick} />
        </Suspense>
      </AppHeader>)
  }

  //This method calls the inbuilt SideBar Component acc to condition
  loadSideBar = () => {
    //added currently profiels into sidebar items json array 
    return (
      <>
        {Store.getProfile() !== null &&
          <AppSidebar fixed display="sm">
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...this.props} />
            </Suspense>
          </AppSidebar>}</>);
  }

  //This method displays the Static Notification according to User's Action
  loadNotification = (user) => {
    if (user.action === user_actions.VERIFY_EMAIL) {
      return <center style={{ padding: 15 }}><span style={{ backgroundColor: '#f66749', color: 'white', borderRadius: '0.4em', padding: 7 }} >You are not verified yet... Please <u><a href='/verify' style={{ color: 'white' }}>Verify Now</a></u></span></center>;
    } else {
      return <center style={{ padding: 10 }} />;
    }
  }
}
export default withRouter(Main);

//This provides the Security to app Routing
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Store.isAppUserLoggedIn() ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/", // -> /login
              state: { from: props.location }
            }}
          />
        )
    }
  />
);