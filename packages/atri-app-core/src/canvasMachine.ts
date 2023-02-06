import { createMachine, interpret } from "xstate";

// events
const IFRAME_DETECTED = "IFRAME_DETECTED" as const;
const TOP_WINDOW_DETECTED = "TOP_WINDOW_DETECTED" as const;
const WINDOW_LOADED = "WINDOW_LOADED" as const;

type IFRAME_DETECTED_EVENT = { type: typeof IFRAME_DETECTED };
type TOP_WINDOW_DETECTED_EVENT = { type: typeof TOP_WINDOW_DETECTED };
type WINDOW_LOADED_EVENT = { type: typeof WINDOW_LOADED };

type CanvasMachineEvent =
  | IFRAME_DETECTED_EVENT
  | WINDOW_LOADED_EVENT
  | TOP_WINDOW_DETECTED_EVENT;

// states
const initial = "initial" as const;
const checks_completed = "checks_completed" as const; // check whether running inside iframe
const ready = "ready" as const; // ready for drag-drop events
const noop = "noop" as const; // the machine needs to do no work as it's not in a iframe

// context

type CanvasMachineContext = {
  insideIframe: boolean;
  insideTopWindow: boolean;
};

export function createCanvasMachine(id: string) {
  const canvasMachine = createMachine<CanvasMachineContext, CanvasMachineEvent>(
    {
      id,
      initial,
      predictableActionArguments: true,
      states: {
        [initial]: {
          on: {
            [IFRAME_DETECTED]: { target: checks_completed },
            [TOP_WINDOW_DETECTED]: { target: noop },
          },
        },
        [checks_completed]: {
          on: {
            [WINDOW_LOADED]: { target: ready },
          },
        },
        [ready]: {
          on: {},
        },
        [noop]: {},
      },
    }
  );

  return canvasMachine;
}

type Callback = (context: CanvasMachineContext) => void;
type SubscribeStates = "ready";

export function createCanvasMachineInterpreter(id: string) {
  const subscribers: { [key in SubscribeStates]: Callback[] } = {
    ready: [],
  };
  function subscribeCanvasMachine(state: SubscribeStates, cb: Callback) {
    subscribers[state].push(cb);
  }
  function callSubscribers(state: SubscribeStates) {
    subscribers[state].forEach((cb) => {
      try {
        cb(canvasMachineInterpreter.machine.context);
      } catch {
        console.log(`Error while running callback for state ${state}`);
      }
    });
  }
  const machine = createCanvasMachine(id);
  const canvasMachineInterpreter = interpret(machine);
  canvasMachineInterpreter.onTransition((state, event) => {
    if (state.changed && state.value === "ready") {
      callSubscribers("ready");
    }
  });
  return { canvasMachineInterpreter, subscribeCanvasMachine };
}
