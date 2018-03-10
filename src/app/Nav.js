import React, { Component } from "react";
import { Link } from "react-router";
import pluralize from "pluralize";
import { map, capitalize } from "../utils";
import * as models from "../models";
import * as settings from "../models/settings";

export default class Nav extends Component {
  render() {
    return (
      <div>
        <div className="mt-2">
          <h6 className="mx-3 text-muted text-uppercase">
            <small>Content</small>
          </h6>
          <ul className="nav nav-pills flex-column">
            {map(models, (key, model) => (
              <li key={key} className="nav-item">
                <Link
                  to={`/content/${model.property}`}
                  className="nav-link"
                  activeClassName="active"
                >
                  {capitalize(pluralize(model.label))}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5">
          <h6 className="mx-3 text-muted text-uppercase">
            <small>Settings</small>
          </h6>
          <ul className="nav nav-pills flex-column">
            {map(settings, (key, setting) => (
              <li key={key} className="nav-item">
                <Link
                  to={`/settings/${setting.property}`}
                  className="nav-link"
                  activeClassName="active"
                >
                  {capitalize(pluralize(setting.label))}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
