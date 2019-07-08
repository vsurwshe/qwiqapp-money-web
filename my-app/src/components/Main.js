import React, { Component, Suspense } from "react";
import { Route, Redirect, Switch, withRouter  } from "react-router-dom";
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
import CreateLable from "../secure/labels/Createlabel";
import Lables from "../secure/labels/Labels";
import Categories from "../secure/categories/Categories";
import Contacts from "../secure/contacts/Contacts";
import CreateContact from "../secure/contacts/CreateContact";
import EditCategory from "../secure/categories/EditCategory";
import UserApi from "../services/UserApi";
import ProfileApi from "../services/ProfileApi";
import CreateProfile from "../secure/profiles/CreateProfile";
import Bills from "../secure/bills/Bills"
import DefaultHeader from "../secure/sidebar/DefaultHeader"
import BillingInfo from "../secure/billingAddress/BillingInfo";
import EditBillingAddress from "../secure/billingAddress/EditBillingAddress";
import DefaultHeader from "../secure/sidebar/DefaultHeader";
import SetProfile from "../secure/profiles/SetProfile"

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
    if(Store.isAppUserLoggedIn()){
      new ProfileApi().getProfiles(this.successCallProfiles, this.errorCall);
    }
  }

  successCallProfiles = async (profiles) => {
    let profile;
    if (profiles.length === 0 || profiles === null) {
      console.log("There is No Profile");
    } else {
      await Store.saveUserProfiles(profiles);
      if(Store.getSelectedValue()=== 'false'){
        await Store.saveProfile(profiles[0])
      }
      profile = await profiles.map(profile=>{return {name:profile.name,url: "/profiles/"+profile.id, icon: "cui-user"}})
      await this.setState({profileNames : profile})
      this.forceUpdate();
    }
    this.getUser();
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

  render() {
    if (Store.isAppUserLoggedIn()) {
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
        <PrivateRoute exact path="/profiles" component={Profiles} />
        <PrivateRoute exact path ="/createProfile" component={CreateProfile} />
        <PrivateRoute exact path="/profiles/:id" component={SetProfile} />
        <PrivateRoute path="/listBills" component={Bills} />
        <PrivateRoute exact path="/createProfile" component={CreateProfile} />
        <PrivateRoute exact path="/billing/address" component={BillingInfo} />
        <PrivateRoute exact path="/billing/address/add" component={EditBillingAddress} />
        <PrivateRoute path="/label/labels" component={Lables} />
        <PrivateRoute path="/label/createLabel" component={CreateLable} />
        <PrivateRoute path="/listCategories" component={Categories} />
        <PrivateRoute path="/categories/update" component={EditCategory} />
        <PrivateRoute exact path="/contact/createContact" component={CreateContact} />
        <PrivateRoute exact path="/contact/viewContacts" component={Contacts} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
      </Switch>
    );
  }

  //This Method Call When user Log in Successfully.
  loadSecureRoutes = () => {
    const { user } = this.state
    return (
      <div className="app ">
        {this.loadHeader()}
        <div className="app-body">
          {this.loadSideBar()}
          <main className="main" style={{ backgroundColor: "#FFFFFF" }}>
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
    const { profileNames } = this.state
    const newItem =profileNames.concat(item.items)
    const profileItem={items:newItem}
    return(
      <AppSidebar fixed display="sm">
        <Suspense>
           { Store.getProfile() !== null && !this.state.flag  ?  <AppSidebarNav navConfig={navigation} {...this.props} /> : <AppSidebarNav navConfig={profileItem}  {...this.props} />  }
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