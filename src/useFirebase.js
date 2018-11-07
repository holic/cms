import { useState, useEffect } from "react";
import { database } from "./firebase";

const useFirebase = path => {
  const [snapshot, setSnapshot] = useState(null);

  const ref = database.ref(path);
  const setValue = value => ref.set(value);

  useEffect(
    () => {
      ref.on("value", snapshot => setSnapshot(snapshot));
      return () => ref.off();
    },
    [path]
  );

  return [snapshot, setValue];
};

export default useFirebase;
