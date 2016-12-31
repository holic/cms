import React, { Component } from 'react'
import { withRouter } from 'react-router'
import DocumentTitle from 'react-document-title'
import { database } from '../firebase'
import { map } from '../utils'
import * as models from '../models'
import * as fields from '../fields'
import { LoadingIcon } from '../icons'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})


export default class Edit extends Component {
  getModelConfig (params) {
    return modelsByProperty[params.model]
  }
  getModelRef (ref) {
    return database.ref(`data/${ref}`)
  }
  getModelPath (params) {
    return `/content/${params.model}`
  }

  componentWillMount () {
    const model = this.getModelConfig(this.props.params)
    const { id } = this.props.params

    this.loadEntry(model, id)
  }

  componentDidMount () {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.hasUnsavedChanges) {
        return 'You have unsaved changes.\nLeaving this page will discard these changes.'
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    const model = this.getModelConfig(this.props.params)
    const nextModel = this.getModelConfig(nextProps.params)

    if (nextModel !== model || nextProps.params.id !== this.props.params.id) {
      const { id } = nextProps.props.params
      this.loadEntry(nextModel, id)
    }
  }

  loadEntry (model, id) {
    if (id === 'new') {
      this.setState({
        model: model,
        id: id,
        ref: null,
        isLoading: false,
        hasUnsavedChanges: false,
        entry: {},
      })
      return
    }

    const ref = this.getModelRef(`${model.property}/${id}`)

    this.setState({
      model: model,
      id: id,
      ref: ref,
      isLoading: true,
      entry: null,
    })

    ref.off('value')
    ref.once('value', (snapshot) => {
      // TODO: redirect when not found
      this.setState({
        isLoading: false,
        hasUnsavedChanges: false,
        entry: snapshot.val()
      })
    })
  }

  componentWillUnmount () {
    const { ref } = this.state
    if (ref) ref.off('value')
  }

  setProperty (property, value) {
    this.setState({
      hasUnsavedChanges: true,
      entry: {
        ...this.state.entry,
        [property]: value,
      },
    })
  }

  saveEntry = (event) => {
    event.preventDefault()

    if (this.state.ref) {
      this.state.ref.set(this.state.entry)
    }
    else {
      this.getModelRef(`${this.state.model.property}`).push(this.state.entry)
    }

    this.setState({
      hasUnsavedChanges: false,
    }, () => {
      this.props.router.push(this.getModelPath(this.props.params))
    })
  }

  deleteEntry = (event) => {
    // No ref to delete? This should only happen when this is a new entry.
    if (!this.state.ref) return

    if (window.confirm('This cannot be undone. Continue?')) {
      this.state.ref.remove()

      this.setState({
        hasUnsavedChanges: false,
      }, () => {
        this.props.router.push(this.getModelPath(this.props.params))
      })
    }
  }

  renderContent () {
    if (this.state.isLoading) {
      return (
        <p>
          <LoadingIcon />
        </p>
      )
    }

    return (
      <div>
        <form onSubmit={this.saveEntry}>
          {this.state.model.fields.map((field, i) => {
            const Field = fields[field.type] || fields.text
            return <Field key={i} {...field} value={this.state.entry[field.property]} onChange={this.setProperty.bind(this, field.property)} />
          })}
          <button type="submit" className="btn btn-primary btn-lg" disabled={!this.state.hasUnsavedChanges}>Save</button>
        </form>
        {this.state.ref ?
          <p className="text-xs-right">
            <button type="button" className="btn btn-link text-muted" onClick={this.deleteEntry}>Delete this {this.state.model.label}</button>
          </p>
        : null}
      </div>
    )
  }

  render () {
    return (
      <DocumentTitle title={this.state.ref ? `Edit ${this.state.model.label}` : `New ${this.state.model.label}`}>
        {this.renderContent()}
      </DocumentTitle>
    )
  }
}

export const EditWithRouter = withRouter(Edit)
