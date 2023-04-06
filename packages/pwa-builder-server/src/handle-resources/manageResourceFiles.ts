import path from "path";
import fs from "fs";
import recursive from "recursive-readdir";
import { v4 as uuidv4 } from "uuid";

export const RESOURCES_DIR = path.resolve("public", "resources");

function getId() {
  return uuidv4();
}

function createResourcesDir() {
  if (!fs.existsSync(RESOURCES_DIR)) {
    fs.mkdirSync(RESOURCES_DIR, { recursive: true });
  }
}

createResourcesDir();

export function createCSSFile(content: string) {
  const filename = `${getId()}.css`;
  fs.writeFileSync(path.resolve(RESOURCES_DIR, filename), content);
}

export function createTemplateJSONFile(templateName: string, content: Array<object>) {
  const filename = `${templateName}.template.json`;
  fs.writeFileSync(path.resolve(RESOURCES_DIR, filename), JSON.stringify(content), 'utf-8');
}

export function getResourceFiles() {
  return recursive(RESOURCES_DIR);
}
