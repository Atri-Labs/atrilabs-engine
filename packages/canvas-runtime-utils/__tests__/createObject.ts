export function createObject(
  referenceObject: any,
  keys: (string | number)[],
  value: string | number
) {
  if (referenceObject === null) return referenceObject;
  if (keys.length === 0) {
    return value;
  }
  if (keys.length === 1) {
    referenceObject[keys[0]] = value;
  } else {
    const [key, ...remainingKeys] = keys;
    const nextKey = remainingKeys[0];
    const nextRemainingKeys = remainingKeys.slice(1);

    if (
      typeof referenceObject[key] === "string" ||
      typeof referenceObject[key] === "number"
    ) {
      return referenceObject;
    }

    if (typeof nextKey === "number") {
      if (referenceObject[key] === undefined || referenceObject[key] === null) {
        // create array
        referenceObject[key] = [];
      }

      // Fill empty index with empty object
      if (referenceObject[key].length < nextKey + 1) {
        const delta = nextKey + 1 - referenceObject[key].length;
        for (let i = 0; i < delta; i++) {
          referenceObject[key].push({});
        }
      }

      // recursively write the object
      referenceObject[key][nextKey] = createObject(
        referenceObject[key][nextKey],
        nextRemainingKeys,
        value
      );
    } else {
      // recursively write the object
      referenceObject[key] = createObject(
        typeof referenceObject[key] === "undefined" ? {} : referenceObject[key],
        remainingKeys,
        value
      );
    }
  }

  return referenceObject;
}
