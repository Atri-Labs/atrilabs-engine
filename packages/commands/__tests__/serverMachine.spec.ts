import { interpret } from "xstate";
import {
  APP_SERVER_DONE,
  createServerMachine,
  FULLFILL_EXISTING_REQUESTS,
  LIB_SERVER_DONE,
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
      expect(state.value).toBe(serving);
    }
    if (event.type === "done.invoke.handleRequests") {
      expect(state.value).toBe(serving);
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
  interpreter.send({ type: ROUTE_OBJECTS_UPDATED });
  interpreter.send({ type: FULLFILL_EXISTING_REQUESTS });
});
