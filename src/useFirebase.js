import { useState, useEffect } from "react";
import { database } from "./firebase";

const useFirebase = (path, options = {}) => {
  const [snapshot, setSnapshot] = useState(null);

  const ref = database.ref(path);
  const setValue = value => ref.set(value);

  useEffect(
    () => {
      let query = ref;
      if (options.orderByChild) {
        query = query.orderByChild(options.orderByChild);
      }
      query.on("value", snapshot => setSnapshot(snapshot));
      return () => query.off();
    },
    [path]
  );

  return [snapshot, setValue];
};

export default useFirebase;
