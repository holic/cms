import React, {Component} from 'react'

export default class Nav extends Component {
  render () {
    return (
      <div>
        <div className="m-t-1 m-b-3">
          <h6 className="m-x-1 text-muted text-uppercase"><small>Content</small></h6>
          <ul className="nav nav-pills nav-stacked">
            <li className="nav-item">
              <a className="nav-link active" href="#">Blog posts</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Authors</a>
            </li>
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
