import {
  CatchAllSegment,
  DynamicSegment,
  StaticSegment,
  PathIR,
  PathsIR,
} from "./PathsIR";
import path from "path";

/**
 *
 * @param files absolute unix file paths
 */
export function dirStructureToIR(unixFilepaths: string[]) {
  // TODO: validate files entry are absolute unix path
  // TODO: normalize files to a standard unix path
  // TODO: assume last segment has an extension
  const ir: PathsIR = unixFilepaths.map((unixFilepath) => {
    const segments = unixFilepath.split("/").slice(1);
    const routes = segments.map((segment, index) => {
      const isLastSegment = index === segments.length - 1;
      const segmentWithoutExt = isLastSegment
        ? segment.slice(0, -1 * path.extname(segment).length)
        : segment;
      if (
        segmentWithoutExt.startsWith("[...") &&
        segmentWithoutExt.endsWith("]")
      ) {
        return {
          type: "catchall",
          name: segmentWithoutExt.replace(/(^(\[\.\.\.)|(\])$)/, ""),
        } as CatchAllSegment;
      } else if (
        segmentWithoutExt.startsWith("[") &&
        segmentWithoutExt.endsWith("]")
      ) {
        return {
          type: "dynamic",
          name: segmentWithoutExt.replace(/(^(\[)|(\])$)/, ""),
        } as DynamicSegment;
      } else {
        return { type: "static", name: segmentWithoutExt } as StaticSegment;
      }
    });
    return routes;
  });
  return ir;
}

export function pathIRToRouteObjectPath(pathIR: PathIR) {
  // exception for /index
  if (
    pathIR.length === 1 &&
    pathIR[0].name === "index" &&
    pathIR[0].type === "static"
  ) {
    return "/";
  }

  return pathIR
    .map((segment) => {
      switch (segment.type) {
        case "static":
          return segment.name === "index" ? "" : `/${segment.name}`;
        case "dynamic":
          return `/:${segment.name}`;
        case "catchall":
          return `/*`;
      }
    })
    .join("");
}

export function pathsIRToRouteObjectPaths(pathsIR: PathsIR) {
  return pathsIR.map((ir) => {
    return pathIRToRouteObjectPath(ir);
  });
}
