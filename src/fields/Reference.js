import React, { Component } from 'react'
import { Link } from 'react-router'
import { database } from '../firebase'
import { map } from '../utils'
import * as models from '../models'
import { LoadingIcon } from '../icons'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})

// TODO: prop types

export default class Reference extends Component {
  componentWillMount () {
    const model = modelsByProperty[this.props.model]

    this.loadOptions(model)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.model !== this.props.model) {
      const model = modelsByProperty[nextProps.model]

      this.loadOptions(model)
    }
  }

  loadOptions (model) {
    const ref = database.ref(`data/${model.property}`)

    this.setState({
      model: model,
      ref: ref,
      isLoading: true,
      options: null,
    })

    ref.off('value')
    ref.once('value', snapshot => {
      const options = []
      snapshot.forEach(child => {
        const value = child.val()
        options.push({
          value: child.ref.toString(),
          // TODO: make `name` property configurable
          text: value[this.props.ref_label_property],
        })
      })
      this.setState({
        isLoading: false,
        options: options,
      })
    })
  }

  componentWillUnmount () {
    const { ref } = this.state
    if (ref) ref.off('value')
  }

  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event.target.value === '' ? null : event.target.value)
    }
  }

  render () {
    return (
      <fieldset className="form-group m-b-2">
        <label className="text-muted">{this.props.label}</label>
        {this.state.isLoading ?
          <p className="form-control-static">
            <LoadingIcon />
          </p>
        : null}
        {!this.state.isLoading ?
          <select className="form-control form-control-lg" value={this.props.value == null ? '' : this.props.value} onChange={this.onChange}>
            <option value=""></option>
            {map(this.state.options, (i, option) => (
              <option key={i} value={option.value}>{option.text}</option>
            ))}
          </select>
        : null}
      </fieldset>
    )
  }
}
