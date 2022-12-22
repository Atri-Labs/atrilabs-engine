import { createObject } from "../src/createObject";

// test("function is a pure function", () => {
//   const referenceObject = {
//     a: {
//       b: {
//         c: [{ x: "Old World" }],
//       },
//     },
//   };
//   const newObject = createObject(
//     referenceObject,
//     ["a", "b", "c", 0, "y"],
//     "New World"
//   );
//   expect(referenceObject).not.toMatchObject(newObject);
// });

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

test("create a nested object with array when array does not exist in reference object", () => {
  const newObject = createObject({}, ["a", "b", "c", 0, "y"], "New World");
  const expectArray = newObject["a"]["b"]["c"];
  expect(JSON.stringify(expectArray)).toBe(
    JSON.stringify([{ y: "New World" }])
  );
});

test("create a nested object with array when reference object is undefined", () => {
  const newObject = createObject(
    undefined,
    ["a", "b", "c", 0, "y"],
    "New World"
  );
  const expectArray = newObject["a"]["b"]["c"];
  expect(JSON.stringify(expectArray)).toBe(
    JSON.stringify([{ y: "New World" }])
  );
});
