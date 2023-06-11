export const createEntitiesMap = <T extends { id: string }>(
  entities: T[],
  keySelector = (entity: T) => entity.id,
  valueSelector = (entity: T) => entity
) =>
  entities?.reduce((map: { [key: string]: T }, entity: T) => {
    map[keySelector(entity)] = valueSelector(entity);
    return map;
  }, {}) ?? {};
