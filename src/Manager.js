import React, { Component } from 'react'
import { database } from './firebase'
import { map } from './utils'
import * as models from './models'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})


export default class Manager extends Component {
  constructor (props) {
    super(props)

    const model = modelsByProperty[this.props.params.model]

    this.state = {
      model: model,
      listedFields: model.fields.filter(field => field.listed),
      isLoading: true,
      entries: [],
    }

    this.loadEntries(model)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.model !== this.props.params.model) {
      const model = modelsByProperty[nextProps.params.model]

      this.setState({
        model: model,
        listedFields: model.fields.filter(field => field.listed),
        isLoading: true,
        entries: [],
      })

      this.loadEntries(model)
    }
  }

  loadEntries (model) {
    console.log('loading entries for', model)
    const ref = database.ref(`data/${model.property}`)
    ref.on('value', snapshot => {
      // if (this.state.model !== model) {
      //   console.log('not the right model, throwing out results')
      //   return
      // }
      this.setState({
        isLoading: false,
        entries: snapshot.val()
      })
    })
  }

  render () {
    if (this.state.isLoading) {
      return <em className="text-muted">Loading...</em>
    }

    return (
      <div>
        <p className="text-sm-right">
          <a className="btn btn-success" href="#">New {this.state.model.label}</a>
        </p>
        <table className="table">
          <thead>
            <tr>
              {this.state.listedFields.map((field, i) => (
                <th key={i}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {map(this.state.entries, (id, entry) => (
              <tr key={id}>
                {this.state.listedFields.map((field, i) => (
                  <td key={i}>{entry[field.property]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
