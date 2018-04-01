import React, { PureComponent } from "react";
import { capitalize } from "../utils";

// TODO: prop types

export default class Markdown extends PureComponent {
  onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(
        event.target.value === "" ? null : event.target.value
      );
    }
  };

  render() {
    return (
      <fieldset className="form-group mb-4">
        <label className="text-muted">{capitalize(this.props.label)}</label>
        <textarea
          className="form-control"
          rows="12"
          value={this.props.value == null ? "" : this.props.value}
          onChange={this.onChange}
        />
        <small className="form-text text-muted">{this.props.description}</small>
      </fieldset>
    );
  }
}
