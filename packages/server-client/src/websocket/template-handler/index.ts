import { AnyEvent } from "@atrilabs/forest";
import fs from "fs";
import path from "path";
import { getFiles } from "../utils";

export function getTemplateFilepath(
  dir: string,
  relativeDir: string,
  templateName: string
) {
  return path.resolve(dir, relativeDir, templateName);
}

export function createTemplate(
  dir: string,
  relativeDir: string,
  templateName: string,
  events: AnyEvent[]
) {
  const dest = getTemplateFilepath(dir, relativeDir, templateName);
  const destDirectory = path.resolve(dir, relativeDir);
  if (!fs.existsSync(destDirectory)) {
    fs.mkdirSync(destDirectory, { recursive: true });
  }
  fs.writeFileSync(dest, JSON.stringify(events, null, 2));
}

export function overwriteTemplate(
  dir: string,
  relativeDir: string,
  templateName: string,
  events: AnyEvent[]
) {
  createTemplate(dir, relativeDir, templateName, events);
}

export function getTemplateList(dir: string) {
  const filenames = getFiles(path.resolve(dir));
  return filenames.map((filename) => {
    const templateDirname = path.dirname(filename);
    const relativeDir = path.relative(dir, templateDirname);
    const templateName = path.basename(filename);
    return { relativeDir, templateName };
  });
}

export function deleteTemplate(
  dir: string,
  relativeDir: string,
  templateName: string
) {
  const templatePath = getTemplateFilepath(dir, relativeDir, templateName);
  if (fs.existsSync(templatePath)) {
    fs.rmSync(templatePath);
  }
}

export function getTemplateEvents(
  dir: string,
  relativeDir: string,
  templateName: string
) {
  const templatePath = getTemplateFilepath(dir, relativeDir, templateName);
  if (fs.existsSync(templatePath)) {
    return JSON.parse(fs.readFileSync(templatePath).toString()) as AnyEvent[];
  }
  return;
}
