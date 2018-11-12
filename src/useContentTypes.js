import * as settings from "./models/settings";
import orderedChildren from "./orderedChildren";
import { database } from "./firebase";
import useFirebaseValue from "./useFirebaseValue";

const useContentTypes = () => {
  const contentTypes = useFirebaseValue(
    database
      .ref(`config/${settings.contentType.property}`)
      .orderByChild("label")
  );

  return {
    contentTypes,
    loading: !contentTypes,
    ready: !!contentTypes,
    value: Object.values(orderedChildren(contentTypes) || {})
      .map(model => ({
        ...model,
        fields: model.config ? JSON.parse(model.config) : []
      }))
      .filter(model => model.fields.length > 0)
  };
};

export default useContentTypes;
