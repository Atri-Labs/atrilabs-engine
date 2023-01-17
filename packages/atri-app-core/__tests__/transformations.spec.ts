import { PathsIR } from "../src/utils/PathsIR";
import {
  dirStructureToIR,
  IRToUnixFilePath,
  pathsIRToRouteObjectPaths,
  routeObjectPathToIR,
} from "../src/utils/transformations";

test("dir structure is transformed to IR", () => {
  const unixFilepaths = [
    "/index.js",
    "/blogs/index.js",
    "/careers/$.js",
    "/products/$id.js",
  ];
  const ir = dirStructureToIR(unixFilepaths);
  expect(ir.length).toBe(4);
  expect(ir[0][0]).toMatchObject({ name: "index", type: "static" });
  expect(ir[1][0]).toMatchObject({ name: "blogs", type: "static" });
  expect(ir[1][1]).toMatchObject({ name: "index", type: "static" });
  expect(ir[2][0]).toMatchObject({ name: "careers", type: "static" });
  expect(ir[2][1]).toMatchObject({ name: "*", type: "catchall" });
  expect(ir[3][0]).toMatchObject({ name: "products", type: "static" });
  expect(ir[3][1]).toMatchObject({ name: "id", type: "dynamic" });
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
  const routerPaths = pathsIRToRouteObjectPaths(pathsIR);
  expect(routerPaths.length).toBe(3);
  expect(routerPaths[0]).toBe("/");
  expect(routerPaths[1]).toBe("/blogs");
  expect(routerPaths[2]).toBe("/careers/:id");
});

test("route object path to IR", () => {
  const routeObjectPaths = ["/", "/blogs", "/careers/:id"];
  const irs = routeObjectPaths.map((routeObjectPath) => {
    return routeObjectPathToIR(routeObjectPath);
  });
  expect(irs[0][0].type).toBe("static");
  expect(irs[0][0].name).toBe("index");
  expect(irs[1][0].type).toBe("static");
  expect(irs[1][0].name).toBe("blogs");
  expect(irs[2][0].type).toBe("static");
  expect(irs[2][0].name).toBe("careers");
  expect(irs[2][1].type).toBe("dynamic");
  expect(irs[2][1].name).toBe("id");
});

test("route object to unix file path", () => {
  const routeObjectPaths = ["/", "/blogs", "/careers/:id"];
  const unixFilePaths = routeObjectPaths.map((routeObjectPath) => {
    const ir = routeObjectPathToIR(routeObjectPath);
    return IRToUnixFilePath(ir);
  });
  expect(unixFilePaths[0]).toBe("/index");
  expect(unixFilePaths[1]).toBe("/blogs");
  expect(unixFilePaths[2]).toBe("/careers/$id");
});
