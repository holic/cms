import React, { Component } from 'react'
import { Link } from 'react-router'
import DocumentTitle from 'react-document-title'
import pluralize from 'pluralize'
import { database } from '../firebase'
import { map, capitalize } from '../utils'
import * as models from '../models'
import { CogIcon, LoadingIcon } from '../icons'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})


export default class List extends Component {
  componentWillMount () {
    const model = modelsByProperty[this.props.params.model]

    this.loadEntries(model)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.model !== this.props.params.model) {
      const model = modelsByProperty[nextProps.params.model]

      this.loadEntries(model)
    }
  }

  loadEntries (model) {
    const ref = database.ref(`data/${model.property}`)

    this.setState({
      model: model,
      listedFields: model.fields.filter(field => field.listed),
      ref: ref,
      isLoading: true,
      entries: null,
    })

    ref.off('value')
    ref.once('value', snapshot => {
      this.setState({
        isLoading: false,
        entries: snapshot.val()
      })
    })
  }

  componentWillUnmount () {
    const { ref } = this.state
    if (ref) ref.off('value')
  }

  render () {
    return (
      <DocumentTitle title={capitalize(pluralize(this.state.model.label))}>
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
                <th width="1"></th>
              </tr>
            </thead>

            {this.state.isLoading ?
              <tfoot>
                <tr>
                  <td colSpan={this.state.listedFields.length + 1}>
                    <LoadingIcon />
                  </td>
                </tr>
              </tfoot>
            : null}

            {!this.state.isLoading ?
              <tbody>
                {map(this.state.entries, (id, entry) => (
                  <tr key={id}>
                    {this.state.listedFields.map((field, i) => (
                      <td key={i}>{entry[field.property]}</td>
                    ))}
                    <td>
                      <Link to={`/content/${this.state.model.property}/${id}`}>
                        <CogIcon />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            : null}
          </table>
        </div>
      </DocumentTitle>
    )
  }
}
