import React, { Component } from 'react'
import Nav from './Nav'
import Manager from './Manager'

export default class App extends Component {
  render () {
    return (
      <div className="container-fluid" style={{height: '100%'}}>
        <div className="row" style={{height: '100%'}}>
          <div className="col-sm-4 col-md-3 col-lg-2 p-a-2 bg-faded" style={{height: '100%'}}>
            <Nav />
          </div>
          <div className="col-sm-8 col-md-9 col-lg-10 p-a-2">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
