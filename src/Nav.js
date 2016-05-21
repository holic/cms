import React, {Component} from 'react'
import pluralize from 'pluralize'
import {map, capitalize} from './utils'
import * as models from './models'

export default class Nav extends Component {
  render () {
    return (
      <div>
        <div className="m-t-1 m-b-3">
          <h6 className="m-x-1 text-muted text-uppercase"><small>Content</small></h6>
          <ul className="nav nav-pills nav-stacked">
            {map(models, (key, model) => (
              <li key={key} className="nav-item">
                <a className="nav-link" href={`/content/${model.property}`}>{capitalize(pluralize(model.label))}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="m-t-1 m-b-3">
          <h6 className="m-x-1 text-muted text-uppercase"><small>Settings</small></h6>
          <ul className="nav nav-pills nav-stacked">
            <li className="nav-item">
              <a className="nav-link" href="#">Content types</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
