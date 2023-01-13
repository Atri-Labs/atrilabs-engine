import { readDirStructure } from "../src/utils/readDirStructure";
import path from "path";

test("reads empty pages directory", async () => {
  const files = await readDirStructure(
    path.resolve(__dirname, "example-routes", "app-root-1", "pages")
  );
  expect(files.length).toBe(0);
});

test("reads pages directory with two pages", async () => {
  const files = await readDirStructure(
    path.resolve(__dirname, "example-routes", "app-root-2", "pages")
  );
  expect(files.length).toBe(2);
  expect(files).toContain("/index.js");
  expect(files).toContain("/blog/index.js");
});
