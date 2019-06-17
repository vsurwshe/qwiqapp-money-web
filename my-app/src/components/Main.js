import React, { Component, Suspense } from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { Container } from "reactstrap";
import { AppFooter,  AppHeader,  AppSidebar, AppSidebarNav} from "@coreui/react";
import Dashboard from "../secure/Dashboard";
import Signup from "./Signup";
import Home from "./Home";
import Login from "./Login";
import Store from "../data/Store";
import SignupVerify from "../components/SignupVerify";
import Profiles from "../secure/profiles/Profiles";
import navigation, {item} from "../data/navigations";
import CreateLable from "../secure/labels/Createlabel";
import Lables from "../secure/labels/Labels";
import Categories from "../secure/categories/Categories";
import Contacts from "../secure/contacts/Contacts";
import CreateContact from "../secure/contacts/CreateContact";
import EditCategory from "../secure/categories/EditCategory";
import Bills from "../secure/bills/Bills";

const DefaultFooter = React.lazy(() =>import("../secure/sidebar/DefaultFooter"));
const DefaultHeader = React.lazy(() =>  import("../secure/sidebar/DefaultHeader"));

class Main extends Component {
  constructor(props){
    super(props);
    this.state={
      flag:false,
    }
  }

  loading = () => (<div className="animated fadeIn pt-1 text-center">Loading...</div>);

  signOut(e) {e.preventDefault();this.props.history.push("/login");}

  changeFlagOnClick = () =>{
    this.setState({flag : !this.state.flag})
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
        <PrivateRoute path="/profiles" component={Profiles} />
        <PrivateRoute path="/label/labels" component={Lables} />
        <PrivateRoute path="/label/createLabel" component={CreateLable} />
        <PrivateRoute path="/listCategories" component={Categories} />
        <Route path="/categorie/update" component={EditCategory} />
        <PrivateRoute exact path="/contact/createContact" component={CreateContact} />
        <PrivateRoute exact path="/contact/viewContacts" component={Contacts} />
        <PrivateRoute path="/listBills" component={Bills} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/register/:id/verify" component={SignupVerify} />
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />        
      </Switch>
    );
  }

  //This Method Call When user Log in Successfully.
  loadSecureRoutes() {
    return (
      <div className="app ">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} onFlagChange = {this.changeFlagOnClick}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="sm">
            <Suspense>
              { !this.state.flag ?  <AppSidebarNav navConfig={navigation} {...this.props} />
                                 :  <AppSidebarNav navConfig={item} {...this.props} />
              }
            </Suspense>
          </AppSidebar>
          <main className="main" style={{backgroundColor:"#FFFFFF"}}>
            <br/>
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
