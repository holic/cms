import React, { Component } from 'react'

// TODO: prop types

export default class Markdown extends Component {
  render () {
    return (
      <fieldset className="form-group m-b-2">
        <label className="text-muted">{this.props.label}</label>
        <textarea className="form-control form-control-lg" rows="12" defaultValue={this.props.value} />
      </fieldset>
    )
  }
}
