import fs from "fs";
import { getToolConfigFile } from "./cmdargs";
import { ForestsConfig } from "./types";

export function readForests() {
  const toolConfigFile = getToolConfigFile();
  if (fs.existsSync(toolConfigFile)) {
    const toolConfig = require(toolConfigFile);
    // TODO: validate toolConfig
    if (toolConfig["forests"]) {
      return toolConfig["forests"] as ForestsConfig;
    } else {
      throw Error(`The field "forests" is missing from ${toolConfigFile}`);
    }
  } else {
    throw Error(`Tool config file not found: ${toolConfigFile}`);
  }
}
