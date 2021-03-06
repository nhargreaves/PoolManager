import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import LandingPage from "./LandingPage.js";
import LeaguePage from "./LeaguePage";
import SeasonsPage from "./SeasonsPage.js";
import BookingPage from "./BookingPage";
import HoFPage from "./HoFPage";
import UserPage from "./UserPage";
import NotFound from "./NotFound";
import auth0Client from "../Auth";
import { ToastContainer } from "react-toastify";

import Callback from "../Callback";
import KittyPage from "./KittyPage.js";

class App extends React.Component {
  //Silent auth
  async componentDidMount() {
    if (this.props.location.pathname === "/callback") return;
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== "login_required") console.log(err.error);
    }
  }
  render() {
    return (
      <div>
        <ToastContainer />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/:type(8|9)-ball/overview/" exact component={NotFound} />
          <Route
            path="/:type(8|9)-ball/overview/:seasonId?"
            component={LeaguePage}
          />
          <Route
            path="/:type(billiards)/overview/:seasonId?"
            component={LeaguePage}
          />
          <Route path="/:type(8|9)-ball/seasons" component={SeasonsPage} />
          <Route path="/:type(billiards)/seasons" component={SeasonsPage} />
          <Route path="/:type(8|9)-ball/hall_of_fame" component={HoFPage} />
          <Route path="/:type(billiards)/hall_of_fame" component={HoFPage} />
          <Route path="/:type(8|9)-ball/kitty" component={KittyPage} />
          <Route path="/:type(billiards)/kitty" component={KittyPage} />
          <Route path="/:type(8|9)-ball/dashboard" component={UserPage} />
          <Route path="/:type(billiards)/dashboard" component={UserPage} />
          <Route
            path="/:type(8|9)-ball/fixtures/:seasonId"
            component={BookingPage}
          />
          <Route
            path="/:type(billiards)/fixtures/:seasonId"
            component={BookingPage}
          />
          <Route path="/callback" component={Callback} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
