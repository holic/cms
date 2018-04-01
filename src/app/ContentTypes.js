import React, { PureComponent } from "react";
import { connect } from "react-firebase";
import * as settings from "../models/settings";

class ContentTypes extends PureComponent {
  render() {
    const { children, ...props } = this.props;
    return children ? children(props) : null;
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
  loading: !firebaseProps.contentTypes,
  ready: !!firebaseProps.contentTypes,
  value: Object.values(firebaseProps.contentTypes || {})
    .map(model => ({
      ...model,
      fields: model.config ? JSON.parse(model.config) : []
    }))
    .filter(model => model.fields.length > 0)
});

export default connect(mapFirebaseToProps, mergeProps)(ContentTypes);
