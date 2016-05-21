import React, { Component } from 'react'
import { Link } from 'react-router'
import { database } from '../firebase'
import { map } from '../utils'
import * as models from '../models'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})

// TODO: prop types

export default class Reference extends Component {
  constructor (props) {
    super(props)

    const model = modelsByProperty[this.props.model]

    this.state = {
      model: model,
      isLoading: true,
      options: [],
    }
  }

  componentWillMount () {
    const ref = database.ref(`data/${this.state.model.property}`)
    ref.once('value', snapshot => {
      const options = []
      snapshot.forEach(child => {
        options.push({
          value: child.ref.toString(),
          // TODO: make `name` property configurable
          text: child.val().name,
        })
      })
      this.setState({
        isLoading: false,
        options: options,
      })
    })
  }

  render () {
    return (
      <fieldset className="form-group m-b-2">
        <label className="text-muted">{this.props.label}</label>
        {this.state.isLoading ?
          <p className="form-control-static"><em className="text-muted">Loading...</em></p>
        : null}
        {!this.state.isLoading ?
          <select className="form-control form-control-lg" defaultValue={this.props.value}>
            {map(this.state.options, (i, option) => (
              <option key={i} value={option.value}>{option.text}</option>
            ))}
          </select>
        : null}
      </fieldset>
    )
  }
}
