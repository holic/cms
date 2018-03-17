import React from "react";
import { map } from "../utils";
import Edit from "./Edit";
import * as settings from "../models/settings";

const settingsByProperty = {};
map(settings, (key, setting) => {
  settingsByProperty[setting.property] = setting;
});

export default function EditSetting({ params }) {
  const model = settingsByProperty[params.setting];
  return (
    <Edit
      model={model}
      id={params.id === "new" ? null : params.id}
      firebaseRef={`config/${model.property}`}
      url={`/settings/${model.property}`}
    />
  );
}
