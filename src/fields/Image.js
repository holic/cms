import React, { Component } from 'react'

// TODO: prop types

export default class Image extends Component {
  render () {
    return (
      <fieldset className="form-group m-b-2">
        <label className="text-muted">{this.props.label}</label>
        {!this.props.value ?
          <p className="form-control-static">
            <button className="btn btn-primary">Upload an image</button>
          </p>
        : null}
        {this.props.value ?
          <div className="row">
            <div className="col-sm-10 col-md-8 col-lg-6">
              <div className="card card-inverse">
                <img className="card-img img-fluid" src={this.props.value} />
                <div className="card-img-overlay">
                  <p className="card-text text-xs-right">
                    <button className="btn btn-primary btn-sm">Remove</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        : null}
      </fieldset>
    )
  }
}
