import React, { Component, Fragment } from "react";
import { Prompt } from "react-router-dom";
import { connect } from "react-firebase";
import DocumentTitle from "react-document-title";
import * as fields from "../fields";
import { LoadingIcon } from "../icons";

class Edit extends Component {
  state = {
    hasUnsavedChanges: false,
    changes: {}
  };

  setProperty(property, value) {
    this.setState({
      hasUnsavedChanges: true,
      changes: {
        ...this.state.changes,
        [property]: value
      }
    });
  }

  saveEntry = event => {
    event.preventDefault();

    // TODO: only send changes through
    this.props.saveEntry({
      ...this.props.entry,
      ...this.state.changes
    });

    this.setState({ hasUnsavedChanges: false }, this.props.backToList);
  };

  deleteEntry = event => {
    event.preventDefault();
    if (!this.props.deleteEntry) return;

    // TODO: migrate to Prompt?
    if (window.confirm("This cannot be undone. Continue?")) {
      this.props.deleteEntry();
      this.setState({ hasUnsavedChanges: false }, this.props.backToList);
    }
  };

  renderContent() {
    const { id, entry, model } = this.props;
    const { hasUnsavedChanges, changes } = this.state;
    const isLoading = id && entry == null;

    if (isLoading) {
      return (
        <p className="text-muted">
          <LoadingIcon />
        </p>
      );
    }

    return (
      <Fragment>
        <form onSubmit={this.saveEntry}>
          <Prompt
            when={hasUnsavedChanges}
            message="You have unsaved changes. Leaving this page will discard these changes."
          />

          {model.fields.map((field, i) => {
            const Field = fields[field.type] || fields.text;
            return (
              <Field
                key={i}
                {...field}
                value={
                  changes.hasOwnProperty(field.property)
                    ? changes[field.property]
                    : entry && entry[field.property]
                }
                onChange={this.setProperty.bind(this, field.property)}
              />
            );
          })}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={!hasUnsavedChanges}
          >
            Save
          </button>
        </form>
        {this.props.deleteEntry
          ? <p className="text-sm-right mt-4">
              <button
                type="button"
                className="btn btn-link text-danger"
                onClick={this.deleteEntry}
              >
                Delete this {model.label}
              </button>
            </p>
          : null}
      </Fragment>
    );
  }

  render() {
    const { id, model } = this.props;
    return (
      <DocumentTitle title={id ? `Edit ${model.label}` : `New ${model.label}`}>
        {this.renderContent()}
      </DocumentTitle>
    );
  }
}

const mapFirebaseToProps = (props, ref, firebase) => ({
  entry: props.id
    ? `${props.firebaseRef}/${props.model.property}/${props.id}`
    : null,
  saveEntry: entry =>
    props.id
      ? ref(`${props.firebaseRef}/${props.model.property}/${props.id}`).set(
          entry
        )
      : ref(`${props.firebaseRef}/${props.model.property}`).push(entry),
  deleteEntry: props.id
    ? () =>
        ref(`${props.firebaseRef}/${props.model.property}/${props.id}`).remove()
    : null
});

export default connect(mapFirebaseToProps)(Edit);
