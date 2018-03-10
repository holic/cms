import React, { Component } from "react";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import pluralize from "pluralize";
import { database } from "../firebase";
import { map, capitalize } from "../utils";
import * as models from "../models";
import { PencilIcon, LoadingIcon } from "../icons";

const modelsByProperty = {};

map(models, (key, model) => {
  modelsByProperty[model.property] = model;
});

export default class List extends Component {
  getModelConfig(params) {
    return modelsByProperty[params.model];
  }
  getModelRef(ref) {
    return database.ref(`data/${ref}`);
  }
  getModelPath(property) {
    return `/content/${property}`;
  }

  componentWillMount() {
    const model = this.getModelConfig(this.props.params);
    this.loadEntries(model);
  }

  componentWillReceiveProps(nextProps) {
    const nextModel = this.getModelConfig(nextProps.params);
    if (nextModel !== this.getModelConfig(this.props.params)) {
      this.loadEntries(nextModel);
    }
  }

  loadEntries(model) {
    const ref = this.getModelRef(model.property);

    this.setState({
      model: model,
      listedFields: model.fields.filter(field => field.listed),
      ref: ref,
      isLoading: true,
      entries: null
    });

    ref.off("value");
    ref.once("value", snapshot => {
      this.setState({
        isLoading: false,
        entries: snapshot.val()
      });
    });
  }

  componentWillUnmount() {
    const { ref } = this.state;
    if (ref) ref.off("value");
  }

  render() {
    return (
      <DocumentTitle title={capitalize(pluralize(this.state.model.label))}>
        <div>
          <p className="text-sm-right">
            <Link
              to={`${this.getModelPath(this.state.model.property)}/new`}
              className="btn btn-outline-secondary"
            >
              New {this.state.model.label}
            </Link>
          </p>
          <table className="table table-hover">
            <thead>
              <tr>
                {this.state.listedFields.map((field, i) => (
                  <th key={i}>{capitalize(field.label)}</th>
                ))}
                <th width="1" />
              </tr>
            </thead>

            {this.state.isLoading
              ? <tfoot>
                  <tr>
                    <td
                      colSpan={this.state.listedFields.length + 1}
                      className="text-muted"
                    >
                      <LoadingIcon />
                    </td>
                  </tr>
                </tfoot>
              : null}

            {!this.state.isLoading
              ? <tbody>
                  {map(this.state.entries, (id, entry) => (
                    <tr key={id}>
                      {this.state.listedFields.map((field, i) => (
                        <td key={i}>{entry[field.property]}</td>
                      ))}
                      <td>
                        <Link
                          to={
                            `${this.getModelPath(this.state.model.property)}/${id}`
                          }
                        >
                          <PencilIcon />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              : null}
          </table>
        </div>
      </DocumentTitle>
    );
  }
}
