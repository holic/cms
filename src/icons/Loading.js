import React, { PureComponent } from "react";
import ReloadIcon from "./Reload";
import classNames from "classnames";

export default class LoadingIcon extends PureComponent {
  render() {
    return (
      <ReloadIcon
        {...this.props}
        className={classNames("icon-spin", this.props.className)}
      />
    );
  }
}
