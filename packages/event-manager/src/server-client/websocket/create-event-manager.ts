import fs from "fs";
import path from "path";
import createLowDbEventManager from "../../implementations/lowdb/LowDbEventManager";
import { EventManager } from "../../types";
import { getWorkDir } from "./cmdargs";
import { ForestsConfig } from "./types";

function getForestDirPath(forestname: string) {
  return path.resolve(getWorkDir(), "forests", forestname);
}

function checkIfDirExists(forestname: string) {
  if (fs.existsSync(getForestDirPath(forestname))) {
    return true;
  }
  return false;
}

// create one directory and event manager for each of forest
export function createEventManager(forests: ForestsConfig) {
  const forestnames = Object.keys(forests);
  const eventManagers: { [forestname: string]: EventManager } = {};
  forestnames.forEach((forestname) => {
    // create directory if does not exist already
    if (!checkIfDirExists(forestname)) {
      fs.mkdirSync(getForestDirPath(forestname), { recursive: true });
    }
    // create event manager
    const eventManager = createLowDbEventManager({
      dbDir: getForestDirPath(forestname),
    });
    eventManagers[forestname] = eventManager;
  });
  return eventManagers;
}
