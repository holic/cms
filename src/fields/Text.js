import React, { Component } from 'react'

// TODO: prop types

const inputType = type => {
  switch (type) {
    case ['text', 'email']:
      return type
    default:
      return 'text'
  }
}

export default class Text extends Component {
  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event.target.value)
    }
  }

  render () {
    return (
      <fieldset className="form-group m-b-2">
        <label className="text-muted">{this.props.label}</label>
        <input type={inputType(this.props.type)} className="form-control form-control-lg" value={this.props.value == null ? '' : this.props.value} onChange={this.onChange} />
      </fieldset>
    )
  }
}
