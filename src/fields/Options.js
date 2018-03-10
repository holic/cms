import React, { Component } from "react";
import { capitalize } from "../utils";

// TODO: prop types

export default class Options extends Component {
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
        <select
          className="form-control form-control-lg custom-select"
          value={this.props.value == null ? "" : this.props.value}
          onChange={this.onChange}
        >
          <option value="" disabled />
          {this.props.options.map(option => (
            <option key={option.value} value={option.value}>
              {capitalize(option.label)}
            </option>
          ))}
        </select>
        <small className="form-text text-muted">{this.props.description}</small>
      </fieldset>
    );
  }
}
