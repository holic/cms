import React from "react";
import DocumentTitle from "react-document-title";
import { Route, Redirect, Switch } from "react-router-dom";
import Nav from "./Nav";
import Entries from "./Entries";
import Settings from "./Settings";
import * as models from "../models";

const firstModel = models[Object.keys(models)[0]];

export default function Layout({ children }) {
  return (
    <DocumentTitle title="CMS">
      <div className="row no-gutters minh-100">
        <div className="col-sm-4 col-md-3 col-xl-2 bg-light">
          <div className="p-4">
            <Nav />
          </div>
        </div>
        <div className="col">
          <div className="p-4">
            <Switch>
              <Route path="/content/:model" component={Entries} />
              <Route path="/settings/:model" component={Settings} />
              <Redirect to={`/content/${firstModel.property}`} />
            </Switch>
          </div>
        </div>
      </div>
    </DocumentTitle>
  );
}
