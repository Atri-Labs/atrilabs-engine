import {
  extractParams,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import webpack from "webpack";
import path from "path";
import { PageInfo } from "./types";
import { createCommonConfig } from "./createCommonConfig";
import { startWebpackBuild } from "./utils";
import { createClientEntry } from "./createClientEntry";
import type { ComponentManifests } from "@atrilabs/atri-app-core/src/types";
import CompressionPlugin from "compression-webpack-plugin";
import { compressionMap } from "../../commons/maps";

export async function buildClientSide(
  params: ReturnType<typeof extractParams> & {
    pagesInfo: PageInfo[];
    componentManifests: ComponentManifests;
  }
) {
  const { appSrc, exclude, additionalInclude, resolveAlias } =
    createCommonConfig({
      exclude: params.exclude,
      componentManifests: params.componentManifests,
    });
  const serverOutputDir = path.resolve(params.paths.outputDir, "client");
  params.paths = { ...params.paths, outputDir: serverOutputDir, appSrc };

  params.additionalInclude = [
    ...(params.additionalInclude || []),
    ...additionalInclude,
  ];

  return startWebpackBuild({
    ...params,
    exclude,
    outputFilename: "[name].js",
    moduleFileExtensions,
    entry: await createClientEntry({
      pageInfos: params.pagesInfo,
      componentManifests: params.componentManifests,
    }),
    prepareConfig: (config) => {
      config.resolve = config.resolve ?? {};
      config.resolve["alias"] = {
        ...(config.resolve["alias"] || {}),
        ...resolveAlias,
      };
      config.resolveLoader = {
        alias: {
          "atri-pages-client-loader": path.resolve(
            __dirname,
            "..",
            "src",
            "scripts",
            "build-atri-app",
            "loaders",
            "atri-pages-client-loader.js"
          ),
        },
      };
      config.cache = {
        type: "filesystem",
        cacheDirectory: path.resolve("node_modules", ".cache-build", "client"),
      };
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          React: "react",
        }),
        new CompressionPlugin({
          test: /\.(js|css)(\?.*)?$/i,
          algorithm: compressionMap[params.compress],
          filename: `[path][base].${params.compress}`,
        })
      );
      config.optimization = {
        ...(config.optimization || {}),
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
        },
      };
    },
    shouldInlineRuntimeChunk: true,
  }).catch((err) => {
    throw err;
  });
}
