import React, { Component, Suspense } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import { AppFooter,  AppHeader,  AppSidebar,  AppSidebarFooter,  AppSidebarForm,  AppSidebarHeader,  AppSidebarNav} from "@coreui/react";
import Dashboard from "../secure/Dashboard";
import Signup from "./Signup";
import Home from "./Home";
import Login from "./Login";
import Store from "../data/Store";
import SignupVerify from "../components/SignupVerify";
import Profiles from "../secure/profiles/Profiles";
import navigation from "../data/navigations";
import CreateLable from "../secure/labels/Createlabel";
import Lables from "../secure/labels/Label";
// import UpdateProfile from "../secure/UpdateProfile";
import Categories from "../secure/Categories/Categories";

const DefaultFooter = React.lazy(() =>import("../secure/Sidebar/DefaultFooter"));
const DefaultHeader = React.lazy(() =>  import("../secure/Sidebar/DefaultHeader"));
class Main extends Component {
  loading = () => (<div className="animated fadeIn pt-1 text-center">Loading...</div>);

  signOut(e) {e.preventDefault();this.props.history.push("/login");}

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
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/register/:id/verify" component={SignupVerify} />
        <PrivateRoute path="/profiles" component={Profiles} />
        <PrivateRoute path="/label/labels" component={Lables} />
        <PrivateRoute path="/label/createLabel" component={CreateLable} />
        <PrivateRoute path="/listCategories" component={Categories} />
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
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="sm">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            {/* <AppSidebarMinimizer /> */}
          </AppSidebar>
          <main className="main">
            {/* <AppBreadcrumb /> */}
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
export default Main;

//This is provide the Security to app Routing
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
