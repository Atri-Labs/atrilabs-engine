import path from "path";
import { RuleSetRule } from "webpack";
import { excludeWithAdditionalModules } from "../../commons/excludeWithAdditionalInclude";
import { processDirsString } from "../../commons/processManifestDirsString";
import type { ComponentManifests } from "@atrilabs/atri-app-core/src/types";

export function createCommonConfig(params: {
  exclude: string[];
  componentManifests: ComponentManifests;
}) {
  const appSrc = process.cwd();
  const excludeDirs = [
    ...processDirsString(params.exclude),
    path.resolve("node_modules"),
  ];
  const manifestPkgDirs: { [dir: string]: string } = {};
  Object.keys(params.componentManifests).forEach((pkg) => {
    try {
      const manifestDir = path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(`${pkg}/package.json`)
      );
      manifestPkgDirs[manifestDir] = pkg;
    } catch {}
  });
  const additionalInclude = [
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/forest")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/design-system")),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/manifest-registry")
    ),
    ...Object.keys(manifestPkgDirs),
  ];
  const exclude: RuleSetRule["exclude"] = excludeWithAdditionalModules(
    additionalInclude,
    excludeDirs
  );
  const allowlist = [
    "@atrilabs/forest",
    "@atrilabs/atri-app-core",
    "@atrilabs/atri-app-core/src/utils",
    "@atrilabs/atri-app-core/src/contexts",
    "@atrilabs/atri-app-core/src/components/Link",
    "@atrilabs/atri-app-core/src/prod-entries",
    "@atrilabs/design-system",
    "@atrilabs/canvas-zone",
    (moduleName: string) => {
      let found = false;
      Object.keys(manifestPkgDirs).forEach((manifestPkgDir) => {
        found = moduleName.startsWith(manifestPkgDir) || false;
      });
      return found;
    },
  ];
  const resolveAlias = {
    // @ts-ignore
    "@atrilabs/canvas-zone":
      "@atrilabs/atri-app-core/src/prod-components/CanvasZone.tsx",
  };
  return { appSrc, exclude, additionalInclude, allowlist, resolveAlias };
}
