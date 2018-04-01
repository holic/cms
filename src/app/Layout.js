import React, { PureComponent } from "react";
import DocumentTitle from "react-document-title";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-firebase";
import Nav from "./Nav";
import Entries from "./Entries";
import Settings from "./Settings";
import * as settings from "../models/settings";
import ContentTypes from "./ContentTypes";

class Layout extends PureComponent {
  render() {
    const { contentTypes } = this.props;
    return (
      <DocumentTitle title="CMS">
        <div className="row no-gutters minh-100">
          <div className="col-sm-4 col-md-3 col-xl-2 bg-light">
            <div className="p-4">
              <ContentTypes>
                {types => <Nav contentTypes={types.value} />}
              </ContentTypes>
            </div>
          </div>
          <div className="col">
            <div className="p-4">
              <ContentTypes>
                {types => (
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
                )}
              </ContentTypes>
            </div>
          </div>
        </div>
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
