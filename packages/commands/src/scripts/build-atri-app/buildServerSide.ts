import {
  createNodeLibConfig,
  PrepareConfig,
  collectWebpackMessages,
  reportWarningsOrSuccess,
  extractParams,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import webpack from "webpack";
import path from "path";
import { createServerEntry } from "./createServerEntry";
import { ComponentManifests, PageInfo } from "./types";
import { processDirsString } from "../../commons/processManifestDirsString";

function startWebpackBuild(
  params: Parameters<typeof createNodeLibConfig>[0] & {
    prepareConfig?: PrepareConfig;
  }
) {
  const webpackConfig = createNodeLibConfig(params);

  if (typeof params.prepareConfig === "function") {
    params.prepareConfig(webpackConfig);
  }

  return new Promise<void>((resolve) => {
    webpack(webpackConfig, async (err, stats) => {
      const messages = await collectWebpackMessages({
        writeStats: true,
        err,
        stats,
        outputDir: params.paths.outputDir,
      });
      reportWarningsOrSuccess(messages.warnings);
      resolve();
    });
  });
}

export async function buildServerSide(
  params: ReturnType<typeof extractParams> & {
    pagesInfo: PageInfo[];
    componentManifests: ComponentManifests;
  }
) {
  const serverOutputDir = path.resolve(params.paths.outputDir, "server");
  const paths = { ...params.paths, outputDir: serverOutputDir };
  paths.appSrc = process.cwd();
  const exclude = [
    ...processDirsString(params.exclude),
    path.resolve("node_modules"),
  ];
  const additionalInclude = params.additionalInclude || [];
  additionalInclude.push(
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/forest")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/design-system"))
  );
  params.additionalInclude = additionalInclude;
  const allowlist = params.allowlist || [];
  allowlist.push("@atrilabs/forest");
  allowlist.push("@atrilabs/atri-app-core");
  allowlist.push("@atrilabs/atri-app-core/src/utils");
  allowlist.push("@atrilabs/atri-app-core/src/contexts");
  allowlist.push("@atrilabs/atri-app-core/src/components/Link");
  allowlist.push("@atrilabs/atri-app-core/src/prod-entries");
  allowlist.push("@atrilabs/design-system");
  allowlist.push("@atrilabs/canvas-zone");
  startWebpackBuild({
    ...params,
    additionalInclude: [
      ...params.additionalInclude,
      path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve("@atrilabs/manifest-registry")
      ),
    ],
    exclude,
    paths,
    outputFilename: "[name].js",
    moduleFileExtensions,
    entry: await createServerEntry({
      pageInfos: params.pagesInfo,
      componentManifests: params.componentManifests,
    }),
    prepareConfig: (config) => {
      config.resolve = config.resolve ?? {};
      config.resolve["alias"] = {
        ...(config.resolve["alias"] || {}),
        // @ts-ignore
        "@atrilabs/canvas-zone": __non_webpack_require__.resolve(
          "@atrilabs/atri-app-core/src/prod-components/CanvasZone.tsx"
        ),
      };
      config.resolveLoader = {
        alias: {
          "atri-pages-server-loader": path.resolve(
            __dirname,
            "..",
            "src",
            "scripts",
            "build-atri-app",
            "loaders",
            "atri-pages-server-loader.js"
          ),
        },
      };
      config.cache = {
        type: "filesystem",
        cacheDirectory: path.resolve("node_modules", ".cache-build"),
      };
    },
    allowlist,
  });
}
