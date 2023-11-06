export const generateRelationRule = (previousRelationRule: string) => {
  const prevNestingLevel = Number(previousRelationRule.split(".")[0]);
  const prevRelationVariant = Number(previousRelationRule.split(".")[1]);

  const newNestingLevel = prevNestingLevel + 1;

  const newRelationConfig = {
    id: `${newNestingLevel}.${prevRelationVariant}`,
    parentId: previousRelationRule,
  };

  return newRelationConfig;
};
