import { createObject } from "./createObject";

test("function is a pure function", () => {
  const referenceObject = {
    a: {
      b: {
        c: [{ x: "Old World" }],
      },
    },
  };
  const newObject = createObject(
    referenceObject,
    ["a", "b", "c", 0, "y"],
    "New World"
  );
  expect(referenceObject).not.toMatchObject(newObject);
});

test("creates a nested object", () => {
  const referenceObject = {
    a: {
      b: {
        c: { x: "Old World" },
      },
    },
  };
  const newObject = createObject(
    referenceObject,
    ["a", "b", "c", "x"],
    "New World"
  );
  expect({
    a: {
      b: {
        c: { x: "New World" },
      },
    },
  }).toMatchObject(newObject);
});

test("creates a nested object with array only if array exists in reference object", () => {
  const referenceObject = {
    a: {
      b: {
        c: [{ x: "Old World" }],
      },
    },
  };
  const newObject = createObject(
    referenceObject,
    ["a", "b", "c", 0, "y"],
    "New World"
  );
  expect({
    a: {
      b: {
        c: [{ x: "Old World", y: "New World" }],
      },
    },
  }).toMatchObject(newObject);
});

test("does not create a nested object with array when array does not exist in reference object", () => {
  const referenceObject = {
    a: {
      b: {},
    },
  };
  const newObject = createObject(
    referenceObject,
    ["a", "b", "c", 0, "y"],
    "New World"
  );
  const expectArray = newObject["a"]["b"]["c"];
  expect(expectArray).not.toBe([{ y: "New World" }]);
});
