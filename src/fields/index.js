import { default as text } from "./Text";
import { default as markdown } from "./Markdown";
import { default as ref } from "./Reference";
import { default as image } from "./Image";
import { default as group } from "./Group";
import { default as code } from "./Code";
import { default as options } from "./Options";
import { default as json } from "./Json";
import { default as contentFieldSettings } from "./ContentFieldSettings";

export {
  text,
  markdown,
  ref,
  image,
  group,
  code,
  options,
  json,
  contentFieldSettings
};

export default Object.keys({
  text,
  markdown,
  ref,
  image,
  group,
  code,
  options,
  json,
  contentFieldSettings
});
