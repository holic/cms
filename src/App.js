import React, { Component } from 'react'
import Nav from './Nav'

export default class App extends Component {
  render () {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-4 col-md-3 col-lg-2 p-a-2 bg-faded" style={{position: 'absolute', top: 0, left: 0, bottom: 0}}>
            <Nav />
          </div>
          <div className="offset-sm-4 offset-md-3 offset-lg-2 col-sm-8 col-md-9 col-lg-10 p-a-2">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
