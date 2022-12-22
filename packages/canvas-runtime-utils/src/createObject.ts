/**
 * Walks
 * @param referenceObj object that is referenced and mutateted
 * @param selector path to traverse
 * @param value value to assign
 */
function _createObject(
  referenceObj: any,
  selector: (string | number)[],
  value: string | number | boolean | string[] | number[] | boolean[] | object
) {
  if (referenceObj === null) {
    throw new Error("Cannot patch a null object");
  }

  if (selector.length === 0) {
    throw new Error("Selector array cannot be empty");
  }

  const [key, ...remainingKeys] = selector;

  if (typeof key !== "string" && typeof key !== "number") {
    throw new Error("Invalid selector: element is not a string or a number");
  }

  function shouldCreateNewPath() {
    return referenceObj === undefined;
  }

  function assignNewObject() {
    referenceObj = {};
  }

  function assignNewAndEmptyArray() {
    referenceObj = [];
  }

  if (shouldCreateNewPath()) {
    switch (typeof key) {
      case "string":
        assignNewObject();
        break;
      case "number":
        assignNewAndEmptyArray();
    }
  }

  function shouldWalkRecursively() {
    return selector.length > 1;
  }

  function walk() {
    referenceObj[key] = _createObject(referenceObj[key], remainingKeys, value);
  }

  function assignValueToObjectField(key: string) {
    if (typeof referenceObj !== "object") {
      throw new Error("Cannot access property of non-object or string");
    }

    referenceObj[key] = value;
  }

  function assignValueToArrayIndex(key: number) {
    if (!Array.isArray(referenceObj)) {
      throw new Error("Cannot access element of non-array");
    }
    if (key > referenceObj.length) {
      throw new Error("Array index out of bounds");
    }
    referenceObj[key] = value;
  }

  // walk recursively until you have reached the last selector
  if (shouldWalkRecursively()) {
    walk();
  } else {
    switch (typeof key) {
      case "string":
        assignValueToObjectField(key);
        break;
      case "number":
        assignValueToArrayIndex(key);
        break;
    }
  }

  return referenceObj;
}

export function createObject(
  referenceObj: any,
  selector: (string | number)[],
  value: string | number | boolean | string[] | number[] | boolean[] | object
) {
  const newObj =
    referenceObj !== undefined ? JSON.parse(JSON.stringify(referenceObj)) : {};

  _createObject(newObj, selector, value);

  return newObj;
}
