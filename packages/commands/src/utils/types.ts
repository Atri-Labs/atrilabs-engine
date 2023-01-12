import { Configuration as DevConfiguration } from "webpack-dev-server";
import { Compiler, Configuration } from "webpack";
import webpack from "webpack";

export type Middlewares = (
  app: Express.Application,
  compiler: webpack.Compiler,
  config: webpack.Configuration
) => void;

export type PrepareConfig = (config: Configuration) => void;

export type ApplyPlugins = (compiler: Compiler) => void;

export type MultiConfig = {
  entry: Configuration["entry"];
  paths: {
    outputDir: string;
    appSrc: string;
    appHtml: string;
    appPublic: string;
    swSrc: string;
  };
  sockHost?: string;
  sockPort?: string;
  sockPath?: string;
  publicUrlOrPath: string;
  prepareConfig?: PrepareConfig;
  middlewares?: Middlewares;
  applyPlugins?: ApplyPlugins;
  proxy?: DevConfiguration["proxy"];
};

export type BuildConfig = {
  proxy?: DevConfiguration["proxy"];
  middlewares?: Middlewares;
  // change config in place before the config is passed to webpack()
  prepareConfig?: PrepareConfig;
  // apply plugins before compiler.run() has been called
  applyPlugins?: ApplyPlugins;

  // Multi Compiler options
  multiConfigs?: MultiConfig[];
};
