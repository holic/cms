import { useState, useEffect } from "react";

const useFirebaseValue = (query, dependencies = []) => {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (!query) return;
    query.on("value", snapshot => setSnapshot(snapshot));
    return () => query.off();
  }, dependencies);

  return snapshot;
};

export default useFirebaseValue;
