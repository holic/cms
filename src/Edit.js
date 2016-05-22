import React, { Component } from 'react'
import { database } from './firebase'
import { map } from './utils'
import * as models from './models'
import * as fields from './fields'
import { LoadingIcon } from './icons'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})


export default class Edit extends Component {
  componentWillMount () {
    const model = modelsByProperty[this.props.params.model]
    const { id } = this.props.params

    this.loadEntry(model, id)
  }

  componentDidMount () {
    window.setBody = (body) => {
      this.setState({
        entry: {
          ...this.state.entry,
          body: body,
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.model !== this.props.params.model || nextProps.params.id !== this.props.params.id) {
      const model = modelsByProperty[nextProps.params.model]
      const { id } = nextProps.props.params

      this.loadEntry(model, id)
    }
  }

  loadEntry (model, id) {
    if (id === 'new') {
      this.setState({
        model: model,
        id: id,
        ref: null,
        isLoading: false,
        entry: {},
      })
      return
    }

    const ref = database.ref(`data/${model.property}/${id}`)

    this.setState({
      model: model,
      id: id,
      ref: ref,
      isLoading: true,
      entry: null,
    })

    ref.off('value')
    ref.once('value', snapshot => {
      this.setState({
        isLoading: false,
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
      entry: {
        ...this.state.entry,
        [property]: value,
      }
    })
  }

  render () {
    if (this.state.isLoading) {
      return (
        <p>
          <LoadingIcon />
        </p>
      )
    }

    return (
      <form>
        {this.state.model.fields.map((field, i) => {
          const Field = fields[field.type] || fields.text
          return <Field key={i} {...field} value={this.state.entry[field.property]} onChange={this.setProperty.bind(this, field.property)} />
        })}
        <button className="btn btn-primary btn-lg">Save</button>
      </form>
    )
  }
}
