import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";
import pluralize from "pluralize";
import { map, capitalize } from "../utils";
import { PencilIcon, LoadingIcon } from "../icons";
import { connect } from "react-firebase";

function List({ model, url, entries }) {
  const listedFields = model.fields.filter(field => field.listed);
  const isLoading = entries == null;

  return (
    <DocumentTitle title={capitalize(pluralize(model.label))}>
      <Fragment>
        <p className="text-sm-right">
          <Link to={url()} className="btn btn-outline-secondary">
            New {model.label}
          </Link>
        </p>
        <table className="table table-hover">
          <thead>
            <tr>
              {listedFields.map((field, i) => (
                <th key={i}>{capitalize(field.label)}</th>
              ))}
              <th width="1" />
            </tr>
          </thead>

          {isLoading
            ? <tfoot>
                <tr>
                  <td colSpan={listedFields.length + 1} className="text-muted">
                    <LoadingIcon />
                  </td>
                </tr>
              </tfoot>
            : null}

          {!isLoading
            ? <tbody>
                {map(entries, (id, entry) => (
                  <tr key={id}>
                    {listedFields.map((field, i) => (
                      <td key={i}>{entry[field.property]}</td>
                    ))}
                    <td>
                      <Link to={url(id)}>
                        <PencilIcon />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            : null}
        </table>
      </Fragment>
    </DocumentTitle>
  );
}

const mapFirebaseToProps = (props, ref, firebase) => ({
  entries: `${props.firebaseRef}/${props.model.property}`
});

export default connect(mapFirebaseToProps)(List);
