import React, { PureComponent } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import List from "./List";
import Edit from "./Edit";
import { map } from "../utils";

export default class Entries extends PureComponent {
  render() {
    const { match, contentTypes } = this.props;

    if (!contentTypes) {
      return <div />;
    }

    const modelsByProperty = {};
    contentTypes.map(model => {
      modelsByProperty[model.property] = model;
    });

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
              firebaseRef="data"
              url={id => `${match.url}/${id || "new"}`}
            />
          )}
        />
        <Route
          path={`${match.url}/:id`}
          render={props => (
            <Edit
              parentUrl={match.url}
              model={model}
              firebaseRef="data"
              id={
                props.match.params.id === "new" ? null : props.match.params.id
              }
            />
          )}
        />
      </Switch>
    );
  }
}
