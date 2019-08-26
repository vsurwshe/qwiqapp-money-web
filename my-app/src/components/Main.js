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
import navigation, { item } from "../data/navigations";
import Lables from "../secure/labels/Labels";
import Categories from "../secure/categories/Categories";
import Contacts from "../secure/contacts/Contacts";
import CreateContact from "../secure/contacts/CreateContact";
import UserApi from "../services/UserApi";
import ProfileApi from "../services/ProfileApi";
import CreateProfile from "../secure/profiles/CreateProfile";
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
import Invoice from "../secure/billing/Invoice";
import Config from "../data/Config";

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
    let profileSet;
    if (profiles.length === 0 || profiles === null) {
      console.log("There is No Profile");
    } else {
      await Store.saveUserProfiles(profiles);
      if (Store.getSelectedValue() === 'false') {
        await Store.saveProfile(profiles[0])
      }
      if (Array.isArray(profiles)) {
        profileSet = await profiles.map(profile => { return { name: profile.name, url: "/profiles/" + profile.id, icon: "cui-user" } })
      }
      await this.setState({ profileNames: profileSet })
      this.forceUpdate();
    }
    this.getUser();
    new GeneralApi().settings((data) => { Store.saveSetting(data) }, (error) => { console.log(error); });
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

  changeFlagOnClick = () => {
    this.setState({ flag: !this.state.flag })
  }

  changeFlagValue=()=>{
      this.setState({ flag: this.props.location.state.changeFlag})
      this.props.location.state= null
  }

  render() {
    if (Store.isAppUserLoggedIn()) {
      // this condtions checks, manually profile selected or not
      if(this.props.location.state !== undefined && this.props.location.state !== null){
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
        <PrivateRoute exact path="/createProfile" component={CreateProfile} />
        <PrivateRoute exact path="/profiles" component={Profiles} />
        <PrivateRoute exact path="/profiles/:id" component={SetProfile} />
        <PrivateRoute path="/listBills" component={Bills} />
        <PrivateRoute path="/label/labels" component={Lables} />
        <PrivateRoute path="/listCategories" component={Categories} />
        <PrivateRoute exact path="/contact/createContact" component={CreateContact} />
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
      <div className="app "  style={{ backgroundColor:Config.settings().bgcolor}}>
        {this.loadHeader()}
        <div className="app-body">
          {this.loadSideBar()}
          <main className="main" >
            { Config.isLive()  ? '' : <p> Non live Environment is: {Config.environment()}</p>}
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
    const sideNavbarProfileItems = { items: this.state.profileNames.concat(item.items) }
    return (
      <AppSidebar fixed display="sm">
        <Suspense>
          {Store.getProfile() !== null && !this.state.flag ? <AppSidebarNav navConfig={navigation} {...this.props} />
            : <AppSidebarNav navConfig={sideNavbarProfileItems}  {...this.props} />}
        </Suspense>
      </AppSidebar>);
  }

  //This method displays the Static Notification according to User's Action
  loadNotification = (user) => {
    if (user.action === 'VERIFY_EMAIL') {
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