export const generateRelationRule = (
  previousRelationRule: string | null,
  newValue: string
) => {
  const newRelationConfig = {
    id: newValue,
    parentId: previousRelationRule,
  };

  return newRelationConfig;
};
