import React, {Component} from 'react'
import {database} from './firebase'
import {map} from './utils'
import * as models from './models'

const model = models.Post
const listRef = database.ref(`data/${model.property}`)
const listedFields = model.fields.filter(field => field.listed)

export default class Manager extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      entries: [],
    }
  }

  componentWillMount () {
    listRef.on('value', snapshot => {
      console.log(snapshot.val())
      this.setState({
        isLoading: false,
        entries: snapshot.val()
      })
    })
  }

  render () {
    if (this.state.isLoading) {
      return <em>Loading...</em>
    }

    return (
      <div>
        <p className="text-sm-right">
          <a className="btn btn-success" href="#">New {model.label}</a>
        </p>
        <table className="table">
          <thead>
            <tr>
              {listedFields.map((field, i) => (
                <th key={i}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {map(this.state.entries, (id, entry) => (
              <tr key={id}>
                {listedFields.map((field, i) => (
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
