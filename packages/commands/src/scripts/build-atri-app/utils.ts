import { readDirStructure } from "@atrilabs/atri-app-core";
import path from "path";

export async function getAllPages() {
  const pagePaths = await readDirStructure(path.resolve("pages"));
  return pagePaths;
}
