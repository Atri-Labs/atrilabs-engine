import { Configuration as WebpackConfiguration, RuleSetRule } from "webpack";

export type AppConfigOptions = {
  isEnvDevelopment: boolean;
  isEnvTest: boolean;
  isEnvProduction: boolean;
  isEnvProductionProfile: boolean;
  clientEnv: {
    raw: { [key: string]: any };
    stringified: { [key: string]: any };
  };
  shouldUseSourceMap: boolean;
  entry: WebpackConfiguration["entry"];
  paths: {
    outputDir: string;
    appSrc: string;
    appWebpackCache: string;
    appTsConfig: string;
    appJsConfig: string;
    appNodeModules: string;
    appPackageJson: string;
    appHtml: string;
    // appPath is set as cwd for eslint plugin
    appPath: string;
    // service worker src path
    swSrc: string;
    appTsBuildInfoFile?: string;
  };
  publicUrlOrPath: string;
  moduleFileExtensions: string[];
  modules?: {
    additionalModulePaths?: string[];
    webpackAliases?: any;
  };
  imageInlineSizeLimit: number;
  shouldInlineRuntimeChunk: boolean;
  eslint?: {
    disableESLintPlugin?: boolean;
    emitErrorsAsWarnings?: boolean;
  };
  useTypeScript: boolean;
  generateIndexHtml?: boolean;
  additionalInclude?: string[];
  additionalNodeModules?: string[];
  exclude?: string[];
  outputFilename: string;
  customLoaders?: RuleSetRule[];
  babel?: {
    plugins?: [string, any][];
  };
};
