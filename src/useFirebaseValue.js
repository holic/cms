import { useState, useEffect } from "react";

const useFirebaseValue = query => {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (!query) return;
    query.on("value", snapshot => setSnapshot(snapshot));
    return () => query.off();
  }, query ? [query.toString()] : []);

  return snapshot;
};

export default useFirebaseValue;
