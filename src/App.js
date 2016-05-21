import React, {Component} from 'react'
import Nav from './Nav'
import Manager from './Manager'

export default class App extends Component {
  render () {
    return (
      <div className="container-fluid" style={{height: '100%'}}>
        <div className="row" style={{height: '100%'}}>
          <div className="col-sm-2 p-a-2 bg-faded" style={{height: '100%'}}>
            <Nav />
          </div>
          <div className="col-sm-10 p-a-2">
            <Manager />
          </div>
        </div>
      </div>
    )
  }
}
