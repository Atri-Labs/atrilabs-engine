#!/usr/bin/env node

import { extractParams } from "@atrilabs/commands-builder";
import { buildManifests } from "./buildManifests";
import fs from "fs";
import path from "path";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import pkgUp from "pkg-up";
import { createComponentClassFile, createInitPyFile } from "./utils";

const atriPyPkgOutputDir = "atri-py-pkg";

/**
 * This script has to be run in a package that
 * exports manifests or an Atri app with manifests directory.
 *
 * Generate python classes from manifests.
 */
async function main() {
  const params = extractParams();
  buildManifests({ params })
    .then(() => {
      const outputFilepath = path.resolve(
        params.paths.outputDir,
        params.outputFilename
      );
      // check if build of manifest registry was success
      if (fs.existsSync(outputFilepath)) {
        const componentsDir = path.resolve(
          params.paths.outputDir,
          atriPyPkgOutputDir,
          "src",
          "components"
        );
        if (!fs.existsSync(componentsDir))
          fs.mkdirSync(componentsDir, {
            recursive: true,
          });
        // @ts-ignore
        const registry = __non_webpack_require__(outputFilepath).default as {
          manifests: { [schema: string]: any };
        }[];
        const ReactComponentManifestSchemaId =
          "@atrilabs/react-component-manifest-schema/src/index.ts";
        const result = registry.map(({ manifests }) => {
          const reactManifest: ReactComponentManifestSchema | undefined =
            manifests[ReactComponentManifestSchemaId];
          if (reactManifest) {
            // @ts-ignore
            const nodePkg = __non_webpack_require__(pkgUp.sync())["name"];
            const compKey = reactManifest.meta.key;
            const callbacks = Object.keys(reactManifest.dev.attachCallbacks);
            const customProps = Object.keys(
              reactManifest.dev.attachProps[
                "atrilabs/app-design-forest/src/customPropsTree"
              ] || {}
            );
            return {
              content: createComponentClassFile({
                compKey,
                nodePkg,
                callbacks,
                customProps,
              }),
              compKey,
            };
          } else {
            throw Error(
              "The react manifest schema isn't exported for some component."
            );
          }
        });
        // write components py file
        result.forEach(({ compKey, content }) =>
          fs.writeFileSync(
            path.resolve(componentsDir, `${compKey}.py`),
            content
          )
        );
        // write __init__.py file
        fs.writeFileSync(
          path.resolve(componentsDir, "..", `__init__.py`),
          createInitPyFile(result.map((r) => r.compKey))
        );
      } else {
        throw Error(`Missing bundle ${outputFilepath}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

main().catch((err) => console.log(err));
