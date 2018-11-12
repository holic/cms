import React from "react";
import { NavLink } from "react-router-dom";
import pluralize from "pluralize";
import { map, capitalize } from "../utils";
import * as settings from "../models/settings";

const Nav = ({ contentTypes }) => (
  <>
    <div className="mt-2">
      <h6 className="mx-3 text-muted text-uppercase">
        <small>Content</small>
      </h6>
      <ul className="nav nav-pills flex-column">
        {contentTypes.map(model => (
          <li key={model.property} className="nav-item">
            <NavLink
              to={`/content/${model.property}`}
              className="nav-link"
              activeClassName="active"
            >
              {capitalize(pluralize(model.label))}
            </NavLink>
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
            <NavLink
              to={`/settings/${setting.property}`}
              className="nav-link"
              activeClassName="active"
            >
              {capitalize(pluralize(setting.label))}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </>
);

export default React.memo(Nav);
