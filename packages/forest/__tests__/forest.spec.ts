import { createForest } from "../src/forest";
import { componentTreeDef, cssTreeDef, forestDef } from "./forestDefExample";
import fs from "fs";
import path from "path";

test("createForest fn returns a forest with trees", () => {
  const forest = createForest(forestDef);
  expect(forest).toBeDefined();
  expect(forest.tree).toBeDefined();

  const compTree = forest.tree(componentTreeDef.modulePath);
  expect(compTree).toBeDefined();
  const cssTree = forest.tree(cssTreeDef.modulePath);
  expect(cssTree).toBeDefined();
});

test("nodes get created on calling handleEvent", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(Object.keys(compTree!.nodes).length > 0).toBeTruthy();
});

test("delete event removes node and it's descendant", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(Object.keys(compTree!.nodes).length === 0).toBeTruthy();
});

test("create after delete event, DOES NOT restore all nodes", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
  expect(Object.keys(compTree!.nodes).length).toBe(1);
});

test("patch event updates state", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
        type: `PATCH$$${componentTreeDef.modulePath}`,
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

test("create after delete event, DOES not restore all old state", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
        type: `PATCH$$${componentTreeDef.modulePath}`,
        id: "comp1",
        slice: {
          alias: "comp1Alias",
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
  expect(compTree!.nodes["comp1"]?.state["alias"]).toBeUndefined();
});

test("hard patch replaces state", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
        type: `PATCH$$${componentTreeDef.modulePath}`,
        id: "comp1",
        slice: {
          alias: "comp1Alias",
        },
      },
      {
        type: `HARDPATCH$$${componentTreeDef.modulePath}`,
        id: "comp1",
        state: {
          styles: { height: "10px" },
        },
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(compTree!.nodes["comp1"]!.state).toHaveProperty("styles");
  expect(compTree!.nodes["comp1"]!.state).not.toHaveProperty("alias");
});

test("hard patch with selector replaces selected state", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
        type: `PATCH$$${componentTreeDef.modulePath}`,
        id: "comp1",
        slice: {
          alias: "comp1Alias",
        },
      },
      {
        type: `HARDPATCH$$${componentTreeDef.modulePath}`,
        id: "comp1",
        state: {
          styles: {
            height: "20px",
          },
        },
        selector: ["breakpoints", "991"],
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(compTree!.nodes["comp1"]!.state).not.toHaveProperty("styles");
  expect(compTree!.nodes["comp1"]!.state).toHaveProperty("alias");
  expect(compTree!.nodes["comp1"]!.state).toHaveProperty("breakpoints");
  expect(compTree!.nodes["comp1"]!.state["breakpoints"]).toHaveProperty("991");
  expect(compTree!.nodes["comp1"]!.state["breakpoints"]["991"]).toHaveProperty(
    "styles"
  );
  expect(
    compTree!.nodes["comp1"]!.state["breakpoints"]["991"]["styles"]
  ).toHaveProperty("height");
  expect(
    compTree!.nodes["comp1"]!.state["breakpoints"]["991"]["styles"]["height"]
  ).toBe("20px");
});

test("unset event", () => {
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
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
        type: `PATCH$$${componentTreeDef.modulePath}`,
        id: "comp1",
        slice: {
          alias: "comp1Alias",
        },
      },
      {
        type: `UNSET$$${componentTreeDef.modulePath}`,
        id: "comp1",
        selector: ["parent", "id"],
      },
    ],
    meta: { agent: "server-sent" },
  });
  expect(compTree?.nodes).toBeDefined();
  expect(compTree!.nodes["comp1"]!.state).toHaveProperty("parent");
  expect(compTree!.nodes["comp1"]!.state.parent).toHaveProperty("index");
  expect(compTree!.nodes["comp1"]!.state.parent).not.toHaveProperty("id");
});

test("patch event with canvas zone", () => {
  const events = JSON.parse(
    fs.readFileSync(path.join(__dirname, "events", "test_1.json")).toString()
  );
  const forest = createForest(forestDef);
  const compTree = forest.tree(componentTreeDef.modulePath);
  forest.handleEvents({ name: "", events, meta: { agent: "server-sent" } });
  expect(compTree?.nodes).toBeDefined();
  expect(
    compTree!.nodes["9d85fe5f-52ae-4b96-a133-0bd9298a8d36"]!.state
  ).toHaveProperty("parent");
  expect(
    compTree!.nodes["9d85fe5f-52ae-4b96-a133-0bd9298a8d36"]!.state.parent
  ).toHaveProperty("index");
  expect(
    compTree!.nodes["9d85fe5f-52ae-4b96-a133-0bd9298a8d36"]!.state.parent
  ).toHaveProperty("canvasZoneId");
  expect(
    compTree!.nodes["9d85fe5f-52ae-4b96-a133-0bd9298a8d36"]!.state.parent.id
  ).toBe("8e50f6d3-332d-4faa-85fe-d6eb17424147");
  expect(events).toBeDefined();
});
