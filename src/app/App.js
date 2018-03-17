import React from "react";
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
  Link,
  browserHistory
} from "react-router";
import { Provider } from "react-firebase";
import { app } from "../firebase";

import Layout from "./Layout";
import ListEntries from "./ListEntries";
import ListSettings from "./ListSettings";
import EditEntry from "./EditEntry";
import EditSetting from "./EditSetting";
import * as models from "../models";

// TODO: make sure we're routing to a valid model, otherwise redirect

const firstModel = models[Object.keys(models)[0]];

export default function App() {
  return (
    <Provider firebaseApp={app}>
      <Router history={browserHistory}>
        <Route path="/" component={Layout}>
          <IndexRedirect to={`/content/${firstModel.property}`} />
          <Route path="content/:model">
            <IndexRoute component={ListEntries} />
            <Route path=":id" component={EditEntry} />
          </Route>
          <Route path="settings/:setting">
            <IndexRoute component={ListSettings} />
            <Route path=":id" component={EditSetting} />
          </Route>
        </Route>
      </Router>
    </Provider>
  );
}
