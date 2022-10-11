import { AnyEvent, CreateEvent } from "../src/types";
import { compressEvents } from "../src/compression";

test("patches are merged", () => {
  const events: AnyEvent[] = [
    {
      type: "CREATE$$CompTreeId",
      meta: {},
      id: "comp1",
      state: { parent: { id: "body", index: 0 } },
    },
    {
      type: "PATCH$$CompTreeId",
      id: "comp1",
      slice: { alias: "alias1" },
    },
    {
      type: "PATCH$$CompTreeId",
      id: "comp1",
      slice: { alias: "alias2" },
    },
  ];
  const compressedEvents = compressEvents(events);
  expect(compressedEvents.length).toBe(2);
});

test("create & delete results in no event", () => {
  const events: AnyEvent[] = [
    {
      type: "CREATE$$CompTreeId",
      meta: {},
      id: "comp1",
      state: { parent: { id: "body", index: 0 } },
    },
    {
      type: "DELETE$$CompTreeId",
      id: "comp1",
    },
  ];
  const compressedEvents = compressEvents(events);
  expect(compressedEvents.length).toBe(0);
});

test("re-create removes delete event from compressed event", () => {
  const events: AnyEvent[] = [
    {
      type: "CREATE$$CompTreeId",
      meta: {},
      id: "comp1",
      state: { parent: { id: "body", index: 0 } },
    },
    {
      type: "PATCH$$CompTreeId",
      id: "comp1",
      slice: { alias: "alias1" },
    },
    {
      type: "DELETE$$CompTreeId",
      id: "comp1",
    },
    {
      type: "CREATE$$CompTreeId",
      id: "comp1",
      meta: {},
      state: { parent: { id: "body", index: 0 } },
    },
  ];
  const compressedEvents = compressEvents(events);
  expect(compressedEvents.length).toBe(1);
  expect(compressedEvents[0]).toHaveProperty("state");
  expect((compressedEvents[0] as CreateEvent)["state"]).toHaveProperty(
    "parent"
  );
  expect((compressedEvents[0] as CreateEvent)["state"]).toHaveProperty("alias");
});
