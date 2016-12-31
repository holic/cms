import React, { Component } from 'react'
import { capitalize } from '../utils'

// TODO: prop types

export default class code extends Component {
  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event.target.value === '' ? null : event.target.value)
    }
  }

  render () {
    return (
      <fieldset className="form-group mb-2">
        <label className="text-muted">{capitalize(this.props.label)}</label>
        <textarea className="form-control form-control-lg text-monospace" rows="8" value={this.props.value == null ? '' : this.props.value} onChange={this.onChange} />
        <small className="form-text text-muted">{this.props.description}</small>
      </fieldset>
    )
  }
}
