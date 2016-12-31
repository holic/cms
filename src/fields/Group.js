import React, { Component } from 'react'
import { database } from '../firebase'
import * as fields from '../fields'
import { capitalize } from '../utils'

// TODO: prop types

export default class Group extends Component {
  addItem (field) {
    return (event) => {
      const items = this.props.value || []

      const newItems = [
        ...items,
        {
          type: field.name,
          value: null
        }
      ]

      this.props.onChange(newItems.length ? newItems : null)
    }
  }

  updateItem (index) {
    return (value) => {
      this.props.onChange(this.props.value.map((field, i) => {
        if (i === index) {
          return {
            ...field,
            value,
          }
        }
        return field
      }))
    }
  }

  removeItem (index) {
    return (event) => {
      const items = this.props.value

      const newItems = [
        ...items.slice(0, index),
        ...items.slice(index + 1),
      ]

      this.props.onChange(newItems.length ? newItems : null)
    }
  }

  fieldFromItem (item) {
    return this.props.types.filter(field => field.name === item.type)[0]
  }

  render () {
    return (
      <fieldset className="form-group mb-2">
        <label className="text-muted lead">{capitalize(this.props.label)}</label>
        <div className="pl-3 py-1">
          {this.props.value && this.props.value.length ?
            this.props.value.map((item, i) => {
              const field = this.fieldFromItem(item)
              const Field = fields[field.type] || fields.text
              return (
                <div key={i}>
                  <button type="button" className="close" onClick={this.removeItem(i)}>&times;</button>
                  <Field label={field.label} value={item.value} onChange={this.updateItem(i)} />
                </div>
              )
            })
          : null}

          <label className="text-muted">Add a&hellip;</label>
          <div className="btn-list">
            {this.props.types.map((field, i) => (
              <button key={i} type="button" className="btn btn-secondary btn-sm" onClick={this.addItem(field)}>
                {capitalize(field.label)}
              </button>
            ))}
          </div>
        </div>
      </fieldset>
    )
  }
}
