import { Configuration, RuleSetRule } from "webpack";
import { createNodeConfig } from "./node.webpack.config";

export function createNodeLibConfig(options: {
  isEnvDevelopment: boolean;
  isEnvProductionProfile: boolean;
  isEnvTest: boolean;
  isEnvProduction: boolean;
  shouldUseSourceMap: boolean;
  entry: Configuration["entry"];
  serverEnv: {
    raw: { [key: string]: any };
    stringified: { [key: string]: any };
  };
  paths: {
    outputDir: string;
    appSrc: string;
    appPath: string;
    appWebpackCache: string;
    appTsConfig: string;
    appJsConfig: string;
    appNodeModules: string;
    appPackageJson: string;
    appTsBuildInfoFile?: string;
  };
  modules?: {
    additionalModulePaths?: string[];
    webpackAliases?: any;
  };
  moduleFileExtensions: string[];
  useTypeScript: boolean;
  eslint?: {
    disableESLintPlugin?: boolean;
    emitErrorsAsWarnings?: boolean;
  };
  additionalNodeModules?: string[];
  outputFilename: string;
  additionalInclude?: string[];
  allowlist?: string[];
  babel?: {
    plugins?: [string, any][];
  };
  exclude?: string[];
  customLoaders?: RuleSetRule[];
}) {
  const baseConfig = createNodeConfig(options);

  const { paths, outputFilename } = options;

  baseConfig["output"] = {
    path: paths.outputDir,
    filename: outputFilename,
    libraryTarget: "commonjs2",
  };

  return baseConfig;
}
