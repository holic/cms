import React, { useState } from "react";
import { Prompt, Redirect } from "react-router-dom";
import * as fields from "../fields";
import { LoadingIcon } from "../icons";
import useDocumentTitle from "../useDocumentTitle";
import { database } from "../firebase";
import useFirebaseValue from "../useFirebaseValue";

const Edit = ({ id, model, firebaseRef, parentUrl }) => {
  useDocumentTitle(id ? `Edit ${model.label}` : `New ${model.label}`);

  const [state, setState] = useState({
    hasUnsavedChanges: false,
    changes: {},
    hasSaved: false
  });
  const setProperty = (property, value) =>
    setState({
      hasUnsavedChanges: true,
      changes: {
        ...state.changes,
        [property]: value
      }
    });

  const ref = id
    ? database.ref(`${firebaseRef}/${model.property}/${id}`)
    : database.ref(`${firebaseRef}/${model.property}`).push();

  const entrySnapshot = useFirebaseValue(ref, [id]);

  if (!entrySnapshot) {
    return (
      <p className="text-muted">
        <LoadingIcon />
      </p>
    );
  }

  const entry = entrySnapshot.val();

  const saveEntry = event => {
    event.preventDefault();
    ref.set({
      ...(entry || {}),
      ...state.changes
    });
    setState({ hasUnsavedChanges: false, changes: {}, hasSaved: true });
  };

  const deleteEntry = event => {
    event.preventDefault();
    // TODO: migrate to Prompt?
    if (window.confirm("This cannot be undone. Continue?")) {
      ref.remove();
      setState({ hasUnsavedChanges: false, changes: {}, hasSaved: true });
    }
  };

  return (
    <>
      <form onSubmit={saveEntry}>
        {state.hasSaved ? <Redirect to={parentUrl} /> : null}
        <Prompt
          when={state.hasUnsavedChanges}
          message="You have unsaved changes. Leaving this page will discard these changes."
        />

        {model.fields.map((field, i) => {
          const Field = fields[field.type] || fields.text;
          return (
            <Field
              key={i}
              {...field}
              value={
                state.changes.hasOwnProperty(field.property)
                  ? state.changes[field.property]
                  : entry && entry[field.property]
              }
              onChange={setProperty.bind(null, field.property)}
            />
          );
        })}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={!state.hasUnsavedChanges}
        >
          Save
        </button>
      </form>
      {id ? (
        <p className="text-sm-right mt-4">
          <button
            type="button"
            className="btn btn-link text-danger"
            onClick={deleteEntry}
          >
            Delete this {model.label}
          </button>
        </p>
      ) : null}
    </>
  );
};

export default React.memo(Edit);
