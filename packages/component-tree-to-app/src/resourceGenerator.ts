import { ResourceGeneratorFunction } from "@atrilabs/app-generator";
import { ImportedResource } from "@atrilabs/core";
import fs from "fs";
import path from "path";

const resourceGenerator: ResourceGeneratorFunction = (options) => {
  const resources: ImportedResource[] = [];
  try {
    const content = fs
      .readFileSync(
        path.resolve(options.resourcesConfig.path, "resources.json")
      )
      .toString();
    const parsedContent = JSON.parse(content);
    resources.push(...parsedContent);
  } catch (err) {
    console.log("Resource generator encountered error\n");
    console.log(err);
  }
  return resources;
};

export default resourceGenerator;
