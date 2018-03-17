import React from "react";
import List from "./List";
import { map } from "../utils";
import * as models from "../models";

const modelsByProperty = {};
map(models, (key, model) => {
  modelsByProperty[model.property] = model;
});

export default function ListEntries({ params }) {
  const model = modelsByProperty[params.model];
  return (
    <List
      model={model}
      firebaseRef={`data/${model.property}`}
      url={`/content/${model.property}`}
    />
  );
}
