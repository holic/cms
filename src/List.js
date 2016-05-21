import React, { Component } from 'react'
import { Link } from 'react-router'
import { database } from './firebase'
import { map } from './utils'
import * as models from './models'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})


export default class List extends Component {
  constructor (props) {
    super(props)

    const model = modelsByProperty[this.props.params.model]

    this.state = {
      model: model,
      listedFields: model.fields.filter(field => field.listed),
      isLoading: true,
      entries: [],
    }
  }

  componentWillMount () {
    this.loadEntries(this.state.model)
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
      // TODO: throw out if state has changed
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
          <Link to={`/content/${this.state.model.property}/new`} className="btn btn-secondary">
            New {this.state.model.label}
          </Link>
        </p>
        <table className="table table-hover">
          <thead>
            <tr>
              {this.state.listedFields.map((field, i) => (
                <th key={i}>{field.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {map(this.state.entries, (id, entry) => (
              <tr key={id}>
                {this.state.listedFields.map((field, i) => (
                  <td key={i}>{entry[field.property]}</td>
                ))}
                <td width="1">
                  <Link to={`/content/${this.state.model.property}/${id}`}>
                    <svg viewBox="0 0 8 8" style={{width: '1em', height: '1em', fill: 'currentColor'}}>
                      <path d="M3.5 0l-.5 1.19c-.1.03-.19.08-.28.13l-1.19-.5-.72.72.5 1.19c-.05.1-.09.18-.13.28l-1.19.5v1l1.19.5c.04.1.08.18.13.28l-.5 1.19.72.72 1.19-.5c.09.04.18.09.28.13l.5 1.19h1l.5-1.19c.09-.04.19-.08.28-.13l1.19.5.72-.72-.5-1.19c.04-.09.09-.19.13-.28l1.19-.5v-1l-1.19-.5c-.03-.09-.08-.19-.13-.28l.5-1.19-.72-.72-1.19.5c-.09-.04-.19-.09-.28-.13l-.5-1.19h-1zm.5 2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
