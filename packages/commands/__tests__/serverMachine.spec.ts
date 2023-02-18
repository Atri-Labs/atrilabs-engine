import { interpret } from "xstate";
import {
  APP_SERVER_DONE,
  APP_SERVER_INVALIDATED,
  createServerMachine,
  handlingRequests,
  LIB_SERVER_DONE,
  MANIFEST_OBJECTS_UPDATED,
  NETWORK_REQUEST,
  processing,
  ROUTE_OBJECTS_UPDATED,
  serving,
} from "../src/scripts/dev/serverMachine";

test("server machine goes to serving on all dev servers done", (done) => {
  const machine = createServerMachine("test_1");
  const interpreter = interpret(machine);

  interpreter.onTransition((state, event) => {
    if (event.type === LIB_SERVER_DONE) {
      expect(state.value).toBe(processing);
    }
    if (event.type === APP_SERVER_DONE) {
      expect(state.value).toBe(processing);
    }
    if (event.type === ROUTE_OBJECTS_UPDATED) {
      expect(state.value).toBe(serving);
      interpreter.stop();
    }
  });

  interpreter.onStop(() => {
    done();
  });

  interpreter.start();
  interpreter.send({ type: LIB_SERVER_DONE });
  interpreter.send({ type: APP_SERVER_DONE });
  interpreter.send({ type: MANIFEST_OBJECTS_UPDATED, manifests: [] });
  interpreter.send({ type: ROUTE_OBJECTS_UPDATED });
});

test("machine goes from processing to handlingRequests if requests.length > 0", (done) => {
  const machine = createServerMachine("test_2").withConfig({
    services: {
      handleRequests: () => {
        return new Promise<void>((resolve) => {
          resolve();
        });
      },
    },
  });

  const interpreter = interpret(machine);

  interpreter.onTransition((state, event) => {
    if (event.type === LIB_SERVER_DONE) {
      expect(state.value).toBe(processing);
    }
    if (event.type === APP_SERVER_DONE) {
      expect(state.value).toBe(processing);
    }
    if (event.type === ROUTE_OBJECTS_UPDATED) {
      expect(state.value).toBe(handlingRequests);
    }
    if (event.type === "done.invoke.handleRequests") {
      interpreter.stop();
    }
  });

  interpreter.onStop(() => {
    done();
  });

  interpreter.start();
  interpreter.send({ type: NETWORK_REQUEST });
  interpreter.send({ type: LIB_SERVER_DONE });
  interpreter.send({ type: APP_SERVER_DONE });
  interpreter.send({ type: MANIFEST_OBJECTS_UPDATED, manifests: [] });
  interpreter.send({ type: ROUTE_OBJECTS_UPDATED });
});

test("requests from reservoir are swapped", (done) => {
  const machine = createServerMachine("test_3").withConfig({
    services: {
      handleRequests: () => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 50);
        });
      },
    },
  });

  const interpreter = interpret(machine);

  interpreter.onTransition((state, event) => {
    if (event.type === LIB_SERVER_DONE) {
      expect(state.value).toBe(processing);
    }
    if (event.type === APP_SERVER_DONE) {
      expect(state.value).toBe(processing);
    }
    if (event.type === ROUTE_OBJECTS_UPDATED) {
      expect(state.value).toBe(handlingRequests);
    }
    if (event.type === "done.invoke.handleRequests") {
      expect(state.value).toBe(handlingRequests);
      expect(state.context.requests).toMatchObject(["expect_this_input"]);
      interpreter.stop();
    }
  });

  interpreter.onStop(() => {
    done();
  });

  interpreter.start();
  interpreter.send({ type: NETWORK_REQUEST, input: "initial_input" });
  interpreter.send({ type: LIB_SERVER_DONE });
  interpreter.send({ type: APP_SERVER_DONE });
  interpreter.send({ type: MANIFEST_OBJECTS_UPDATED, manifests: [] });
  interpreter.send({ type: ROUTE_OBJECTS_UPDATED });
  setTimeout(() => {
    interpreter.send({ type: NETWORK_REQUEST, input: "expect_this_input" });
  }, 10);
});

test("invalidate leads to processing from hanldingRequests", (done) => {
  const machine = createServerMachine("test_4").withConfig({
    services: {
      handleRequests: () => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 50);
        });
      },
    },
  });

  const interpreter = interpret(machine);
  let firstAppDoneCalled = false;

  interpreter.onTransition((state, event) => {
    if (event.type === LIB_SERVER_DONE) {
      expect(state.value).toBe(processing);
    }
    if (event.type === APP_SERVER_DONE) {
      if (firstAppDoneCalled) {
        expect(state.value).toBe(handlingRequests);
        interpreter.stop();
      }
    }
    if (event.type === APP_SERVER_DONE) {
      if (!firstAppDoneCalled) {
        firstAppDoneCalled = true;
        expect(state.value).toBe(processing);
      }
    }
    if (event.type === ROUTE_OBJECTS_UPDATED) {
      expect(state.value).toBe(handlingRequests);
    }
    if (event.type === "done.invoke.handleRequests") {
      expect(state.value).toBe(processing);
      expect(state.context.requests).toMatchObject(["expect_this_input"]);
    }
  });

  interpreter.onStop(() => {
    done();
  });

  interpreter.start();
  interpreter.send({ type: NETWORK_REQUEST, input: "initial_input" });
  interpreter.send({ type: LIB_SERVER_DONE });
  interpreter.send({ type: APP_SERVER_DONE });
  interpreter.send({ type: MANIFEST_OBJECTS_UPDATED, manifests: [] });
  interpreter.send({ type: ROUTE_OBJECTS_UPDATED });
  setTimeout(() => {
    interpreter.send({ type: APP_SERVER_INVALIDATED });
    interpreter.send({ type: NETWORK_REQUEST, input: "expect_this_input" });
  }, 10);
  setTimeout(() => {
    interpreter.send({ type: APP_SERVER_DONE });
  }, 80);
});
