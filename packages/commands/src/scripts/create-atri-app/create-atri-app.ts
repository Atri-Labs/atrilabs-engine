#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import path from "path";
import fs from "fs";
import * as ts from "typescript";
import recursive from "recursive-readdir";
import { v4 as uuidv4 } from "uuid";
import { generateControllers } from "./generateControllers";
import { generateTSConfig } from "./generateTSFiles";
import { generateTypeFile } from "./generateTSFiles";
import { generateGitIgnoe } from "./generateGitIgnore";

process.on("unhandledRejection", (reason) => {
  console.log(chalk.red(`create-atri-app failed with reason\n ${reason}`));
});

function processArgs() {
  return yargs
    .option("name", {
      alias: "n",
      default: "my_app",
      description: "name of the app",
    })
    .option("author", { alias: "a", default: "", description: "name <email>" })
    .option("description", {
      alias: "d",
      default: "",
      description: "describe the app",
    })
    .boolean("typescript").argv as {
    name: string;
    author: string;
    description: string;
    typescript: boolean;
  };
}

function createAppDirectory(dest: string) {
  if (fs.existsSync(dest)) {
    console.log(chalk.red(`A directory at ${dest} already exists.`));
    process.exit(1);
  }
  fs.mkdirSync(dest);
}

function createPackageJSON(
  data: {
    name: string;
    author: string;
    description: string;
  },
  options: { dest: string }
) {
  const str = JSON.stringify(
    {
      name: data.name,
      author: data.author,
      description: data.description,
      license: "ISC",
      scripts: {
        dev: 'cross-env ATRI_APP_API_ENDPOINT=http://localhost:4007 dev-atri-app -d "#@atrilabs/react-component-manifests" -a "@atrilabs/utils:@atrilabs/atri-app-core/src/components/Link" -i "@atrilabs/utils:@atrilabs/atri-app-core"',
        "gen-py-app": "gen-py-app",
        "dev-py-app": "dev-py-app",
        "gen-py-classes":
          'gen-py-classes -n ../../node_modules -i "@atrilabs/utils" -a "@atrilabs/utils"',
        editor:
          'cross-env APP_HOSTNAME="http://localhost:3000" dev-atri-editor',
        build:
          'cross-env NODE_ENV=production BABEL_ENV=production build-atri-app -d "#@atrilabs/react-component-manifests"',
        serve: "serve",
      },
      // Update these versions on every release
      dependencies: {
        "@atrilabs/atri-app-core": "^1.0.0-alpha.18",
        "@atrilabs/canvas-zone": "^1.0.0-alpha.18",
        "@atrilabs/commands": "^1.0.0-alpha.18",
        "@atrilabs/commands-builder": "^1.0.0-alpha.18",
        "@atrilabs/core": "^1.0.0-alpha.18",
        "@atrilabs/design-system": "^1.0.0-alpha.18",
        "@atrilabs/pwa-builder": "^1.0.0-alpha.18",
        "@atrilabs/pwa-builder-server": "^1.0.0-alpha.18",
        "@atrilabs/react-component-manifests": "^1.0.0-alpha.18",
        "@atrilabs/utils": "^1.0.0-alpha.18",
        "cross-env": "^7.0.3",
        "node-noop": "^1.0.0",
        react: "18.2.0",
        "react-dom": "18.2.0",
        xstate: "^4.35.2",
      },
      devDependencies: {
        "@types/lodash": "^4.14.192",
        "@types/uuid": "^9.0.1",
      },
      browserslist: {
        production: [">0.2%", "not dead", "not op_mini all"],
        development: [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version",
        ],
      },
      atriConfig: {
        id: uuidv4(),
        pythonPackageName: "manifests",
      },
    },
    null,
    2
  );
  const fullPath = path.resolve(options.dest, "package.json");
  if (fs.existsSync(fullPath)) {
    console.log(
      chalk.red(
        `A package.json file at ${path.resolve(options.dest)} already exists.`
      )
    );
    process.exit(1);
  }
  fs.writeFileSync(fullPath, str);
}

function createPageScaffold() {
  return [
    `import { CanvasZone } from "@atrilabs/canvas-zone";`,
    ``,
    `export default function() {`,
    `\treturn <CanvasZone id={"main"} />`,
    `}`,
  ].join("\n");
}

function convertTsxToJsX(filepath: string) {
  if (!filepath.endsWith(".tsx")) {
    throw Error("Only files ending with .tsx can be converted to .jsx");
  }
  const code = fs.readFileSync(filepath).toString();
  return ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      jsx: ts.JsxEmit.Preserve,
    },
  }).outputText;
}

function copyAppWrapper(options: { dest: string; useTypescript: boolean }) {
  const moduleExtenstion = options.useTypescript ? ".tsx" : ".jsx";
  // @ts-ignore
  const appWrapperPath = __non_webpack_require__.resolve(
    "@atrilabs/atri-app-core/src/components/AppWrapper.tsx"
  );
  const content =
    moduleExtenstion === ".tsx"
      ? fs.readFileSync(appWrapperPath)
      : convertTsxToJsX(appWrapperPath);
  fs.writeFileSync(
    path.resolve(options.dest, "pages", "_app" + moduleExtenstion),
    content
  );
}

function copyDocument(options: { dest: string; useTypescript: boolean }) {
  const moduleExtenstion = options.useTypescript ? ".tsx" : ".jsx";
  // @ts-ignore
  const documentPath = __non_webpack_require__.resolve(
    "@atrilabs/atri-app-core/src/components/Document.tsx"
  );
  const content =
    moduleExtenstion === ".tsx"
      ? fs.readFileSync(documentPath)
      : convertTsxToJsX(documentPath);
  fs.writeFileSync(
    path.resolve(options.dest, "pages", "_document" + moduleExtenstion),
    content
  );
}

function copyError(options: { dest: string; useTypescript: boolean }) {
  const moduleExtenstion = options.useTypescript ? ".tsx" : ".jsx";
  // @ts-ignore
  const documentPath = __non_webpack_require__.resolve(
    "@atrilabs/atri-app-core/src/components/_error.tsx"
  );
  const content =
    moduleExtenstion === ".tsx"
      ? fs.readFileSync(documentPath)
      : convertTsxToJsX(documentPath);
  fs.writeFileSync(
    path.resolve(options.dest, "pages", "_error" + moduleExtenstion),
    content
  );
}

function createPagesDirectory(options: {
  dest: string;
  useTypescript: boolean;
}) {
  const { dest, useTypescript } = options;
  const fullPath = path.resolve(dest, "pages");
  if (fs.existsSync(fullPath)) {
    console.log(
      chalk.red(`A pages directory at ${path.resolve(dest)} already exists.`)
    );
    process.exit(1);
  }
  fs.mkdirSync(fullPath);

  const indexPagePath = `${path.resolve(
    fullPath,
    "index" + (useTypescript ? ".tsx" : ".jsx")
  )}`;
  fs.writeFileSync(indexPagePath, createPageScaffold());

  copyAppWrapper({ dest, useTypescript });
}

function createEslintRC(options: { dest: string }) {
  fs.writeFileSync(
    path.resolve(options.dest, ".eslintrc.json"),
    JSON.stringify(
      {
        env: {
          es6: true,
        },
        parserOptions: {
          sourceType: "module",
        },
        extends: ["plugin:import/react"],
      },
      null,
      2
    )
  );
}

function createPublicDirectory(options: { dest: string }) {
  const { dest } = options;
  const publicDir = path.resolve(dest, "public");
  fs.mkdirSync(publicDir, { recursive: true });
  recursive(
    path.resolve(__dirname, "..", "src", "scripts", "dev", "public")
  ).then((files) => {
    files.forEach((file) => {
      fs.copyFileSync(file, path.resolve(publicDir, path.basename(file)));
    });
  });
}

function main() {
  const args = processArgs();
  const dirname = args.name.startsWith("@")
    ? args.name.split("/")[1]
    : args.name;
  if (dirname === undefined) {
    console.log(
      chalk.red(`The directory name must be a valid npm package name.`)
    );
    process.exit(1);
  }
  const dest = path.resolve(dirname);
  createAppDirectory(dest);
  createPackageJSON(args, { dest });
  createPagesDirectory({ dest, useTypescript: args.typescript });
  createEslintRC({ dest });
  copyDocument({ dest, useTypescript: args.typescript });
  copyError({ dest, useTypescript: args.typescript });
  createPublicDirectory({ dest });
  generateControllers({ dest });
  generateTSConfig({ dest });
  if (args.typescript) generateTypeFile({ dest });
  generateGitIgnoe({ dest, useTypescript: args.typescript });
}

main();
