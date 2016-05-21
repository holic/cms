import React, {Component} from 'react'

export default class Manager extends Component {
  render () {
    return (
      <div>
        <p className="text-sm-right">
          <a className="btn btn-success" href="#">New blog post</a>
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lorem ipsum...</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
