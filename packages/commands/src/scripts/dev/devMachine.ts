import { createMachine, interpret } from "xstate";
import { RouteObject } from "react-router-dom";
import {
  dirStructureToIR,
  pathsIRToRouteObjectPaths,
  readDirStructure,
} from "@atrilabs/atri-app-core";
import { PAGE_DIR } from "../../consts";

// states
// The app has been started in the terminal (but not in the browser)
const start = "start" as const;
// The app is live in the browser
const live = "live" as const;

// events
const NEW_PAGE_REQUEST = "NEW_PAGE_REQUEST" as const;
const DIRECTORY_CHANGED = "DIRECTORY_CHANGED" as const;
type DevMachineEvents =
  | { type: typeof NEW_PAGE_REQUEST }
  | { type: typeof DIRECTORY_CHANGED };

// context
type DevMachineContext = {
  routeObjects: Required<Pick<RouteObject, "path">>[];
};

const devMachine = createMachine<DevMachineContext, DevMachineEvents>({
  id: "devMachine",
  initial: start,
  context: {
    routeObjects: [],
  },
  states: {
    [start]: {
      on: {
        [NEW_PAGE_REQUEST]: {},
        [DIRECTORY_CHANGED]: {},
      },
      entry: async (context) => {
        // TODO: save initial route objects in the context
        const filePaths = await readDirStructure(PAGE_DIR);
        const ir = dirStructureToIR(filePaths);
        const routeObjectPaths = pathsIRToRouteObjectPaths(ir);
        context.routeObjects = routeObjectPaths.map((p) => {
          return { path: p };
        });
      },
    },
    [live]: {
      on: {
        [NEW_PAGE_REQUEST]: {},
        [DIRECTORY_CHANGED]: {},
      },
    },
  },
});

const devInterpreter = interpret(devMachine);

devInterpreter.start();

export function getDevMachineState() {
  return devInterpreter.getSnapshot().value;
}

export function getDevMachineContext() {
  return devInterpreter.getSnapshot().context;
}
