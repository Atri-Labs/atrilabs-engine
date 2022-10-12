import { AnyEvent, CreateEvent } from "../src/types";
import { compressEvents } from "../src/compression";
import { componentTreeDef, cssTreeDef, forestDef } from "./forestDefExample";

test("patches are merged", () => {
  const events: AnyEvent[] = [
    {
      type: `CREATE$$${componentTreeDef.modulePath}`,
      meta: {},
      id: "comp1",
      state: { parent: { id: "body", index: 0 } },
    },
    {
      type: `PATCH$$${componentTreeDef.modulePath}`,
      id: "comp1",
      slice: { alias: "alias1" },
    },
    {
      type: `PATCH$$${componentTreeDef.modulePath}`,
      id: "comp1",
      slice: { alias: "alias2" },
    },
  ];
  const compressedEvents = compressEvents(events, forestDef);
  expect(compressedEvents.length).toBe(1);
  expect(compressedEvents[0]).toHaveProperty("state");
  expect((compressedEvents[0]! as CreateEvent)["state"]).toHaveProperty(
    "alias"
  );
  expect((compressedEvents[0]! as CreateEvent)["state"]["alias"]).toBe(
    "alias2"
  );
});

test("create & delete results in no event", () => {
  const events: AnyEvent[] = [
    {
      type: `CREATE$$${componentTreeDef.modulePath}`,
      meta: {},
      id: "comp1",
      state: { parent: { id: "body", index: 0 } },
    },
    {
      type: `DELETE$$${componentTreeDef.modulePath}`,
      id: "comp1",
    },
  ];
  const compressedEvents = compressEvents(events, forestDef);
  expect(compressedEvents.length).toBe(0);
});

test("deleting root tree node, results in no event for linked tree", () => {
  const events: AnyEvent[] = [
    {
      type: `CREATE$$${componentTreeDef.modulePath}`,
      meta: {},
      id: "comp1",
      state: { parent: { id: "body", index: 0 } },
    },
    {
      type: `LINK$$${cssTreeDef.modulePath}`,
      meta: {},
      id: "css1",
      state: { parent: { id: "", index: 0 } },
    },
    {
      type: `DELETE$$${componentTreeDef.modulePath}`,
      id: "comp1",
    },
  ];
  const compressedEvents = compressEvents(events, forestDef);
  expect(compressedEvents.length).toBe(0);
});

test("css tree is linked with comp tree", () => {
  const events: AnyEvent[] = [
    {
      type: `CREATE$$${componentTreeDef.modulePath}`,
      meta: {},
      id: "comp1",
      state: { parent: { id: "body", index: 0 } },
    },
    {
      type: `PATCH$$${componentTreeDef.modulePath}`,
      id: "comp1",
      slice: { alias: "alias1" },
    },
    {
      type: `PATCH$$${componentTreeDef.modulePath}`,
      id: "comp1",
      slice: { alias: "alias2" },
    },
    {
      type: `CREATE$$${cssTreeDef.modulePath}`,
      meta: {},
      id: "css1",
      state: {
        parent: { id: "", index: 0 },
        property: { styles: { height: "10px" } },
      },
    },
    {
      type: `LINK$$${cssTreeDef.modulePath}`,
      childId: "css1",
      refId: "comp1",
    },
  ];
  const compressedEvents = compressEvents(events, forestDef);
  expect(compressedEvents.length).toBe(3);
  expect(compressedEvents[0]!).toHaveProperty("state");
  expect((compressedEvents[0]! as CreateEvent)["state"]).toBeDefined();
  expect(
    (compressedEvents[0]! as CreateEvent)["state"]["property"]["styles"][
      "height"
    ]
  ).toBe("10px");
});
