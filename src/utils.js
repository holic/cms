export const map = (object, fn) =>
  object == null ? [] : Object.keys(object).map(key => fn(key, object[key]));
export const capitalize = str =>
  str.replace(/^\w/, match => match.toUpperCase());
