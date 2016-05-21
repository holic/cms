import React, { Component } from 'react'
import { database } from './firebase'
import { map } from './utils'
import * as models from './models'
import * as fields from './fields'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})


export default class Edit extends Component {
  constructor (props) {
    super(props)

    const model = modelsByProperty[this.props.params.model]
    const { id } = this.props.params

    this.state = {
      model: model,
      id: id,
      isLoading: true,
      entry: null,
    }
  }

  componentWillMount () {
    this.loadEntry(this.state.model, this.state.id)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.model !== this.props.params.model && nextProps.params.id !== this.props.params.id) {
      const model = modelsByProperty[nextProps.params.model]
      const { id } = nextProps.props.params

      this.setState({
        model: model,
        id: id,
        isLoading: true,
        entry: null,
      })

      this.loadEntry(model, id)
    }
  }

  loadEntry (model, id) {
    console.log('loading entry for', model, id)
    const ref = database.ref(`data/${model.property}/${id}`)
    ref.once('value', snapshot => {
      // TODO: throw out if state has changed
      this.setState({
        isLoading: false,
        entry: snapshot.val()
      })
    })
  }

  render () {
    if (this.state.isLoading) {
      return <em className="text-muted">Loading...</em>
    }

    return (
      <div>
        <form>
          {this.state.model.fields.map((field, i) => {
            const Field = fields[field.type] || fields.text
            return <Field key={i} {...field} value={this.state.entry[field.property]} />
          })}
          <button className="btn btn-primary btn-lg">Save</button>
        </form>
      </div>
    )
  }
}
