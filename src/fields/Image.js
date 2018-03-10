import React, { Component } from "react";
import { storage } from "../firebase";
import { LoadingIcon } from "../icons";
import { capitalize } from "../utils";

// TODO: prop types

export default class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploading: false
    };
  }

  removeImage = event => {
    if (this.props.onChange) {
      this.props.onChange(null);
    }
  };

  uploadImage = event => {
    // Do nothing if we don't have an onChange handler
    if (!this.props.onChange) return;

    const el = event.target;
    const [file] = el.files || [];
    if (!file) return;

    console.log("Uploading file", file);

    const ref = storage.ref(`images/${file.name}`);
    const upload = ref.put(file, { contentType: file.type });

    upload.on(
      "state_changed",
      snapshot => {
        this.setState({
          isUploading: true
        });
      },
      err => {
        this.setState({
          isUploading: false
        });

        console.error("Upload failed", err);
      },
      () => {
        this.setState({
          isUploading: false
        });

        if (this.props.onChange) {
          console.log("Upload complete", upload.snapshot);
          this.props.onChange(upload.snapshot.downloadURL);
        }
      }
    );

    // reset file upload so the same file can be selected to trigger change event
    el.value = el.defaultValue;
  };

  renderInput() {
    if (this.state.isUploading) {
      return (
        <div>
          <button type="button" className="btn btn-primary" disabled>
            Uploading… <LoadingIcon />
          </button>
        </div>
      );
    }

    return (
      <div>
        <label htmlFor="upload-input" className="btn btn-primary mb-0">
          Upload an image
        </label>
        <input
          id="upload-input"
          className="d-none"
          type="file"
          accept="image/*"
          onChange={this.uploadImage}
        />
      </div>
    );
  }

  renderValue() {
    return (
      <div className="row">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="card mb-0">
            <img className="card-img img-fluid" src={this.props.value} />
            <div className="card-img-overlay">
              <p className="card-text text-sm-right">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={this.removeImage}
                >
                  Remove
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <fieldset className="form-group mb-4">
        <label className="text-muted">{capitalize(this.props.label)}</label>
        {this.props.value ? this.renderValue() : this.renderInput()}
      </fieldset>
    );
  }
}
