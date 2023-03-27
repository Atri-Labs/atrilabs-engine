import { Configuration } from "webpack";
import { createNodeLibConfig } from "./node.lib.webpack.config";

export function createDevNodeConfig(options: {
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
  allowlist?: (string | ((moduleName: string) => boolean) | RegExp)[];
  babel?: {
    plugins?: [string, any][];
  };
  exclude?: string[];
  disableNodeExternals?: boolean;
}) {
  const baseConfig = createNodeLibConfig(options);

  baseConfig["watch"] = true;

  return baseConfig;
}
