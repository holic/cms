import useFirebase from "./useFirebase";
import * as settings from "./models/settings";

const orderedValues = snapshot => {
  if (!snapshot || !snapshot.hasChildren()) return null;
  const values = [];
  snapshot.forEach(childSnapshot => {
    values.push(childSnapshot.val());
  });
  return values;
};

const useContentTypes = () => {
  const [contentTypes] = useFirebase(
    `config/${settings.contentType.property}`,
    {
      orderByChild: "label"
    }
  );

  return {
    contentTypes,
    loading: !contentTypes,
    ready: !!contentTypes,
    value: (orderedValues(contentTypes) || [])
      .map(model => ({
        ...model,
        fields: model.config ? JSON.parse(model.config) : []
      }))
      .filter(model => model.fields.length > 0)
  };
};

export default useContentTypes;
