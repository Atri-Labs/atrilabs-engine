import { extractParams } from "@atrilabs/commands-builder";
import { ToolConfig } from "@atrilabs/core";
import webpack, { Configuration, RuleSetRule } from "webpack";
import createManifestRegistryConfig from "../../commons/manifest-registry.webpack.config";
import { CorePkgInfo } from "../../commons/types";
import { ManifestRegistryLibPlugin } from "./webpack-plugins/ManifestRegistryLibPlugin";

export default function startManifestRegistryLibDevServer(
  params: Omit<ReturnType<typeof extractParams>, "exclude"> & {
    customLoaders?: RuleSetRule[];
    generateIndexHtml?: boolean;
    babel?: {
      plugins?: [string, any][];
    };
  } & {
    externals: Configuration["externals"];
    toolConfig: ToolConfig;
    corePkgInfo: CorePkgInfo;
    exclude?: RuleSetRule["exclude"];
  }
) {
  const webpackConfig = createManifestRegistryConfig(params);

  webpackConfig.watch = true;

  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new ManifestRegistryLibPlugin(),
  ];

  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.log(err);
    }
    if (stats?.hasErrors()) {
      console.log(stats.toJson().errors);
    }
  });
}
