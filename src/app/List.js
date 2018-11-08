import React from "react";
import { Link } from "react-router-dom";
import pluralize from "pluralize";
import { map, capitalize } from "../utils";
import { PencilIcon, LoadingIcon } from "../icons";
import useDocumentTitle from "../useDocumentTitle";
import useFirebase from "../useFirebase";

const List = ({ model, url, firebaseRef }) => {
  useDocumentTitle(capitalize(pluralize(model.label)));
  const listedFields = model.fields.filter(field => field.listed);
  const [entries] = useFirebase(`${firebaseRef}/${model.property}`);

  return (
    <React.Fragment>
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

        {!entries ? (
          <tfoot>
            <tr>
              <td colSpan={listedFields.length + 1} className="text-muted">
                <LoadingIcon />
              </td>
            </tr>
          </tfoot>
        ) : null}

        {entries && !entries.val() ? (
          <tfoot>
            <tr>
              <td colSpan={listedFields.length + 1} className="text-muted">
                <em>
                  You haven't created any {pluralize(model.label)} yet.{" "}
                  <Link to={url()}>Create your first {model.label}?</Link>
                </em>
              </td>
            </tr>
          </tfoot>
        ) : null}

        {entries && entries.val() ? (
          <tbody>
            {map(entries.val(), (id, entry) => (
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
        ) : null}
      </table>
    </React.Fragment>
  );
};

export default React.memo(List);
