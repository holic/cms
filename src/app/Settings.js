import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import List from "./List";
import Edit from "./Edit";
import { map } from "../utils";
import * as settings from "../models/settings";

const modelsByProperty = {};
map(settings, (key, model) => {
  modelsByProperty[model.property] = model;
});

const Settings = ({ match, history }) => {
  const model = modelsByProperty[match.params.model];
  if (!model) {
    // TODO: Link to settings instead of just redirecting?
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route
        exact
        path={match.url}
        render={() => (
          <List
            model={model}
            firebaseRef="config"
            url={id => `${match.url}/${id || "new"}`}
          />
        )}
      />
      <Route
        path={`${match.url}/:id`}
        render={props => (
          <Edit
            model={model}
            firebaseRef="config"
            id={props.match.params.id === "new" ? null : props.match.params.id}
            backToList={() => history.push(match.url)}
          />
        )}
      />
    </Switch>
  );
};

export default React.memo(Settings);
