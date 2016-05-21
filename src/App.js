import React, {Component} from 'react'
import Nav from './Nav'
import Manager from './Manager'

export default class App extends Component {
  render () {
    return (
      <div className="container-fluid" style={{paddingTop: 15, paddingBottom: 15}}>
        <div className="row">
          <div className="col-sm-2">
            <Nav />
          </div>
          <div className="col-sm-10">
            <Manager />
          </div>
        </div>
      </div>
    )
  }
}
