import path from "path";
import fs from "fs";
import { EventManager, ForestManager, ForestsConfig } from "../../types";
import createLowDbEventManager from "./LowDbEventManager";

export type LowDbForestManagerOptions = {
  forestDir: string;
  forestsConfig: ForestsConfig;
  mode?: "readonly";
};

function getForestDirPath(forestDir: string, forestname: string) {
  return path.resolve(forestDir, "forests", forestname);
}

function checkIfDirExists(forestDir: string, forestname: string) {
  if (fs.existsSync(getForestDirPath(forestDir, forestname))) {
    return true;
  }
  return false;
}

// create one directory and event manager for each of forest
export function createEventManagers(
  forestDir: string,
  forestsConfig: ForestsConfig,
  mode?: "readonly"
) {
  const forestnames = Object.keys(forestsConfig);
  const eventManagers: { [forestname: string]: EventManager } = {};
  forestnames.forEach((forestname) => {
    // create directory if does not exist already
    if (!checkIfDirExists(forestDir, forestname)) {
      fs.mkdirSync(getForestDirPath(forestDir, forestname), {
        recursive: true,
      });
    }
    // create event manager
    const eventManager = createLowDbEventManager({
      dbDir: getForestDirPath(forestDir, forestname),
      mode,
    });
    eventManagers[forestname] = eventManager;
  });
  return eventManagers;
}

export default function createLowDbForestManager(
  options: LowDbForestManagerOptions
): ForestManager {
  const eventManagers = createEventManagers(
    options.forestDir,
    options.forestsConfig,
    options.mode
  );
  function getEventManager(name: string) {
    if (eventManagers[name] === undefined)
      throw Error(
        `Event Manager for forest type ${name} doesn't exist. Please check your tool.config.json.`
      );
    return eventManagers[name]!;
  }
  return { getEventManager };
}
