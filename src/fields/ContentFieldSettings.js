import React, { Component } from "react";
import { capitalize } from "../utils";
import fields from "../fields";

export default class ContentFieldSettings extends Component {
  value = (field, defaultValue) =>
    this.props.value != null && this.props.value[field] != null
      ? this.props.value
      : defaultValue;

  onChange = field => event => {
    if (this.props.onChange) {
      this.props.onChange({
        ...(this.props.value || {}),
        [field]: event.target.value === "" ? null : event.target.value
      });
    }
  };

  render() {
    return (
      <fieldset className="form-group mb-4">
        <label className="text-muted">{capitalize(this.props.label)}</label>
        <div className="pl-4 py-2 border-left border-secondary">
          <div className="row mb-1">
            <label className="col-sm-3 col-form-label">Label</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                value={this.value("label", "")}
                onChange={this.onChange("label")}
              />
            </div>
          </div>
          <div className="row mb-1">
            <label className="col-sm-3 col-form-label">Property</label>
            <div className="col-sm-9">
              <input
                className="form-control"
                value={this.value("property", "")}
                onChange={this.onChange("property")}
              />
            </div>
          </div>
          <div className="row mb-1">
            <label className="col-sm-3 col-form-label">Type</label>
            <div className="col-sm-9">
              <select
                className="form-control"
                value={this.value("type", "")}
                onChange={this.onChange("type")}
              >
                <option value="" />
                {fields.map(field => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-1">
            <div className="offset-sm-3 col-sm-9">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={this.value("required", false)}
                  onChange={this.onChange("required")}
                />
                <label className="form-check-label">Required?</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={this.value("listed", false)}
                  onChange={this.onChange("listed")}
                />
                <label className="form-check-label">Listed?</label>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    );
  }
}
