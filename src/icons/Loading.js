import React from "react";
import ReloadIcon from "./Reload";
import classNames from "classnames";

export default function LoadingIcon(props) {
  return (
    <ReloadIcon
      {...props}
      className={classNames("icon-spin", props.className)}
    />
  );
}
