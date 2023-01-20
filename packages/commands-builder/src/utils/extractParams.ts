import yargs from "yargs";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { getClientEnvironment } from "./getClientEnvironment";
import { getPublicUrlOrPath } from "./getPublicUrlOrPath";
import { resolveModule } from "./resolveModule";
import { BuildConfig, MultiConfig } from "./types";
import { getServerEnvironment } from "./getServerEnvironment";

/**
 * process command line arguments
 * @returns args
 */
export function processArgs() {
  return yargs
    .option("e", {
      alias: "entry",
      type: "string",
    })
    .option("o", { alias: "outputDir", type: "string", default: "./dist" })
    .option("f", {
      alias: "outputFilename",
      type: "string",
      default: "main",
      description: "name of the output bundle file",
    })
    .option("s", { alias: "appSrc", type: "string", default: "./src" })
    .option("h", {
      alias: "appHtml",
      type: "string",
      default: "./public/index.html",
    })
    .option("c", {
      alias: "appWebpackCache",
      type: "string",
      default: "./node_modules/.cache/webpack",
    })
    .option("w", { alias: "appPublic", type: "string", default: "public" })
    .option("n", { alias: "nodeModulesDirs", type: "string", default: "" })
    .boolean("stats").argv as {
    e: string;
    o: string;
    s: string;
    h: string;
    c: string;
    w: string;
    stats: boolean;
    n: string;
    f: string;
  };
}

/**
 * runs build.config.js
 */
export function runBuildConfig(): BuildConfig {
  const buildConfigJsPath = path.resolve(
    fs.realpathSync(process.cwd()),
    "build.config.js"
  );
  if (fs.existsSync(buildConfigJsPath)) {
    const fn = require(buildConfigJsPath);
    return fn();
  }
  return {};
}

/**
 * read environment variables
 */
export function readEnvironmentVariables() {
  if (process.env["MODE"] === undefined) {
    process.env["MODE"] = "development";
  }
  const isEnvDevelopment = process.env["MODE"] === "development";
  const isEnvProduction = process.env["MODE"] === "production";
  const isEnvTest = process.env["MODE"] === "test";
  const isEnvProductionProfile = process.env["MODE"] === "production_profile";
  const shouldUseSourceMap = process.env["USE_SOURCE_MAP"] === "true";
  const host = process.env["HOST"] || "0.0.0.0";
  if (process.env["HOST"])
    console.log(
      chalk.cyan(
        `Attempting to bind to HOST environment variable: ${chalk.yellow(
          chalk.bold(host)
        )}`
      )
    );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log();

  const port =
    process.env["PORT"] !== undefined
      ? parseInt(process.env["PORT"], 10)
      : 3000;

  const protocol = process.env["PROTOCOL"] || "http"; // http or https

  const sockHost = process.env["WDS_SOCKET_HOST"];
  const sockPath = process.env["WDS_SOCKET_PATH"]; // default: '/ws'
  const sockPort = process.env["WDS_SOCKET_PORT"];

  // NODE_ENV if unspecified will be equal to MODE
  const nodeEnv = process.env["NODE_ENV"]
    ? process.env["NODE_ENV"]
    : process.env["MODE"];
  const babelEnv = process.env["BABEL_ENV"]
    ? process.env["BABEL_ENV"]
    : process.env["MODE"];

  // @ts-ignore-start
  process.env["NODE_ENV"] = nodeEnv;
  process.env["BABEL_ENV"] = babelEnv;
  // @ts-ignore-end

  const debugBuildTool = process.env["DEBUG_BUILD_TOOL"];

  return {
    isEnvDevelopment,
    isEnvProduction,
    isEnvTest,
    isEnvProductionProfile,
    shouldUseSourceMap,
    host,
    port,
    protocol,
    sockHost,
    sockPath,
    sockPort,
    nodeEnv,
    babelEnv,
    debugBuildTool,
  };
}

export function extractParams() {
  const envVars = readEnvironmentVariables();

  const buildConfig = runBuildConfig();

  const args = processArgs();
  const outputDir = path.resolve(args.o);
  const appSrc = path.resolve(args.s);
  const appHtml = path.resolve(args.h);
  const appWebpackCache = path.resolve(args.c);
  const appPath = fs.realpathSync(process.cwd());
  const appPackageJson = path.resolve(appPath, "package.json");
  const appPublic = path.resolve(args.w);
  const writeStats = args.stats;
  const appNodeModules = path.resolve(appPath, "node_modules");
  const additionalNodeModules = args.n !== "" ? args.n.split(":") : [];
  const outputFilename = args.f;

  const useTypeScript = fs.existsSync(path.resolve(appPath, "tsconfig.json"));

  function resolveApp(p: string) {
    return path.resolve(appPath, p);
  }

  const entry = args.e
    ? path.resolve(appPath, args.e)
    : resolveModule(resolveApp, path.resolve(appSrc, "index"));

  // entry file for service worker
  const swSrc = resolveModule(
    resolveApp,
    path.resolve(appSrc, "service-worker")
  );

  const appTsConfig = resolveApp("tsconfig.json");
  const appJsConfig = resolveApp("jsconfig.json");

  const publicUrlOrPath = getPublicUrlOrPath(
    process.env["NODE_ENV"] === "development",
    require(path.resolve(appPath, "package.json")).homepage,
    process.env["PUBLIC_URL"]
  );

  const formattedClientEnv = getClientEnvironment(
    publicUrlOrPath,
    { dotenv: ".env" },
    {
      nodeEnv: envVars.nodeEnv,
      sockPath: envVars.sockPath,
      sockHost: envVars.sockHost,
      sockPort: envVars.sockPort,
    }
  );

  const formattedNodeEnv = getServerEnvironment(
    publicUrlOrPath,
    { dotenv: ".env" },
    {
      nodeEnv: envVars.nodeEnv,
      sockPath: envVars.sockPath,
      sockHost: envVars.sockHost,
      sockPort: envVars.sockPort,
    }
  );

  return {
    ...envVars,
    entry,
    paths: {
      outputDir,
      appSrc,
      appHtml,
      appWebpackCache,
      appPackageJson,
      appPath,
      appPublic,
      appNodeModules,
      swSrc,
      appTsConfig,
      appJsConfig,
    },
    publicUrlOrPath,
    clientEnv: formattedClientEnv,
    serverEnv: formattedNodeEnv,
    writeStats,
    useTypeScript,
    ...buildConfig,
    additionalNodeModules,
    outputFilename,
  };
}

function readMultiCompilerEnvironmentVairables() {
  const hosts = process.env["HOSTS"]?.split(":");
  const ports = process.env["PORTS"]
    ?.split(":")
    .map((value) => parseInt(value));
  const protocols = process.env["PROTOCOLS"]?.split(":");

  return { hosts, ports, protocols };
}

export function extractMultiParams() {
  /**
   * The hosts, ports, protocols will be used if these are not undefined.
   * If hosts, ports, protocols are undefined, then, host, port, protocol will be used.
   */
  const envVars = readEnvironmentVariables();
  const multiEnvVars = readMultiCompilerEnvironmentVairables();

  const buildConfig = runBuildConfig();

  const appPath = fs.realpathSync(process.cwd());
  function resolveApp(p: string) {
    return path.resolve(appPath, p);
  }
  const appTsConfig = resolveApp("tsconfig.json");
  const appJsConfig = resolveApp("jsconfig.json");
  const appPackageJson = path.resolve(appPath, "package.json");
  const appNodeModules = path.resolve(appPath, "node_modules");
  const args = processArgs();
  const appWebpackCache = path.resolve(args.c);

  const globalPaths = {
    appPath,
    appTsConfig,
    appJsConfig,
    appNodeModules,
    appPackageJson,
    appWebpackCache,
  };

  const useTypeScript = fs.existsSync(path.resolve(appPath, "tsconfig.json"));

  buildConfig.multiConfigs?.forEach((config) => {
    const keys = Object.keys(config.paths) as (keyof MultiConfig["paths"])[];
    keys.forEach((key) => {
      config.paths[key] = path.resolve(config.paths[key]);
    });
  });

  return {
    ...buildConfig,
    ...envVars,
    ...multiEnvVars,
    globalPaths,
    useTypeScript,
  };
}
