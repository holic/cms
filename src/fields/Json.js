import React, { Component } from "react";
import classNames from "classnames";
import { capitalize } from "../utils";

// TODO: prop types

export default class Json extends Component {
  state = {
    isValid: true
  };

  onChange = event => {
    let json;
    let isValid;
    try {
      json = JSON.parse(event.target.value);
      isValid = true;
    } catch (e) {
      console.error(e);
      isValid = false;
    }

    this.setState({ isValid });

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
          className={classNames("form-control text-monospace", {
            "is-invalid": !this.state.isValid
          })}
          rows="12"
          value={this.props.value == null ? "" : this.props.value}
          onChange={this.onChange}
        />
        <small className="form-text text-muted">{this.props.description}</small>
      </fieldset>
    );
  }
}
