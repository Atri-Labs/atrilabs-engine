import {
  createNodeLibConfig,
  extractParams,
  moduleFileExtensions,
} from "@atrilabs/commands-builder";
import { createManifestsEntry } from "./createManifestsEntry";
import path from "path";
import fs from "fs";
import webpack from "webpack";

export function buildManifests(options: {
  params: ReturnType<typeof extractParams>;
}) {
  return new Promise<void>((resolve, reject) => {
    const { params } = options;
    params.additionalInclude = params.additionalInclude || [];
    params.additionalInclude.push(
      path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve("@atrilabs/manifest-registry")
      ),
      // @ts-ignore
      path.dirname(__non_webpack_require__.resolve("@atrilabs/atri-app-core")),
      // @ts-ignore
      path.dirname(__non_webpack_require__.resolve("@atrilabs/core")),
      // @ts-ignore
      path.dirname(__non_webpack_require__.resolve("@atrilabs/design-system")),
      path.dirname(
        // @ts-ignore
        __non_webpack_require__.resolve(
          "@atrilabs/react-component-manifest-schema"
        )
      ),
      // @ts-ignore
      path.dirname(__non_webpack_require__.resolve("@atrilabs/forest"))
    );

    params.allowlist = params.allowlist || [];
    params.allowlist.push(
      "@atrilabs/atri-app-core/src/editor-components/MissingIcon"
    );
    params.allowlist.push("@atrilabs/design-system");
    params.allowlist.push("@atrilabs/manifest-registry");
    params.allowlist.push("@atrilabs/react-component-manifest-schema");
    params.allowlist.push("@atrilabs/forest");

    if (fs.existsSync(path.resolve("manifests"))) {
      params.additionalInclude = [
        ...params.additionalInclude,
        path.resolve("manifests"),
      ];
    }

    const conifg = createNodeLibConfig({
      ...params,
      entry: createManifestsEntry,
      moduleFileExtensions,
      outputFilename: params.outputFilename,
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
    });
    conifg.resolveLoader = {
      alias: {
        "register-components-loader": path.resolve(
          __dirname,
          "..",
          "src",
          "scripts",
          "gen-py-classes",
          "loaders",
          "register-components-loader.js"
        ),
      },
    };
    webpack(conifg, (err, stats) => {
      if (err) {
        console.log(err);
      }
      if (stats?.hasErrors()) {
        console.log(stats.toJson().errors);
      }
      if (err || stats?.hasErrors()) {
        reject();
      } else {
        resolve();
      }
    });
  });
}
