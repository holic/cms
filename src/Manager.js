import React, {Component} from 'react'
import {database} from './firebase'

const listRef = database.ref('data/posts')

const map = (object, fn) => Object.keys(object).map((key) => fn(key, object[key]))

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
          <a className="btn btn-success" href="#">New blog post</a>
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {map(this.state.entries, (id, entry) => (
              <tr key={id}>
                <td>{entry.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
