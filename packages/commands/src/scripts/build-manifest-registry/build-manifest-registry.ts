#!/usr/bin/env node

import { extractParams } from "@atrilabs/commands-builder";
import path from "path";
import webpack from "webpack";
import createManifestRegistryConfig from "../../commons/manifest-registry.webpack.config";
import { processDirsString } from "../../commons/processManifestDirsString";
import { getCorePkgInfo, readToolConfig } from "../dev-editor/utils";

async function main() {
  const toolConfig = readToolConfig();
  const params = extractParams();
  const exclude = [
    ...processDirsString(params.exclude),
    path.resolve("node_modules"),
  ];
  const additionalInclude = params.additionalInclude || [];
  additionalInclude.push(
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/manifest-registry")
    ),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core")),
    // @ts-ignore
    path.dirname(__non_webpack_require__.resolve("@atrilabs/core")),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve(
        "@atrilabs/react-component-manifest-schema"
      )
    ),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve(
        "@atrilabs/component-icon-manifest-schema"
      )
    ),
    ...toolConfig.layers.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    }),
    ...toolConfig.runtimes.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    }),
    ...toolConfig.manifestDirs.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    }),
    ...toolConfig.manifestSchema.map(({ pkg }) => {
      return path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(pkg)
      );
    }),
    path.dirname(
      // @ts-ignore
      __non_webpack_require__.resolve("@atrilabs/app-design-forest")
    )
  );
  params.additionalInclude = additionalInclude;

  params.paths.appSrc = process.cwd();

  const externals = {
    react: "React",
    "react-dom": "ReactDOM",
  };

  const corePkgInfo = getCorePkgInfo();

  const webpackConfig = createManifestRegistryConfig({
    ...params,
    exclude,
    babel: {
      plugins: [
        [
          path.resolve(
            __dirname,
            "..",
            "src",
            "scripts",
            "dev-editor",
            "babel-plugins",
            "replace-import-with-id.js"
          ),
          {},
        ],
      ],
    },
    externals,
    toolConfig,
    corePkgInfo,
  });

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log(err);
    }
    if (stats?.hasErrors()) {
      console.log(stats.toJson().errors);
    }
  });
}

main().catch((err) => {
  console.log(err);
});
