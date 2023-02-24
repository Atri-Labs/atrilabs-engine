/**
 * Walks and changes value in place.
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

  function assignValue() {
    switch (typeof key) {
      case "string":
        assignValueToObjectField(key);
        break;
      case "number":
        assignValueToArrayIndex(key);
        break;
    }
  }

  // walk recursively until you have reached the last selector
  if (shouldWalkRecursively()) {
    walk();
  } else {
    assignValue();
  }

  return referenceObj;
}

/**
 * The referenceObj can be an object or undefined.
 * If a sub-path doesn't exist in the refernceObj, then, it will be created.
 * New elements to an array can be added at the end of array only.
 *
 * How to use?
 *
 * 1. If you want to mutate one item in the array?
 *
 * `createObj(referenceObj, ["path", "to", "array", 2], "somevalue");`
 *
 * 2. If you want to mutate entire array or more than one index?
 *
 * `createObj(referenceObj, ["path", "to", "array"], ["some", "new", "array"])`
 *
 * Currently, you can't mutate more than one element in an array at once.
 * @param referenceObj  reference object to copy existing values
 * @param selector describes path to traverse
 * @param value new value to assign at the end of path
 * @returns
 */
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
