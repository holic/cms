import React, { Component } from 'react'

// TODO: prop types

export default class Image extends Component {
  removeImage = (event) => {
    if (this.props.onChange) {
      this.props.onChange(null)
    }
  }

  uploadImage = (event) => {
    // Do nothing if we don't have an onChange handler
    if (!this.props.onChange) return

    const el = event.target
    const [file] = el.files || []
    if (!file) return

    console.log('upload it', file)

    // TODO: do something with file API

    if (this.props.onChange) {
      this.props.onChange(null)
    }
 
    // reset file upload so the same file can be selected to trigger change event
    el.value = el.defaultValue
  }

  render () {
    return (
      <fieldset className="form-group m-b-2">
        <label className="text-muted">{this.props.label}</label>
        {!this.props.value ?
          <p className="form-control-static">
            <label htmlFor="upload-input" className="btn btn-primary m-b-0">Upload an image</label>
            <input id="upload-input" className="hidden-xs-up" type="file" accept="image/*" onChange={this.uploadImage} />
          </p>
        : null}
        {this.props.value ?
          <div className="row">
            <div className="col-sm-10 col-md-8 col-lg-6">
              <div className="card card-inverse">
                <img className="card-img img-fluid" src={this.props.value} />
                <div className="card-img-overlay">
                  <p className="card-text text-xs-right">
                    <button type="button" className="btn btn-primary btn-sm" onClick={this.removeImage}>Remove</button>
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
