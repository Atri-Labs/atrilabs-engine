import { createForest } from "../src/forest";
import { componentTreeDef, forestDef } from "./forestDefExample";

test("createForest fn returns a forest with trees", () => {
  const forest = createForest(forestDef);
  expect(forest).toBeDefined();
  expect(forest.tree).toBeDefined();

  const compTree = forest.tree(componentTreeDef.modulePath);
  expect(compTree).toBeDefined();
  const cssTree = forest.tree("cssTreeModule");
  expect(cssTree).toBeDefined();
});

test("nodes get created on calling handleEvent", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
  forest.handleEvents({
    name: "TEST_EVENTS",
    events: [
      {
        type: `CREATE$$componentTreeModule`,
        id: "comp1",
        meta: {},
        state: {
          parent: { id: "body", index: 0 },
        },
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(Object.keys(compTree!.nodes).length > 0).toBeTruthy();
});

test("delete event removes node and it's descendant", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree("componentTreeModule");
  forest.handleEvents({
    name: "TEST_EVENTS",
    events: [
      {
        type: `CREATE$$componentTreeModule`,
        id: "comp1",
        meta: {},
        state: {
          parent: { id: "body", index: 0 },
        },
      },
      {
        type: `CREATE$$componentTreeModule`,
        id: "comp2",
        meta: {},
        state: {
          parent: { id: "comp1", index: 0 },
        },
      },
      {
        type: `DELETE$$componentTreeModule`,
        id: "comp1",
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(Object.keys(compTree!.nodes).length === 0).toBeTruthy();
});

test("create after delete event, restores all nodes", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree("componentTreeModule");
  forest.handleEvents({
    name: "TEST_EVENTS",
    events: [
      {
        type: `CREATE$$${componentTreeDef.modulePath}`,
        id: "comp1",
        meta: {},
        state: {
          parent: { id: "body", index: 0 },
        },
      },
      {
        type: `CREATE$$${componentTreeDef.modulePath}`,
        id: "comp2",
        meta: {},
        state: {
          parent: { id: "comp1", index: 0 },
        },
      },
      {
        type: `DELETE$$${componentTreeDef.modulePath}`,
        id: "comp1",
      },
      {
        type: `CREATE$$${componentTreeDef.modulePath}`,
        id: "comp1",
        meta: {},
        state: {
          parent: { id: "body", index: 0 },
        },
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(Object.keys(compTree!.nodes).length).toBe(2);
});

test("patch event updates state", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree("componentTreeModule");
  forest.handleEvents({
    name: "TEST_EVENTS",
    events: [
      {
        type: `CREATE$$componentTreeModule`,
        id: "comp1",
        meta: {},
        state: {
          parent: { id: "body", index: 0 },
        },
      },
      {
        type: `PATCH$$componentTreeModule`,
        id: "comp1",
        slice: {
          alias: "comp1Alias",
        },
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(compTree!.nodes["comp1"]?.state["alias"]).toBe("comp1Alias");
});

test("create after delete event, restores all old state", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree("componentTreeModule");
  forest.handleEvents({
    name: "TEST_EVENTS",
    events: [
      {
        type: `CREATE$$componentTreeModule`,
        id: "comp1",
        meta: {},
        state: {
          parent: { id: "body", index: 0 },
        },
      },
      {
        type: `PATCH$$componentTreeModule`,
        id: "comp1",
        slice: {
          alias: "comp1Alias",
        },
      },
      {
        type: `DELETE$$componentTreeModule`,
        id: "comp1",
      },
      {
        type: `CREATE$$componentTreeModule`,
        id: "comp1",
        meta: {},
        state: {
          parent: { id: "body", index: 0 },
        },
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(compTree!.nodes["comp1"]?.state["alias"]).toBe("comp1Alias");
});
