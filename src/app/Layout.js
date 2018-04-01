import React, { PureComponent } from "react";
import DocumentTitle from "react-document-title";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-firebase";
import Nav from "./Nav";
import Entries from "./Entries";
import Settings from "./Settings";
import * as settings from "../models/settings";
import ContentTypes from "./ContentTypes";
import { LoadingIcon } from "../icons";

class Layout extends PureComponent {
  render() {
    const { contentTypes } = this.props;
    return (
      <DocumentTitle title="CMS">
        <ContentTypes>
          {types => (
            <div className="row no-gutters minh-100">
              <div className="col-sm-4 col-md-3 col-xl-2 bg-light">
                <div className="p-4">
                  {types.loading
                    ? <span className="text-muted"><LoadingIcon /></span>
                    : <Nav contentTypes={types.value} />}
                </div>
              </div>
              <div className="col">
                <div className="p-4">
                  <Switch>
                    <Route path="/settings/:model" component={Settings} />
                    <Route
                      path="/content/:model"
                      render={props => (
                        <Entries {...props} contentTypes={types.value} />
                      )}
                    />
                    {types.ready
                      ? <Redirect to={`/content/${types.value[0].property}`} />
                      : null}
                  </Switch>
                </div>
              </div>
            </div>
          )}
        </ContentTypes>
      </DocumentTitle>
    );
  }
}

const mapFirebaseToProps = (props, ref, firebase) => ({
  contentTypes: {
    path: `config/${settings.contentType.property}`,
    orderByChild: "label"
  }
});

const mergeProps = (ownProps, firebaseProps) => ({
  ...ownProps,
  contentTypes: firebaseProps.contentTypes
    ? Object.values(firebaseProps.contentTypes).map(model => ({
        ...model,
        fields: model.config ? JSON.parse(model.config) : []
      }))
    : null
});

export default connect(mapFirebaseToProps, mergeProps)(Layout);
