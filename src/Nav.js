import React, {Component} from 'react'

export default class Nav extends Component {
  render () {
    return (
      <ul className="nav nav-pills nav-stacked">
        <li className="nav-item">
          <a className="nav-link active">Blog posts</a>
        </li>
        <li className="nav-item">
          <a className="nav-link">Authors</a>
        </li>
      </ul>
    )
  }
}
