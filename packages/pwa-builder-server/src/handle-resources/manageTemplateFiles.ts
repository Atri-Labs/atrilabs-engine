import path from "path";
import fs from "fs";
import { RESOURCES_DIR } from "./manageResourceFiles";
import { AnyEvent } from "@atrilabs/forest";

export function getTemplateFilepath(dir: string, templateName: string) {
  return path.resolve(dir, templateName);
}

export function createTemplateJSONFile(
  templateName: string,
  content: Array<object>
) {
  const filename = path.resolve(RESOURCES_DIR, `${templateName}.template.json`);
  if (!fs.existsSync(path.resolve(RESOURCES_DIR, filename))) {
    fs.writeFileSync(
      path.resolve(RESOURCES_DIR, filename),
      JSON.stringify(content),
      "utf-8"
    );
  }
}

export function getTemplateEvents(templateName: string) {
  const templatePath = getTemplateFilepath(RESOURCES_DIR, templateName);
  if (fs.existsSync(templatePath)) {
    return JSON.parse(
      fs.readFileSync(templatePath, "utf8").toString()
    ) as AnyEvent[];
  }
  return;
}

export function deleteTemplate(templateName: string) {
  const templatePath = getTemplateFilepath(RESOURCES_DIR, templateName);
  if (fs.existsSync(templatePath)) {
    fs.rmSync(templatePath);
  }
}
