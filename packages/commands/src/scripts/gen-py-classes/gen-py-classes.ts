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
  // @ts-ignore
  const packageJSON = __non_webpack_require__(pkgUp.sync());
  if (
    !packageJSON["atriConfig"] &&
    !packageJSON["atriConfig"]["pythonPackageName"]
  ) {
    throw Error("The package.json doesn't have valid atriConfig field.");
  }

  const componentsDir = path.resolve(
    params.paths.outputDir,
    atriPyPkgOutputDir,
    "src",
    packageJSON["atriConfig"]["pythonPackageName"]
  );

  if (!fs.existsSync(componentsDir))
    fs.mkdirSync(componentsDir, {
      recursive: true,
    });

  const configDir = path.resolve(
    params.paths.outputDir,
    atriPyPkgOutputDir,
    "src",
    "config"
  );

  if (!fs.existsSync(configDir))
    fs.mkdirSync(configDir, {
      recursive: true,
    });

  // write package.json to atri-py-pkg/config directory
  fs.writeFileSync(
    path.resolve(configDir, "package.json"),
    JSON.stringify(packageJSON, null, 2)
  );
  fs.writeFileSync(path.resolve(configDir, "__init__.py"), "");

  const setupPyFilepath = path.resolve(
    params.paths.outputDir,
    atriPyPkgOutputDir,
    "setup.py"
  );

  if (!fs.existsSync(setupPyFilepath)) {
    fs.copyFileSync(
      path.resolve(
        __dirname,
        "..",
        "src",
        "scripts",
        "gen-py-classes",
        "templates",
        "setup.py"
      ),
      setupPyFilepath
    );
  }

  const pyProjectTomlFilepath = path.resolve(
    params.paths.outputDir,
    atriPyPkgOutputDir,
    "pyproject.toml"
  );

  if (!fs.existsSync(pyProjectTomlFilepath)) {
    fs.copyFileSync(
      path.resolve(
        __dirname,
        "..",
        "src",
        "scripts",
        "gen-py-classes",
        "templates",
        "pyproject.toml"
      ),
      pyProjectTomlFilepath
    );
  }

  buildManifests({ params })
    .then(() => {
      const outputFilepath = path.resolve(
        params.paths.outputDir,
        params.outputFilename
      );
      // check if build of manifest registry was success
      if (fs.existsSync(outputFilepath)) {
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
            const nodePkg = packageJSON["name"];
            const compKey = reactManifest.meta.key;
            const callbacks = Object.keys(reactManifest.dev.attachCallbacks);
            const customProps = Object.keys(
              reactManifest.dev.attachProps["custom"]?.["treeOptions"][
                "dataTypes"
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
          path.resolve(componentsDir, `__init__.py`),
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
