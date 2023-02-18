import { createComponentClassFile } from "../src/scripts/gen-py-classes/utils";
import fs from "fs";
import path from "path";

test("generate python classes", () => {
  const classFile = createComponentClassFile({
    compKey: "Button",
    callbacks: ["onClick"],
    customProps: ["text"],
  });
  expect(classFile).toBe(
    fs
      .readFileSync(
        path.resolve(__dirname, "generated_file_samples", "Button.py")
      )
      .toString()
  );
});
