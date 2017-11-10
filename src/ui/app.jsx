import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Provider } from "react-redux";
import Create from "./components/invoice/create";
import Display from "./components/invoice/display";
import NoData from "./components/invoice/no-data";

export default store => () =>
    <Provider store={store}>
      <div>
        <Router>
          <div>
            <Switch>
              <Route exact path="/invoice/create" component={Create} />
              <Route exact path="/invoice/no-data" component={NoData} />
              <Route exact path="/invoice/:id" component={Display} />
              <Route path="/" component={Create} />
            </Switch>
          </div>
        </Router>
      </div>
    </Provider>
