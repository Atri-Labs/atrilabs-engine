import { PathsIR } from "../src/utils/PathsIR";
import {
  dirStructureToIR,
  pathsIRToReactRouter,
} from "../src/utils/transformations";

test("dir structure is transformed to IR", () => {
  const unixFilepaths = ["/index.js", "/blogs/index.js"];
  const ir = dirStructureToIR(unixFilepaths);
  expect(ir.length).toBe(2);
  expect(ir[0][0]).toMatchObject({ name: "index", type: "static" });
  expect(ir[1][0]).toMatchObject({ name: "blogs", type: "static" });
  expect(ir[1][1]).toMatchObject({ name: "index", type: "static" });
});

test("IR transformed to react router paths", () => {
  const pathsIR: PathsIR = [
    [{ name: "index", type: "static" }],
    [
      { name: "blogs", type: "static" },
      { name: "index", type: "static" },
    ],
    [
      { name: "careers", type: "static" },
      { name: "id", type: "dynamic" },
    ],
  ];
  const routerPaths = pathsIRToReactRouter(pathsIR);
  expect(routerPaths.length).toBe(3);
  expect(routerPaths[0]).toBe("/");
  expect(routerPaths[1]).toBe("/blogs");
  expect(routerPaths[2]).toBe("/careers/:id");
});
