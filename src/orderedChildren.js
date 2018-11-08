const orderedChildren = snapshot => {
  if (!snapshot || !snapshot.hasChildren()) return null;
  const values = {};
  snapshot.forEach(childSnapshot => {
    values[childSnapshot.key] = childSnapshot.val();
  });
  return values;
};

export default orderedChildren;
