export const createObject = (
  referenceObject: any = {},
  [prop, ...rest]: (string | number)[],
  value: string | number | boolean | boolean[] | string[]
) => {
  const newObject: any = Array.isArray(referenceObject)
    ? [...referenceObject]
    : { ...referenceObject };
  if (rest.length > 0 && typeof rest[0] === "number") newObject[prop] = [];
  newObject[prop] = rest.length
    ? createObject(referenceObject[prop], rest, value)
    : value;
  return newObject;
};
