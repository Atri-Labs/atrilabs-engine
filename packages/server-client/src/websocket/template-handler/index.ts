import { AnyEvent } from "@atrilabs/forest";
import fs from "fs";
import path from "path";
import { getFiles } from "../utils";

export function getTemplateFilepath(dir: string, name: string) {
  return path.resolve(dir, `${name}.json`);
}

export function createTemplate(dir: string, name: string, events: AnyEvent[]) {
  const dest = getTemplateFilepath(dir, name);
  fs.writeFileSync(dest, JSON.stringify(events, null, 2));
}

export function overwriteTemplate(
  dir: string,
  name: string,
  events: AnyEvent[]
) {
  createTemplate(dir, name, events);
}

export function getTemplateList(dir: string) {
  const filenames = getFiles(path.resolve(dir));
  return filenames.map((filename) => {
    return filename.replace(/(\.json)/g, "");
  });
}

export function deleteTemplate(dir: string, name: string) {
  const templatePath = getTemplateFilepath(dir, name);
  if (fs.existsSync(templatePath)) {
    fs.rmSync(templatePath);
  }
}

export function getTemplateEvents(dir: string, name: string) {
  const templatePath = getTemplateFilepath(dir, name);
  if (fs.existsSync(templatePath)) {
    return JSON.parse(fs.readFileSync(templatePath).toString()) as AnyEvent[];
  }
  return;
}
