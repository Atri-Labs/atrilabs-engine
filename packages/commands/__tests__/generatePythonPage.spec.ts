import { generatePage } from "../src/scripts/gen-py-app/utils";
import fs from "fs";
import path from "path";

test("generate python page", () => {
  const pageCode = generatePage([
    {
      alias: "Button1",
      compKey: "Button",
      pythonPkg: "atri_components.Button",
    },
  ]);
  expect(pageCode).toBe(
    fs
      .readFileSync(
        path.resolve(__dirname, "generated_file_samples", "Page.py")
      )
      .toString()
  );
});
