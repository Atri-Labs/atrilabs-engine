import fs from "fs";
import path from "path";

type RawFolders = {
  [folderId: string]: { id: string; name: string; parentId: string };
};

type RawPageMap = { [pageId: string]: string };

export function reverseMap(raw: RawFolders) {
  const keys = Object.keys(raw);
  const reverseMap: { [parentId: string]: string[] } = {};
  keys.forEach((key) => {
    if (reverseMap[raw[key]!.parentId]) {
      reverseMap[raw[key]!.parentId]?.push(key);
    } else {
      reverseMap[raw[key]!.parentId] = [key];
    }
  });
  return reverseMap;
}

export function reversePageMap(raw: RawPageMap) {
  const keys = Object.keys(raw);
  const reverseMap: { [folderId: string]: string[] } = {};
  keys.forEach((key) => {
    if (reverseMap[raw[key]!]) {
      reverseMap[raw[key]!]?.push(key);
    } else {
      reverseMap[raw[key]!] = [key];
    }
  });
  return reverseMap;
}

export function getFiles(dir: string): string[] {
  const files: string[] = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      files.push(...getFiles(path.resolve(dir, dirent.name)));
    } else {
      files.push(path.resolve(dir, dirent.name));
    }
  });
  return files;
}
