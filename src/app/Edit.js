import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { connect } from "react-firebase";
import DocumentTitle from "react-document-title";
import * as fields from "../fields";
import { LoadingIcon } from "../icons";

class Edit extends Component {
  state = {
    hasUnsavedChanges: false,
    changes: {}
  };

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.routes.slice(-1)[0], () => {
      if (this.state.hasUnsavedChanges) {
        return "You have unsaved changes.\nLeaving this page will discard these changes.";
      }
    });
  }

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

    this.setState(
      {
        hasUnsavedChanges: false
      },
      () => {
        this.props.router.push(this.props.url);
      }
    );
  };

  deleteEntry = event => {
    if (!this.props.deleteEntry) return;

    if (window.confirm("This cannot be undone. Continue?")) {
      this.props.deleteEntry();

      this.setState(
        {
          hasUnsavedChanges: false
        },
        () => {
          this.props.router.push(this.props.url);
        }
      );
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
                className="btn btn-link text-muted"
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
  entry: props.id ? `${props.firebaseRef}/${props.id}` : null,
  saveEntry: entry =>
    props.id
      ? ref(`${props.firebaseRef}/${props.id}`).set(entry)
      : ref(props.firebaseRef).push(entry),
  deleteEntry: props.id
    ? () => ref(`${props.firebaseRef}/${props.id}`).remove()
    : null
});

export default withRouter(connect(mapFirebaseToProps)(Edit));
