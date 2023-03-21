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
  params: ReturnType<typeof extractParams>
) {
  const serverOutputDir = path.resolve(params.paths.outputDir, "server");
  const paths = { ...params.paths, outputDir: serverOutputDir };
  const allowlist = params.allowlist || [];
  allowlist.push("@atrilabs/forest");
  allowlist.push("@atrilabs/atri-app-core");
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
    paths,
    outputFilename: "[name].js",
    moduleFileExtensions,
    entry: createServerEntry,
    prepareConfig: (config) => {
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
    },
    allowlist,
  });
}
