import React from "react";
import { map } from "../utils";
import Edit from "./Edit";
import * as models from "../models";

const modelsByProperty = {};
map(models, (key, model) => {
  modelsByProperty[model.property] = model;
});

export default function EditEntry({ params }) {
  const model = modelsByProperty[params.model];
  return (
    <Edit
      model={model}
      id={params.id === "new" ? null : params.id}
      firebaseRef={`data/${model.property}`}
      url={`/content/${model.property}`}
    />
  );
}
